---
title: 멀티코어컴퓨팅
date: 2024-04-22 15:08:20 +0900
updated: 2024-04-22 19:58:12 +0900
tags:
  - school
---

## Introduction to Multicore Computing

### Multicore Processor

- A single computing component with two or more independent cores
- Core: computing unit that reads / executes program instructions
- Multiple cores run multiple instructions at the same time (concurrently)
- Increase overall program speed (performance)
- performance gained by multi-core processor
- desktop PCs, mobile devices, servers

### Manycore processor (GPU)

- multi-core architectures with an especially high number of cores (thounds)
- CUDA
	- Compute Unified Device Architecture
- OpenCL

### Thread / Process

- Both: independent sequence of execution
- Process: run in seperate memory space
- Thread
	- run in shared memory space in a process
	- One process may have multiple threads
- Multithreaded Program
	- a program running with multiple threads that is executed simultaneously

### What is Parallel Computing?

- Parallel computing
	- using multiple processors in parallel to solve problems more quickly than with a single processor
- Examples of parallel machines:
	- A **cluster computer** that contains multiple PCs combined together with a high speed network
	- A shared memory multiprocessor by connecting multiple processors to a single memory system
	- A chip Multi-Processor (CMP) contains multiple processors (called cores) on a single chip
- Concurrent execution comes from desire for performance; unlike the inherent concurrency in a multi-user distributed system

### Parallelism vs Concurrency

- Parallel Programming
	- Using additional computational resources to produce an answer faster
	- Problem of using extra resources effectively?
	- Ex. summing up all the numbers in an array with multiple n processors
- Concurrent Programming
	- Correctly and efficiently controlling access by multiple threads to shared resources
	- Problem of preventing a bad interleaving of operations from different threads
- Example
	- Implementation of dictionary with hashtable
		- operations insert, update, lookup, delete occur simultaneously (concurently)
		- Multiple threads acceess the same hashtable
	- Web Visit Counter
- Often used interchangeably
- In practice, the distinction between parallelism and concurrency is not absolute
- Many multithreaded programs have aspects of both

### Parallel Programming Techniques

- Shared Memory
	- OpenMP, pthreads
- Distributed Memory (several computer 로 나눠지지만, processor 는 다른 컴퓨터의 memory 에 직접 접근하지는 못함)
	- MPI
- Distributed / Shared Memory (Share memory 를 가지고 있지만, 직접 접속은 할 수 없음)
	- Hybrid (MPI + OpenMP)
- GPU Parallel Programming
	- CUDA Programming
	- OpenCL

### Parallel Processing Systems

- Small-Scale Multicore Environment
	- Notebook, Workstation, Server
	- OS supports multicore
	- POSIX threads (pthread), win32 thread
	- GPGPU-based supercomputer
	- Development of CUDA/OpenCL/GPGPU
- Large-Scale Multicore Environment
	- Supercomputer: more than 10000 cores
	- Clusters
	- Servers
	- Grid Computing

### Parallel Computing vs Distributed Computing

- Parallel Computing
	- all processors may have access to a shared memory to exchange information between processors.
	- more tightly coupled to multi-threading
- Distributed Computing
	- multiple computers communicate through network
	- each processor has its own private memory (distributed memory)
	- executing sub-tasks on different machines and then merging the results. (Each computer has a sub-result)
- Distributed 는 parallel 의 한 종류이다.
- No Clear Distinction

### Cluster Computing vs Grid Computing

- Cluster Computing
	- a set of loosely connected computers that work together so that in many respects they can be viewed as a single system
	- good price / performance
	- memory not shared
- Grid Computing
	- federation of computer resources from multiple locations to reach a common goal (a large scale distributed system)
	- grid tend to be more loosely coupled, heterogeneous, and geographically dispersed

### Cloud Computing

- shares networked computing resources rather than having local servers or personal devices to handle applications
- “Cloud” is used as a metaphor for “Internet” meaning “a type of Internet-based computing”
- different services - such as servers, storage and applications - are delivered to an user’s computers and smart phones through the Internet.

### Good Parallel Program

- Writing good parallel programs
	- Correct
	- Good Performance
	- Scalability
	- Load Balance
	- Portability
	- Hardware Specific Utilization

### Characteristics of Distributed System 
-  Resource Sharing: It is the ability to use any Hardware, Software, or Data anywhere in the System. 
- Openness: It is concerned with Extensions and improvements in the system (i.e., How openly the software is developed and shared with others) 
- Concurrency: It is naturally present in Distributed Systems, that deal with the same activity or functionality that can be performed by separate users who are in remote locations. Every local system has its independent Operating Systems and Resources. 
- Scalability: It increases the scale of the system as a number of processors communicate with more users by accommodating to improve the responsiveness of the system. 
- Fault tolerance: It cares about the reliability of the system if there is a failure in Hardware or Software, the system continues to operate properly without degrading the performance of the system
- Transparency: It hides the complexity of the Distributed Systems to the Users and Application programs as there should be privacy in every system. 
- Heterogeneity: Networks, computer hardware, operating systems, programming languages, and developer implementations can all vary and differ among dispersed system components.

#### Challenges of Distributed Systems 

- Network latency: The communication network in a distributed system can introduce latency, which can affect the performance of the system. 
- Distributed coordination: Distributed systems require coordination among the nodes, which can be challenging because of the distributed nature of the system. 
- Data consistency: Maintaining data consistency across multiple nodes in a distributed system can be challenging.

### Advantages 
1. High Performance 
	a. Distributed systems can outperform centralised systems by utilising the capabilities of several computers to handle the demand.
2. Reliable 
	a. In terms of failures, distributed systems are significantly more dependable than single systems. Even if a single node fails, it does not affect the remaining servers. Other nodes can continue to operate normally. 
3. Scalable 
4. Expandability 
5. Availability 
6. Reduced latency (short distance) 
	a. Low latency is achieved using distributed systems. If a node is closer to the user, the distributed system ensures that traffic from that node reaches the system. As a result, the user may realise that it takes significantly less time to serve them. 
7. Secure 
	a. Distributed systems include security safeguards that prevent data breaches and illegal access to any data, hardware or software of an organization. 
8. Cost-effectiveness 
	a. Distributed systems, despite their high expense of implementation, are reasonably cost-effective in the long term. In contrast to a mainframe computer, which is made up of multiple processors, a distributed system is made up of several computers working together. This infrastructure is significantly less expensive than a mainframe system. 
9. Geographic Distribution a. A feature of a distributed system is geographic distribution. It allows companies and organisations to provide users with services in different areas.

#### Disadvantages 
1. High cost. 
2. The problem is finding the fault. 
3. More space is needed. 
4. The increased infrastructure is needed. 
5. In distributed systems, it is challenging to provide adequate security because both the nodes and the connections must be protected.

### Moore’s Law: Review

- Doubling of the number of transistors on integrated circuits roughly every two years.
- Microprocessors have become smaller, denser, and more powerful.
- processing speed, memory capacity, sensors and even the number and size of pixels in digital cameras. All of these are improving at (roughly) exponenetial rates

### Computer Hardware Trend

- Chip density is continuing increase ~2x every 2years
	- Clock speed is not increasing anymore (in high clock speed, power consumption and heat generation is too high to be tolerated)
	- number of cores may double instead
- No more hidden parallelism to be found
- Transistor number still rising
- Clock speed flattening sharply.
=> Need Multicore programming!

- All computers are now parallel computers.
- Multi-core processors represent an important new trend in computer architecture.
	- Decreased power consumption and heat generation
	- Minimized wire lengths and interconnect latencies.
- They enable tru thread-level parallelism with great energy efficiency and scalability.

## Why writing (fast) parallel programs is hard

### Principles of Parallel Computing

- Finding enough parallelism (Amdahl’s Law)
- granularity
- Locality
- Load balance
- Coordination and synchronization
→ All of these things makes parallel programming even harder than sequential programming

### Finding Enough Parallelism

- Suppose only part of an application seems parallel
- Amdahl’s law
	- let s be the fraction of work done sequentially, so (1-s) is fraction parallelizable
	- P = number of processors
	- $Speedup(P) = Time(1) / Time(P) <= \frac{1}{s + \frac{(1-s)}{P}} <= 1/s$
- Even if the parallel part speeds up perfectly performance is limited by the sequential part

### Overhead of Parallelism

- Given enough parallel work, this is the biggest barrier to getting desired speedup
- Parallelism overheads include:
	- cost of starting a thread or process
	- cost of communicating shared data
	- cost of synchronizing
	- extra (redundant) computation
- Each of these can be in the range of milliseconds (=millions of flops) on some systems
- Tradeoff: Algorithm needs sufficiently large units of work to run fast in parallel, but not so large that there is not enough parallel work

### Locality and Parallelism

- Large memories are slow, fast memories are small
- Storage hierarchies are large and fast on average
- Parallel processors, collectively, have large, fast cache
	- the slow accesses to “remote” edata we call “communication”
- Algorithm should do most work on local data

### Load imbalance

- Load imbalance is the time that some processors in the system are idle due to
	- insufficient parallelism (during that phase)
	- unequal size tasks
- Algoroithm needs to balance load

## Hyper-threading

- Hyper-threading is Intel’s proprietary simultaneous multithreading implementation used to improve parallelization of computations (doing multiple tasks at once) performed on x86 microprocessors.

## Performance of Parallel Programs

### Flynn’s Taxonomy on Parallel Computer

- Classified with two independent dimension
	- Instruction stream
	- Data stream

### SISD (Single Instruction, Single Data)

- A serial (non-parallel) computer
- This is the oldest and even today, the most common type of computer

### SIMD (Single Instruction Multiple Data)

- All processing units execute the same instruction at any given clock cycle
- Best suited for specialized problems characterized by a high degree of regularity, such as graphics/image processing

### MISD (Multiple Instruction, Single Data)

- Each processing unit operates on the data independently via separate instruction streams
- Few actual examples of this class of parallel computer have ever existed.

### MIMD (Multiple Instruction, Multiple Data)

- Every processor may be executing a different instruction stream
- Every processor may be working with a different data stream
- the most common type of parallel computer
- Most modern supercomputers fall into this category

### Creating a Parallel Program

1. Decomposition
2. Assignment
3. Orchestration/Mapping

### Decomposition

- Break up computation into tasks to be divided among processes
- identify concurrency and decide level at which to exploit it

#### Domain Decomposition

- Data associated with a problem is decomposed.
- Each parallel task then works on a portion of data.

#### Functional Decomposition

- the focus is on the computation that is to be performed rather than on the data
- problem is decomposed according to the work that mulst be done.
- Each task then performs a portion of the overall work.

### Assignment

- Assign tasks to threads
	- Balance workload, reduce communication and management cost
	- Together with decomposition, also called partitioning
- Can be performed statically, or dynamically
- Goal
	- Balanced workload
	- Reduced communication costs

### Orchestration

- Structuring communication and synchronization
- Organizing data structures in memory and scheduling tasks temporally
- Goals
	- Reduce cost of communication and synchronization as seen by processors
	- Reserve locality of data reference (including data structure organization)

### Mapping

- Mapping threads to execution units (CPU cores)
- Parallel application treis to use the entire machine
- Usually a job for OS
- Mapping decision
	- Place related threads (cooperating threads) on the same processor
	- maximize locality, data sharing, minimize costs of comm/sync

### Performance of Parallel Programs

- What factors affect the performance?
	- Decomposition
		- Coverage of parallelism in algorithm
	- Assignment
		- Granularity of partitioning among processors
	- Orchestration/Mapping
		- Locality of computation and communication

### Coverage (Amdahl’s Law)

- Potential program speedup is defined by the fraction of code that can be parallelized
- speed up은 sequential work 의 비율에 달려있다.

### Amdahl’s Law

- p = fraction of work that can be parallelized
- n = the number of processor
- s = 1-p

$$speedup = \frac{1}{{(1 - p) + \frac{p}{n}}}$$

### Implications of Amdahl’s Law

- Speeedup tends to 1/(1-p) as number of processors tends to infinity
- Parallel programming is worthwhile when programs have a lot of work that is parallel in nature

### Performance Scalability

- Scalability: the capable of a system to increase total throughput under an increased load when resources (typically hardwares) are added

### Granularity (work units)

- Granularity is a qualitative measure of the ratio of computation to communication
	- Coarse: relatively large amounts of computational work are done between communication events
	- Fine: relatively small amounts of computational work are done between communication events
- Computation stages are typically separated from periods of communication by synchronization events
- Granularity
	- the extent to which a system is broken down into small parts
- Coarse-grained systems
	- consist of fewer, larger components than fine-grained systems
	- regards large subcomponents
- Fine-grained systems
	- regards smaller components of which the larger ones are composed

### Fine vs Coarse Granularity

- Fine-grain Parallelism
	- Low computation to communication ratio
	- Small amounts of computational work between communication stages
	- High communication overhead
- Coarse-grain Parallelism
	- High computation to communication ratio
	- Large amounts of computational work between communication events
- The most efficient granularity is dependent on the algorithm and the hardware
- In most cases the over head associated with communications and synchronization is high relative to execution speed so it’s advantageous to have **coarse granularity**.
- Fine-grain parallelism can help reduce overheads due to load imbalance.

### Load Balancing

- distributing approximately equal amounts of work among tasks so that all tasks are kept busy all of the time.
- It can be considered a minimization of task idle time.
- For example, if all tasks are subject to a barrier syncrhonization point, the slowest task will determine the overall performance.

#### General Load Balancing Problem

- The whole work should be completed as fast as possible.
- As workers are very expensive, they should be kept busy.
- The work should be distributed fairly. About the same amount of work should be assigned to every worker.
- There are precedence constraints between different tasks (we can start building the roof only after finishing the walls) Thus we also have to find a clever processing order of the different jobs.

#### Load Balancing Problem

- Processors that finish early have to wait for the processor with the largest amount of work to complete
	- Leads to idle time, lowers utilization

#### Static load balancing

- Programmer make decisions and assigns a fixed amount of work to each processing core a priority
- Low run time overhead
- Works well for homogeneous multicores
	- All core are the same
	- Each core has an equal amount of work
- Not so well for heterogeneous multicores
	- Some cores may be faster than others
	- Work distribution is uneven

#### Dynamic Load Balancing

- When one core finishes its allocated work, it takes work from a work queue or a core with the heaviest workload
- Adapt partitioning at run time to balance load
- High runtime overhead
- Ideal for codes where work is uneven, unpredictable, and in heterogeneous multicore

### Granularity and Performance Tradeoffs

1. Load balancing
	- How well is work distributed among cores?
2. Synchronization/Communication
	- Communication Overhead?

### Communication

- With message passing, programmer has to understand the computation and orchestrate the communication accordingly
	- Point to Point
	- Broadcast (one to all) and Reduce (all to one)
	- All to All (each processor sends its data to all others)
	- Scatter (one to several) and Gather (several to one)

#### Factors to consider for communication

- Cost of communications
	- Inter-task communication virtually always implies overhead.
	- Communications frequently require some type of synchronization between tasks, which can result in tasks spending time ‘waiting’ instead of doing work.
- Latency vs Bandwidth
	- Latency
		- the time it takes to send a minimal (0 byte) message from point A to point B
	- Bandwidth 
		- the amount of data that can be communicated per unit of time.
	- Sending many small messages can cause latency to dominate communication overheads
	- Often it is more efficient to package small messages into a larger message.
- Synchronous vs asynchronous
	- Synchronous: require some type of handshaking between tasks that share data
	- Asynchronous: transfer data independently from one another.
- Scope of communication
	- Point-to-point
	- collective

#### MPI: Message Paassing Library

- MPI: portable specification
	- Not a language or compiler specification
	- Not a specific implementation or product
	- SPMD model (same program, multiple data)
- For parallel computers, clusters, and heterogeneous networks, multicores
- Multiple communication modes allow precise buffer management
- Extensive collective operations for scalable global communication

#### Point-to-Point

- Basic method of communication between two processors
	- Originating processor “sends” messages to destination processor
	- Destination processor then “receives” the message
- The message commonly includes
	- Data or other information
	- Length of the message
	- Destination address and possibly a tag

#### Synchronous vs Asynchronous Messages

- Synchronous send
	- Sender notified when message is received
- Asynchronous send
	- Sender only knows that message is sent

#### Blocking vs Non-Blocking Messages

- Blocking messages
	- Sender waits until message is transmitted: buffer is empty
	- Receiver waits until message is received: buffer is full
	- Potential for deadlock
- Non-blocking
	- Processing continues even if message hasn’t been transmitted
	- Avoid idle time and deadlocks

#### Broadcast

- One processor sends the same information to many other processors
	- MPI_BCAST

#### Reduction

- Example: every processor starts with a value and needs to know the sum of values stored on all processors
- A reduction combines data from all processors and returns it to a single process
	- MPI_REDUCE
	- Can apply any associative operation on gathered data
		- ADD, OR, AND, MAX, MIN, etc…
	- No processor can finish reduction before each processor has contributed a value
- BCAST/REDUCE can reduce programming complexity and may be more efficient in some programs.

### Synchronization

- Coordination of simultaneous events (threads / processes) in order to obtain correct runtime order and avoid unexpected condition
- Types of synchronization
	- Barrier
		- Any thread / process must stop at this point (barrier) and cannot proceed until all other threads / processes reach this barrier
	- Lock/Semaphore
		- The first task acquires the lock. This task can then safely (serially) access the protected data or code.
		- Other tasks can attempt to acquire the lock but must wait until the task that owns the lock releases it.

### Locality

- Algorithm should do most work on local data
- Need to exploit spatial and temporal locality

#### Locality of memery access (shared memory)

- Parallel computation is serialized due to memory contention and lack of bandwidth
- Distribute data to relieve contention and increase effective bandwidth

#### Memory Access Latency in Shared Memory Architectures

- Uniform Memory Access (UMA)
	- Centrally located memory
	- All processors are equidistant (access times)
- Non-Uniform Access (NUMA)
	- Physically partitioned but accessible by all
	- Processors have the same address space (Logically large one memory)
	- Placement of data affects performance (멀리 떨어진 데이터는 접근할 때 많은 시간이 소요됨)
	- CC-NUMA (Cache-Coherent NUMA)

#### Cache Coherence

- the uniformity of shared resource data that ends up stored in multiple local caches
- Problem: When a processor modifies a shared variable in local cache, different processors may have different value of the variable
	- Copies of a variable can be present in multiple caches
	- A write by one processor may not beccome visible to others
	- They’ll keep accessing stale vaule in their caches
	- Need to take actions to ensure visibility or cache coherence
- Snooping cache coherence
	- Send all request for data to all processors
	- Works well for small systems
- Directory-based cache coherence
	- Keep track of what is being shared in a directory
	- Send point-to-point requests to processors

#### Shared Memory Architecture

- all processors to access all memory as global address space (UMA, NUMA)
- Advantage
	- Global address space provides a user-friendly programming perspective to memory
	- Data sharing between tasks is both fast and uniform due to the proximity of memory to CPUs
- Disadvantages
	- Primary disadvantage is the lack of scalability between memory and CPUs
	- Programmer responsibility for synchronization
	- Expense: it becomes increasingly difficult and expensive to design and produce shared memory machines with ever increasing number of processors.

#### Distributed Memory Architecture

- Characteristics
	- Only private(local) memory
	- Independent
	- require a communication network to connect inter-processor memory
- Advantages
	- Scalable (processors, memory)
	- Cost effective
- Disadvantages
	- Programmer responsibility of data communication
	- No global memory access
	- Non-uniform memory access time

#### Hybrid Architecture

- Advantages / Disadvantages
	- Combination of Shared/Distributed architecture
	- Scalable
	- Increased programmer complexity

#### Ray Tracing

- Shoot a ray into scene through every pixel in image plane
- Follow their paths
	- they bounce around as they strike objects
	- they generate new rays: ray tree per input ray
- Result is color and opacity for that pixel
- Parallelism across rays

## Java Thread Programming

### Process

- Operating system abstraction to represent what is needed to run a single program
- a sequential stream of execution in its own address space
- program in execution
- 각 프로세스는 0~$2^{64}$ bytes 의 주소를 갖는다. (64비트 운영체제에서)
- 물리적으로는 제한되지만, 논리적으로는 제한이 없는 메모리를 가지고 있을 수 있다.

#### PCB

- Process Control Block
- 포함하는 것들
	- process state
	- process number
	- program counter
	- registers
	- memory limits
	- list of open files

#### UNIX process

- Every process, except process 0, is created by the fork() system call
	- fork() allocates entry in process table and assigns a unique PID to the child process
	- child gets a copy of process image of parent
	- both child and parent are executing the same code following fork()

### Threads

- Definition
	- single sequential flow of control within a program
	- A thread runs within the context of a program’s process and takes advantage of the resources allocated for that process and it’s environment
- Each thread is comprised of (from OS perspective)
	- Program counter
	- Register set
	- Stack
- Threads belonging to the same process share
	- Code section
	- Data section
	- OS resources such as open files

### Single and multithreaded program

- code, data, files 는 스레드들 사이에서 공유된다.

### Multi-process vs Multi-thread

- Process
	- Child process gets a copy of parents variables
	- Relatively expensive to start
	- Don’t have to worry about concurrent access to variables
- Thread
	- Child thread shares parent’s variables
	- Relatively cheap to start
	- Concurrent access to variables is an issue

## Programming Java threads

### JAVA Threading Models

- Java has threads build-in
- Applications consist of at least one thread
	- Often called ‘main’
- The Java Virtual Machine creates the initial thread which executes the main method of the class passed to the JVM
- The methods executed by the ‘main’ thread can then create other threads

### Creating Threads : method 1

- A Thread class manages a single sequential thread of control.

```java
class MyThread extends Thread {
	public void run() {
	// work to do
	}
}
```

### Thread Names

- All threads have a name to be printed out
- The default name is of the format: `Thread-No`
- User-defined names can be given through constructor
	- `Thread myThread = new Thread(“HappyThread”)`
- Or usinig the `setName(aString)` method.
- There is a method in Thread class, called `getName()` to obtain a thread’s name

### Creating Threads : method 2

- Since Java does not permit multiple inheritance, we often implement the run() method in a class not derived from Thread from the interface Runnable

```java
public inerface Runnable {
	public abstract void run();
}

class MyRun implements Runnable {
	public void run() {
	// work to do
	}
}

Thread t = new Thread(new MyRun());
t.start();
```

#### Creating & Executing Threads (Runnable)

- Runnable interface has single method
	- public void run()
- Implement a Runnable and define run()
- Thread’s run() method invokes the Runnable’s run() method

### Thread Life-Cycle

- Created
	- start() → Alive
	- stop() → Terminated
- Alive
	- stop() or run() returns
- Terminated

#### Alive States

- Once started, an alivethread has a number of substates
	- start() → Running
		- sleep(), wait() I/O blocking
		- yield() → Runnable
	- Runnable (Ready)
		- dispatch → Running
	- Non-Runnable
		- notify(), Time expires, I/O completed → Runnable

### Thread Priority

- All Java threads have a priority value, currently between 1 and 10.
- Priority can be changed at any time
- Initial priority is that of the creating thread
- Preemptive scheduling
	- JVM gives preference to higher priority threads (Not guaranteed)

### yield

- Release the right of CPU
- static void yield()
	- allows the scheduler to select another runnable thread (of the same priority)
	- no guarantees as to which thread

### Thread identity

- `Thread.currentThread()`
	- Returns reference to the running thread

### Thread sleep, suspend, resume

- `static void sleep(long millis)`
	- Blocks this thread for at least the time specified
- `void stop(), void suspend(), void resume()`
	- Deprecated!

### Thread Waiting & Status Check

- `void join(), void join(long), void join(long, int)`
	- One thread (A) can wait for another thread (B) to end
- `boolean isAlive()`
	- returns true if the thread has been started and not stopped

### Thread synchronization

- The advantage of threads is that they allow many things to happen at the same time
- The problem with threads is that they allow many things to happen at the same time
- Safety
	- Nothing bad ever happens
	- no race condition
- Liveness
	- Something eventually happens: no deadlock
- Concurrent access to shared data in an object
- Need a way to limit thread’s access to shared data
	- Reduce concurrency
- Mutual Exclusion of Critical Section
	- Add a lock to an object
	- Any thread must acquire the lock before executing the methods
	- If lock is currently unavailable, thread will block

### Synchronized JAVA methods

- We can control access to an object by using the `synchronized` keyword
- Using the `synchronized` keywork will force the lock on the object to be used

### Synchronized Lock Object

- Every Java object has an associated lock acquired via
- synchronized statements (block)
- Only one thread can hold a lock at a time
- Lock granularity: small critical section is better for concurrency object

### Condition Variables

- lock(syncrhonized)
	- control thread access to data
- condition variable (wait,notify/notifyall)
	- synchronization primitives that enable threads to wait until a particular condition occurs
	- enable threads to atomically release a lock and enter the sleeping state.
	- Without condition variables
		- the programmer would need to have threads continually polling (possibly in a critical section), to check if the condition is met
		- A condition variable is a way to achieve the same goal without polling
	- A condition variable is always used in conjunction with a mutex lock

### `wait()` and `notify()`

- `wait()`
	- If no interrupt (normal case), current thread is blocked
	- The thread is placed into wait set associated with the object
	- Synchronization lock for the object is released
- `notify()`
	- One thread, say T, is removed from wait set, if exists.
	- T retains the lock for the object
	- T is resumed from waiting stauts

## Producer-Consumer Problem

- The problem describes two processes, the producer and the consumer, who share a common, fixed-size buffer used as a queue.
	- producer: generate a piece of data, put it into the buffer and start again. At the same time, 
	- consumer:  consumes the data (i.e., removing it from the buffer) one piece at a time. 
	- The problem is to make sure that the producer won't try to add data into the buffer if it's full and that the consumer won't try to remove data from an empty buffer.
- The solution for the producer is to go to sleep if the buffer is full. The next time the consumer removes an item from the buffer, it notifies the producer, who starts to fill the buffer again. 
- In the same way, the consumer can go to sleep if it finds the buffer to be empty. The next time the producer puts data into the buffer, it wakes up the sleeping consumer. 
- generalized to have multiple producers and consumers.

To motivate condition variables, consider the canonical example of a bounded buffer for sharing work among threads

Bounded buffer: A queue with a fixed size
- (Unbounded still needs a condition variable, but 1 instead of 2)
For sharing work – think an assembly line: 
- Producer thread(s) do some work and enqueue result objects
- Consumer thread(s) dequeue objects and do next stage
- Must synchronize access to the queue

### Waiting

- enqueue to a full buffer should not raise an exception
	- Wait until there is room
- dequeue from an empty buffer should not raise an exception
	- Wait until there is data

### What we want

- Better would be for a thread to _wait_  until it can proceed 
	- Be _notified_  when it should try again
	- In the meantime, let other threads run
- Like locks, not something you can implement on your own
	- Language or library gives it to you, typically implemented with operating-system support
- An ADT that supports this: condition variable
	- Informs waiter(s) when the _condition_ that causes it/them to wait has _varied_
- Terminology not completely standard; will mostly stick with Java

### Key ideas

- Java weirdness: every object “is” a condition variable (and a lock)
	- other languages/libraries often make them separate
- **wait:** 
	- “register” running thread as interested in being woken up
	- then atomically: release the lock and block
	- when execution resumes, _thread again holds the lock_
- **notify:**
	- pick one waiting thread and wake it up
	- no guarantee woken up thread runs next, just that it is no longer blocked on the _condition_ – now waiting for the _lock_
	- if no thread is waiting, then do nothing

### Bug 1

Between the time a thread is notified and it re-acquires the lock, the condition can become false again!

Guideline: _Always_  re-check the condition after re-gaining the lock
- In fact, for obscure reasons, Java is technically allowed to notify a thread _spuriously_  (i.e., for no reason)

### Bug 2

- If multiple threads are waiting, we wake up only one
	- Sure only one can do work now, but can’t forget the others!

**notifyAll** wakes up all current waiters on the condition variable
Guideline: If in any doubt, use **notifyAll** 
- Wasteful waking is better than never waking up
- So why does **notify** exist?
- Well, it is faster when correct…

## Java Multithread Programming Exercise

```java
class C extends Thread {
  int i;
  C(int i) { this.i = i; }
  public void run() {
    System.out.println("Thread " + i + " says hi");
    try { 
      sleep(500);
    } catch (InterruptedException e) {}
    System.out.println("Thread " + i + " says bye");
  }
}

public class ex1 {
   private static final int NUM_THREAD = 10;
  public static void main(String[] args) {
    System.out.println("main thread start!");
    C[] c = new C[NUM_THREAD];
    for(int i=0; i < NUM_THREAD; ++i) {
      c[i] = new C(i);
      c[i].start();
    }
    System.out.println("main thread calls join()!");
    for(int i=0; i < NUM_THREAD; ++i) {
      try { 
        c[i].join();
      } catch (InterruptedException e) {}
    }
    System.out.println("main thread ends!");
  }
}
```

```java
public class ex2_serial {
  public static void main(String[] args) {
    int[] int_arr = new int [10000]; 
    int i,s;
    for (i=0;i<10000;i++) int_arr[i]=i+1;
    s=sum(int_arr);
    System.out.println("sum=" + s +"\n");
  }

  static int sum(int[] arr) {
    int i;
    int s=0;
    for (i=0;i<arr.length;i++) s+=arr[i];
    return s;
  }
}
```

```java
class SumThread extends Thread {
  int lo; // fields for communicating inputs
  int hi;
  int[] arr;
  int ans = 0; // for communicating result
  SumThread(int[] a, int l, int h) {
    lo=l; hi=h; arr=a;
  }
  public void run() { // overriding, must have this type
    for(int i=lo; i<hi; i++)
      ans += arr[i];
  }
}

class ex2 {

  private static int NUM_END=10000;
  private static int NUM_THREAD=4;

  public static void main(String[] args) {
    if (args.length==2) {
      NUM_THREAD = Integer.parseInt(args[0]);
      NUM_END = Integer.parseInt(args[1]);
    } 
    System.out.println("number of threads:"+NUM_THREAD);
    System.out.println("sum from 1 to "+NUM_END+"=");

    int[] int_arr = new int [NUM_END]; 
    int i,s;
    
    for (i=0;i<NUM_END;i++) int_arr[i]=i+1;
    s=sum(int_arr);
    System.out.println(s);
  }

  static int sum(int[] arr) {
    int len = arr.length;
    int ans = 0;
    SumThread[] ts = new SumThread[NUM_THREAD];
    for(int i=0; i < NUM_THREAD; i++) {
      ts[i] = new SumThread(arr,(i*len)/NUM_THREAD,((i+1)*len)/NUM_THREAD);
      ts[i].start();
    }
    try {
      for(int i=0; i < NUM_THREAD; i++) {
        ts[i].join();
        ans += ts[i].ans;
      }
    } catch (InterruptedException IntExp) {
    }

    return ans;
  }
}
```

ex2 는 naive 한 solution 이다. 결국은 thread 개수만큼 for 문을 돌면서 더해줘야 하기 때문이다. 

```java
class IntThread extends Thread {
  int my_id; // fields for communicating inputs
  int num_steps;
  int num_threads;
  double sum;

  IntThread(int id, int numSteps, int numThreads) {
    my_id=id; num_steps=numSteps; num_threads=numThreads;
    sum=0.0;
  }
  public void run() { 
    double x;
    int i;
    int i_start = my_id * (num_steps/num_threads);
    int i_end = i_start + (num_steps/num_threads);
    double step = 1.0/(double)num_steps;
    for (i=i_start;i<i_end;i++) { 
      x=(i+0.5)*step;
      sum=sum+4.0/(1.0+x*x);
    }
    sum = sum*step;
    System.out.println("myid"+my_id+", sum=" + sum);
  }
  public double getSum() { return sum; }
}

class ex3 {
  private static int NUM_THREAD = 4;
  private static int NUM_STEP = 1000000000;

  public static void main(String[] args) {
    int i;
    double sum=0.0;

    if (args.length==2) {
      NUM_THREAD = Integer.parseInt(args[0]);
      NUM_STEP = Integer.parseInt(args[1]);
    } 

    long start = System.currentTimeMillis();
    IntThread[] ts = new IntThread[NUM_THREAD];
    for(i=0; i < NUM_THREAD; i++) {
      ts[i] = new IntThread(i,NUM_STEP,NUM_THREAD);
      ts[i].start();
    }
     
    try {
      for (i=0;i<NUM_THREAD;i++) {
        ts[i].join();
        sum += ts[i].getSum();
      }
    } catch (InterruptedException e) {}
    long finish = System.currentTimeMillis();

    System.out.println("integration result=" + sum +"\n");
    System.out.println("Execution time (" + NUM_THREAD + "): "+(finish-start)+"ms");
  }

}
```

## Parallelism for summation

- Example: Sum elements of a large array
- Idea: Have 4 threads simultaneously sum 1/4 of the array
	- Warning: This is an inferior first approach

- Create 4 thread objects, each given a portion of the work
- Call **start()** on each thread object to actually run it in parallel
- Wait for threads to finish using **join()**
- Add together their 4 answers for the final result
- Problems? : processor utilization, subtask size

### A better Approach

Solution is to use lots of threads, far more than the number of processors

1. reusable and efficient across platforms 
2. Use processors “available to you now” : 
	- Hand out “work chunks” as you go
3. Load balance
	- in general subproblems may take significantly different amounts of time

### Naive algorithm is poor

Suppose we create 1 thread to process every 1000 elements

Then combining results will have **arr.length / 1000**  additions 
- Linear in size of array (with constant factor 1/1000)
- Previously we had only 4 pieces (constant in size of array)

In the extreme, if we create 1 thread for every 1 element, the loop to combine results has length-of-array iterations
- Just like the original sequential algorithm

### A better idea: devide-and-conquer

This is straightforward to implement using divide-and-conquer
- Parallelism for the recursive calls
- The key is divide-and-conquer parallelizes the result-combining
- If you have enough processors, total time is height of the tree: O(**log** n) (optimal, exponentially faster than sequential O(n))
- We will write all our parallel algorithms in this style

```java
class SumThread extends java.lang.Thread {

  int lo; int hi; int[] arr; // arguments
  int ans = 0; // result
  SumThread(int[] a, int l, int h) { … }

  public void run(){ // override
    if(hi – lo < SEQUENTIAL_CUTOFF)
      for(int i=lo; i < hi; i++)
        ans += arr[i];
    else {
      SumThread left = new SumThread(arr,lo,(hi+lo)/2);
      SumThread right= new SumThread(arr,(hi+lo)/2,hi);
      left.start();
      right.start();
      left.join(); // don’t move this up a line – why?
      right.join();
      ans = left.ans + right.ans;
    }
  }
}

int sum(int[] arr){ 
   SumThread t = new SumThread(arr,0,arr.length);
   t.run();
   return t.ans;
}
```

### Being realistic

- In theory, you can divide down to single elements, do all your result-combining in parallel and get optimal speedup
	- Total time O(n/numProcessors  + **log** n)
- In practice, creating all those threads and communicating swamps the savings, so:
	- Use a sequential cutoff, typically around 500-1000
		- Eliminates almost all the recursive thread creation (bottom levels of tree)
		- Exactly like quicksort switching to insertion sort for small subproblems, but more important here
	- Do not create two recursive threads; create one and do the other “yourself”
		- Cuts the number of threads created by another 2x

## Concurrent Programming

### What is concurrency?

- What is a sequential program?
	- A single thread of control that executes one instruction and when it is finished execute the next logical instruction
- What is a concurrent program?
	- A collection of autonomous sequential threads, executing (logically) in parallel
- The implementation of a collection of threads can be:
	- Multiprogramming
		- Threads multiplex their executions on a single processor
	- Multiprocessing
		- Threads multiplex their executions on a multiprocessor or a multicore system
	- Distributed Processing
		- Processes multiplex their executions on several different machines

### Concurrency and Parallelism

- Concurrency is not parallelism
- Interleaved Concurrency
	- Logically simultaneous processing
	- Interleaved execution on a single processor
- Parallelism
	- Physically simultaneous processing
	- Requires a multiprocessors or a multicore system

### Why use Concurrent Programming?

- Natural Application Structure
	- The world is not sequential! Easier to program multiple independent and concurrent activities.
- Increased application throughput and responsiveness
	- Not blocking the entire application due to blocking I/O
- Performance from multiprocessor/multicore hardware
	- Parallel execution
- Distributed systems
	- Single application on multiple machines
	- Client/Server type or peer-to-peer systems

### Synchronization

- All the interleavings of the threads are NOT acceptable correct programs
- Java provides synchronization mechanism to restrict the interleavings
- Synchronization serves two purposes:
	- Ensure safety for shared updates
		- Avoid race conditions
	- Coordinate actions of threads
		- Parallel computation
		- Event notification

### Safety

- Multiple threads access shared resource simultaneously
- Safe only if:
	- All accesses have no effect on resource,
	- All accesses idempotent
	- Only one access at a time: mutual exclusion

### Mutual Exclusion

- Prevent more than one thread from accessing critical section at a given time
	- Once a thread is in the critical section, no other thread can enter that critical section until the first thread has left the critical section
	- No interleavings of threads within the critical section
	- Serializes access to section

### Atomicity

- Synchronized methods execute the body as an atomic unit
- May need to execute a code region as the atomic unit
- Block Synchronization is a mechanism where a region of code can be labeled as synchronized
- The synchronized keyword takes as a parameter an object whose lock the system needs to obtain before it can continue

### Avoiding Deadlock

- Cycle in locking graph = deadlock
- Standard solution: canonical order for locks
	- Acquire in increasing order
	- Release in decreasing order
- Ensures deadlock-freedom, but not always easy to do

### Races

- Race conditions - insidious bugs
	- Non-deterministic, timing dependent
	- Cause data corruption, crashes
	- Difficult to detect, reproduce, eliminate
- Many programs contain races
	- Inadvertent programming errors
	- Failure to observe locking displine

#### Data Races

- A data race happens when two threads access a variable simultaneously, and one access is a write
- Problem with data races: non-determinism
	- Depends on interleaving of threads
- Usual way to avoid data races: mutual exclusion
	- Ensures serialized access of all the shared objects

### Potential Concurrency Problems

- Deadlock
	- Two or more threads stop and wait for each other
- Livelock
	- Two or more threads continue to execute, but make no progress toward the ultimate goal.
- Starvation
	- Some thread gets deffered forever.
- Lack of fairness
	- Each thread gets a turn to make progress.
- Race Condition
	- Some possible interleaving of threads results in an undesired computation result

## Important Concepts in Concurrent Programming (from wikipedia)

- Concurrency / Parallelism: logically / physically simultaneous processing
- Synchronization
	- coordication of simultaneous events (threads / processes) in order to obtain correct run time order and void unexpected race condition.
- Mutual Exclusion
	- ensuring that no two processes ro threads are in their critical section at the same time
- Critical Section
	- a piece of code that accesses a shared resource (data structure or device) that must not be concurrently accessed by more than one thread of execution
- Race Condition
	- a type of flaw in an electronic or software system where the output is dependent on the sequence or timing of other uncontrollable events.
- Semaphore
	- a synchronization object that maintains a count between zero and a specified maximum value. The count is decremented each time a thread completes a wait for the semaphore object and incremented each time a thread releases the semaphore. When the count reaches zero, no more threads can successfully wait for the semaphore object state to become signaled.
- concurrent hash map
	- a hash table supporting full concurrency of retrievals and adjustable expected concurrency for updates.
- copy on write arrays
	- CopyOnWriteArrayList behaves as a List implementation that allows multiple concurrent reads, and for reads to occur concurrently with a write. The way it does this is to make a brand new copy of the list every time it is altered.
- Barrier
	- a type of synchronization method. A barrier for a group of threads or processes in the source code means any thread/process must stop at this point and cannot proceed until all other threads / processes reach this barrier.
