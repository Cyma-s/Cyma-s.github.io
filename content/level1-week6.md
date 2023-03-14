---
title   : 레벨1 6주차
date    : 2023-03-14 11:01:55 +0900
updated : 2023-03-14 11:12:29 +0900
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