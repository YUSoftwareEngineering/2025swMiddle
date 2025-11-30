/*
   Project: MonthlyCalendarDto.java
   Author: 윤나영
  Date of creation: 2025.11.27
  Date of last update: 2025.11.27
*/
package com.example.SWEnginnering2025.exception.profile;

// 프로필 데이터가 유효하지 않을 때 발생시키는 사용자 정의 예외 클래스
// RuntimeException을 상속하여 'unchecked exception' 형태로 사용한다.
public class InvalidProfileDataException extends RuntimeException {
    // 예외 메시지를 전달받아 부모 클래스(RuntimeException)의 생성자에 전달
    // 서비스·비즈니스 로직에서 입력 값이 잘못되었을 때 사용된다.
    public InvalidProfileDataException(String message) {
        super(message);
    }
}