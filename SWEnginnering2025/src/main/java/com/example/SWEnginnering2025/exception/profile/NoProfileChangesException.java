/*
   Project: MonthlyCalendarDto.java
   Author: 윤나영
  Date of creation: 2025.11.27
  Date of last update: 2025.11.27
*/
package com.example.SWEnginnering2025.exception.profile;

// 프로필 업데이트 요청 시, 변경된 내용이 전혀 없을 경우 발생시키는 사용자 정의 예외 클래스
public class NoProfileChangesException extends RuntimeException {
    // 생성자: 예외 메시지를 전달받아 부모 클래스의 생성자(RuntimeException)에 그대로 전달
    public NoProfileChangesException(String message) {
        super(message);
    }
}
