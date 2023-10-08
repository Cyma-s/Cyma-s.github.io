---
title: JDK 의 Synchronizer 파헤치기
date: 2023-10-08 22:31:49 +0900
updated: 2023-10-08 23:20:55 +0900
tags:
  - jdk
---

## `synchronizer.cpp`

```cpp
void ObjectSynchronizer::enter(Handle obj, BasicLock* lock, JavaThread* current) {
  if (obj->klass()->is_value_based()) {
    handle_sync_on_value_based_class(obj, current);
  }

  current->inc_held_monitor_count();

  if (!useHeavyMonitors()) {
    if (LockingMode == LM_LIGHTWEIGHT) {
      // Fast-locking does not use the 'lock' argument.
      LockStack& lock_stack = current->lock_stack();
      if (lock_stack.can_push()) {
        markWord mark = obj()->mark_acquire();
        if (mark.is_neutral()) {
          assert(!lock_stack.contains(obj()), "thread must not already hold the lock");
          // Try to swing into 'fast-locked' state.
          markWord locked_mark = mark.set_fast_locked();
          markWord old_mark = obj()->cas_set_mark(locked_mark, mark);
          if (old_mark == mark) {
            // Successfully fast-locked, push object to lock-stack and return.
            lock_stack.push(obj());
            return;
          }
        }
      }
      // All other paths fall-through to inflate-enter.
    } else if (LockingMode == LM_LEGACY) {
      markWord mark = obj->mark();
      if (mark.is_neutral()) {
        // Anticipate successful CAS -- the ST of the displaced mark must
        // be visible <= the ST performed by the CAS.
        lock->set_displaced_header(mark);
        if (mark == obj()->cas_set_mark(markWord::from_pointer(lock), mark)) {
          return;
        }
        // Fall through to inflate() ...
      } else if (mark.has_locker() &&
                 current->is_lock_owned((address) mark.locker())) {
        assert(lock != mark.locker(), "must not re-lock the same lock");
        assert(lock != (BasicLock*) obj->mark().value(), "don't relock with same BasicLock");
        lock->set_displaced_header(markWord::from_pointer(nullptr));
        return;
      }

      // The object header will never be displaced to this lock,
      // so it does not matter what the value is, except that it
      // must be non-zero to avoid looking like a re-entrant lock,
      // and must not look locked either.
      lock->set_displaced_header(markWord::unused_mark());
    }
  } else if (VerifyHeavyMonitors) {
    guarantee((obj->mark().value() & markWord::lock_mask_in_place) != markWord::locked_value, "must not be lightweight/stack-locked");
  }

  // An async deflation can race after the inflate() call and before
  // enter() can make the ObjectMonitor busy. enter() returns false if
  // we have lost the race to async deflation and we simply try again.
  while (true) {
    ObjectMonitor* monitor = inflate(current, obj(), inflate_cause_monitor_enter);
    if (monitor->enter(current)) {
      return;
    }
  }
}

void ObjectSynchronizer::exit(oop object, BasicLock* lock, JavaThread* current) {
  current->dec_held_monitor_count();

  if (!useHeavyMonitors()) {
    markWord mark = object->mark();
    if (LockingMode == LM_LIGHTWEIGHT) {
      // Fast-locking does not use the 'lock' argument.
      if (mark.is_fast_locked()) {
        markWord unlocked_mark = mark.set_unlocked();
        markWord old_mark = object->cas_set_mark(unlocked_mark, mark);
        if (old_mark != mark) {
          // Another thread won the CAS, it must have inflated the monitor.
          // It can only have installed an anonymously locked monitor at this point.
          // Fetch that monitor, set owner correctly to this thread, and
          // exit it (allowing waiting threads to enter).
          assert(old_mark.has_monitor(), "must have monitor");
          ObjectMonitor* monitor = old_mark.monitor();
          assert(monitor->is_owner_anonymous(), "must be anonymous owner");
          monitor->set_owner_from_anonymous(current);
          monitor->exit(current);
        }
        LockStack& lock_stack = current->lock_stack();
        lock_stack.remove(object);
        return;
      }
    } else if (LockingMode == LM_LEGACY) {
      markWord dhw = lock->displaced_header();
      if (dhw.value() == 0) {
        // If the displaced header is null, then this exit matches up with
        // a recursive enter. No real work to do here except for diagnostics.
#ifndef PRODUCT
        if (mark != markWord::INFLATING()) {
          // Only do diagnostics if we are not racing an inflation. Simply
          // exiting a recursive enter of a Java Monitor that is being
          // inflated is safe; see the has_monitor() comment below.
          assert(!mark.is_neutral(), "invariant");
          assert(!mark.has_locker() ||
                 current->is_lock_owned((address)mark.locker()), "invariant");
          if (mark.has_monitor()) {
            // The BasicLock's displaced_header is marked as a recursive
            // enter and we have an inflated Java Monitor (ObjectMonitor).
            // This is a special case where the Java Monitor was inflated
            // after this thread entered the stack-lock recursively. When a
            // Java Monitor is inflated, we cannot safely walk the Java
            // Monitor owner's stack and update the BasicLocks because a
            // Java Monitor can be asynchronously inflated by a thread that
            // does not own the Java Monitor.
            ObjectMonitor* m = mark.monitor();
            assert(m->object()->mark() == mark, "invariant");
            assert(m->is_entered(current), "invariant");
          }
        }
#endif
        return;
      }

      if (mark == markWord::from_pointer(lock)) {
        // If the object is stack-locked by the current thread, try to
        // swing the displaced header from the BasicLock back to the mark.
        assert(dhw.is_neutral(), "invariant");
        if (object->cas_set_mark(dhw, mark) == mark) {
          return;
        }
      }
    }
  } else if (VerifyHeavyMonitors) {
    guarantee((object->mark().value() & markWord::lock_mask_in_place) != markWord::locked_value, "must not be lightweight/stack-locked");
  }

  // We have to take the slow-path of possible inflation and then exit.
  // The ObjectMonitor* can't be async deflated until ownership is
  // dropped inside exit() and the ObjectMonitor* must be !is_busy().
  ObjectMonitor* monitor = inflate(current, object, inflate_cause_vm_internal);
  if (LockingMode == LM_LIGHTWEIGHT && monitor->is_owner_anonymous()) {
    // It must be owned by us. Pop lock object from lock stack.
    LockStack& lock_stack = current->lock_stack();
    oop popped = lock_stack.pop();
    assert(popped == object, "must be owned by this thread");
    monitor->set_owner_from_anonymous(current);
  }
  monitor->exit(current);
}
```

- `ObjectSynchronizer::enter`
객체가 값 기반 클래스인지 확인한다. 

## Lock 종류

### LightWeight Lock (LWLock)

최적화된 락이다. 여러 스레드가 동시에 동기화 블록이나 메서드에 접근하지 않을 것으로 예상될 때 사용된다.  
스레드가 실제로 대기 상태로 전환되지 않고 CAS(Compare-And-Swap) 과 같은 원자적 연산을 사용하여 락 상태를 변경한다.  

오버헤드가 낮지만, 두 개 이상의 스레드가 동시에 동기화에 접근하려고 할 때 contention 이 발생하면 더 heavy 한 락 방식으로 업그레이드 된다.  

### Legacy Lock

이전 버전의 HotSpot JVM 에서 사용되던 방식을 기반으로 한다.  
이 방식에서도 먼저 락 상태를 원자적 연산을 사용하여 변경하려고 시도한다. 해당 시도가 실패하면 `ObjectMonitor` 로의 업그레이드가 발생한다.  

### `ObjectMonitor`

락과 관련된 모든 정보와 기능을 제공하는 별도의 데이터 구조이다.  
LWLcok 이나 Legacy Lock 방식에서 여러 스레드가 동시에 동기화에 접근하려 해서 발생하는 Contention 이 생기면 `ObjectMonitor` 구조로 락이 '부풀려진다' (inflate)

`ObjectMonitor` 는 동기화에 대한 상세 정보를 저장한다. (락의 소유자, 대기 중인 스레드, 등록된 조건 변수) 스레드가 락을 기다리게 하거나, notify 를 받게 할 수 있다. 

오버헤드가 높지만 높은 수준의 contention 에서도 잘 동작하며 스레드 간의 통신, 조정을 효과적으로 지원한다.  

`jdk/src/hotspot/share/runtime/objectMonitor.cpp` 에서 구현을 확인할 수 있다.

#### enter

```cpp
bool ObjectMonitor::enter(JavaThread* current) {
  // The following code is ordered to check the most common cases first
  // and to reduce RTS->RTO cache line upgrades on SPARC and IA32 processors.

  void* cur = try_set_owner_from(nullptr, current);
  if (cur == nullptr) {
    assert(_recursions == 0, "invariant");
    return true;
  }

  if (cur == current) {
    // TODO-FIXME: check for integer overflow!  BUGID 6557169.
    _recursions++;
    return true;
  }

  if (LockingMode != LM_LIGHTWEIGHT && current->is_lock_owned((address)cur)) {
    assert(_recursions == 0, "internal state error");
    _recursions = 1;
    set_owner_from_BasicLock(cur, current);  // Convert from BasicLock* to Thread*.
    return true;
  }

  // We've encountered genuine contention.
  assert(current->_Stalled == 0, "invariant");
  current->_Stalled = intptr_t(this);

  // Try one round of spinning *before* enqueueing current
  // and before going through the awkward and expensive state
  // transitions.  The following spin is strictly optional ...
  // Note that if we acquire the monitor from an initial spin
  // we forgo posting JVMTI events and firing DTRACE probes.
  if (TrySpin(current) > 0) {
    assert(owner_raw() == current, "must be current: owner=" INTPTR_FORMAT, p2i(owner_raw()));
    assert(_recursions == 0, "must be 0: recursions=" INTX_FORMAT, _recursions);
    assert(object()->mark() == markWord::encode(this),
           "object mark must match encoded this: mark=" INTPTR_FORMAT
           ", encoded this=" INTPTR_FORMAT, object()->mark().value(),
           markWord::encode(this).value());
    current->_Stalled = 0;
    return true;
  }

  assert(owner_raw() != current, "invariant");
  assert(_succ != current, "invariant");
  assert(!SafepointSynchronize::is_at_safepoint(), "invariant");
  assert(current->thread_state() != _thread_blocked, "invariant");

  // Keep track of contention for JVM/TI and M&M queries.
  add_to_contentions(1);
  if (is_being_async_deflated()) {
    // Async deflation is in progress and our contentions increment
    // above lost the race to async deflation. Undo the work and
    // force the caller to retry.
    const oop l_object = object();
    if (l_object != nullptr) {
      // Attempt to restore the header/dmw to the object's header so that
      // we only retry once if the deflater thread happens to be slow.
      install_displaced_markword_in_object(l_object);
    }
    current->_Stalled = 0;
    add_to_contentions(-1);
    return false;
  }

  JFR_ONLY(JfrConditionalFlush<EventJavaMonitorEnter> flush(current);)
  EventJavaMonitorEnter event;
  if (event.is_started()) {
    event.set_monitorClass(object()->klass());
    // Set an address that is 'unique enough', such that events close in
    // time and with the same address are likely (but not guaranteed) to
    // belong to the same object.
    event.set_address((uintptr_t)this);
  }

  { // Change java thread status to indicate blocked on monitor enter.
    JavaThreadBlockedOnMonitorEnterState jtbmes(current, this);

    assert(current->current_pending_monitor() == nullptr, "invariant");
    current->set_current_pending_monitor(this);

    DTRACE_MONITOR_PROBE(contended__enter, this, object(), current);
    if (JvmtiExport::should_post_monitor_contended_enter()) {
      JvmtiExport::post_monitor_contended_enter(current, this);

      // The current thread does not yet own the monitor and does not
      // yet appear on any queues that would get it made the successor.
      // This means that the JVMTI_EVENT_MONITOR_CONTENDED_ENTER event
      // handler cannot accidentally consume an unpark() meant for the
      // ParkEvent associated with this ObjectMonitor.
    }

    OSThreadContendState osts(current->osthread());

    assert(current->thread_state() == _thread_in_vm, "invariant");

    for (;;) {
      ExitOnSuspend eos(this);
      {
        ThreadBlockInVMPreprocess<ExitOnSuspend> tbivs(current, eos, true /* allow_suspend */);
        EnterI(current);
        current->set_current_pending_monitor(nullptr);
        // We can go to a safepoint at the end of this block. If we
        // do a thread dump during that safepoint, then this thread will show
        // as having "-locked" the monitor, but the OS and java.lang.Thread
        // states will still report that the thread is blocked trying to
        // acquire it.
        // If there is a suspend request, ExitOnSuspend will exit the OM
        // and set the OM as pending.
      }
      if (!eos.exited()) {
        // ExitOnSuspend did not exit the OM
        assert(owner_raw() == current, "invariant");
        break;
      }
    }

    // We've just gotten past the enter-check-for-suspend dance and we now own
    // the monitor free and clear.
  }

  add_to_contentions(-1);
  assert(contentions() >= 0, "must not be negative: contentions=%d", contentions());
  current->_Stalled = 0;

  // Must either set _recursions = 0 or ASSERT _recursions == 0.
  assert(_recursions == 0, "invariant");
  assert(owner_raw() == current, "invariant");
  assert(_succ != current, "invariant");
  assert(object()->mark() == markWord::encode(this), "invariant");

  // The thread -- now the owner -- is back in vm mode.
  // Report the glorious news via TI,DTrace and jvmstat.
  // The probe effect is non-trivial.  All the reportage occurs
  // while we hold the monitor, increasing the length of the critical
  // section.  Amdahl's parallel speedup law comes vividly into play.
  //
  // Another option might be to aggregate the events (thread local or
  // per-monitor aggregation) and defer reporting until a more opportune
  // time -- such as next time some thread encounters contention but has
  // yet to acquire the lock.  While spinning that thread could
  // spinning we could increment JVMStat counters, etc.

  DTRACE_MONITOR_PROBE(contended__entered, this, object(), current);
  if (JvmtiExport::should_post_monitor_contended_entered()) {
    JvmtiExport::post_monitor_contended_entered(current, this);

    // The current thread already owns the monitor and is not going to
    // call park() for the remainder of the monitor enter protocol. So
    // it doesn't matter if the JVMTI_EVENT_MONITOR_CONTENDED_ENTERED
    // event handler consumed an unpark() issued by the thread that
    // just exited the monitor.
  }
  if (event.should_commit()) {
    event.set_previousOwner(_previous_owner_tid);
    event.commit();
  }
  OM_PERFDATA_OP(ContendedLockAttempts, inc());
  return true;
}
```

1. 락이 null 인지 확인 후, 락이 없으면 현재 스레드가 락을 즉시 획득하고, 함수가 반환된다. 
2. 이미 락을 보유하고 있는 스레드가 다시 락을 획득하려고 하는 경우, 락의 재진입 수를 증가시키고 반환한다.
3. `LockingMode` 가 Legacy Lock 이고, 현재 스레드가 락을 이미 소유하고 있으면 락의 재진입 수를 1로 설정하고 함수가 반환된다.
4. 만약 contention (경쟁 상황) 이 발생하면 스레드는 락을 즉시 획득하기 위해 spin 을 시도할 수 있다. 짧은 시간 동안 락 획득을 계속 시도한다.
5. spin 이 실패하거나, spin 을 건너뛰는 경우, 스레드는 락을 획득할 때까지 대기한다.
6. 락을 성공적으로 획득한 후에는 특정 진단 및 모니터링 도구에 대한 추가 정보가 전달된다.
7. true 를 반환하여 락 획득에 성공했음을 나타낸다.

#### `ObjectWaiter`

대기 집합 개념은 `ObjectWaiter` 로 구현된다.

```cpp
ObjectWaiter::ObjectWaiter(JavaThread* current) {
  _next     = nullptr;
  _prev     = nullptr;
  _notified = 0;
  _notifier_tid = 0;
  TState    = TS_RUN;
  _thread   = current;
  _event    = _thread->_ParkEvent;
  _active   = false;
  assert(_event != nullptr, "invariant");
}
```