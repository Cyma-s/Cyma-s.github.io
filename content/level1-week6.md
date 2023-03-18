---
title   : 레벨1 6주차
date    : 2023-03-14 11:01:55 +0900
updated : 2023-03-17 10:46:13 +0900
tags     : 
- 레벨1
- 우테코
---
# 3/14

## 자바로 DB 다뤄보기
Java에서 JDBC 드라이버를 이용하여 DB와 연결하기

### JDBC
- Java DataBase Connectivity
- 자바 애플리케이션에서 DB 프로그래밍을 할 수 있도록 도와주는 표준 인터페이스.

### 코드

```
final UserDao userDao = new UserDao();
final Connection connection = userDao.getConnection();

```

```
public final class UserDao {
	public Connection getConnection() {
	try {
		return DriverManager.getConnection(
			"jbdc:mysql:localhost:13306/chess?useSSL=false&serverTimezone=UTC",
			"root", 
			"root"
			);
		} catch(SQLException e) {
			e.printStackTrace();
			return null;
		}
	}
	
	public void insert(final User user) {
		String sql = "INSERT INTO user (user_id, name) VALUES (?, ?)";
		try (
		final Connection connection = getConection();
		final PreparedStatment preparedStatement = connection.prepareStatement(sql))
		{
			preparedStatement.setString(1, user.userId());
			preparedStatement.setString(2, user.name);
			preparedStatement.executeUpdate();
		}
		catch(final SQLException e) {
			throw new RuntimeException(e);
		}
	} 

	public void findByUserId(final String userId) {
		String sql = "SELECT * FROM user WHERE user_id = ?";
		try (
		final Connection connection = getConection();
		final PreparedStatment preparedStatement = connection.prepareStatement(sql))
		{
			preparedStatement.setString(1, userId);
			final var resultSet = preparedStatement.executeQuery();
			if(resultSet.next()) {
				return new User(
					resultSet.getString("user_id"),
					resultSet.getString("name")
				);
			}
		}
		catch(final SQLException e) {
			throw new RuntimeException(e);
		}
	}
}
```

option + command + F : 필드로 추출

# 3/17

## 람다와 스트림

- 자바에서 함수형으로 프로그래밍할 수 있게 도와주는 도구
- 함수형 프로그래밍? 작업을 어떻게 수행할 것인지, How에 집중한다.

### 무엇에 집중할 것인가

### 함수란 무엇인가

같은 인수값으로 함수를 호출하면 항상 같은 값을 반환한다. (랜덤 요소 X. Scanner, Random)
함수나 메서드는 지역 변수만을 변형해야 함수형이라 할 수 있다. 함수나 메서드에서 참조하는 객체가 있다면 해당 객체는 불변해야 한다.

객체의 모든 필드가 final이어야 한다. 
모든 참조 필드는 불변 객체를 직접 참조한다.

---
메서드 내에서 생성한 객체의 필드는 갱신할 수 있으나, 새로 생성한 객체의 필드 갱신이 외부에 노출되지 않아야 한다.
다음에 메서드를 다시 호출한 결과에 영향을 미치지 않아야 한다.

함수나 메서드가 어떤 예외도 일으키지 않아야 한다.

### 멀티코어와 동시성 제어

자바 8은 간결한 코드, 멀티코어 프로세서의 쉬운 활용을 기반으로 동시성 제어를 할 수 있다.

### Stream API

