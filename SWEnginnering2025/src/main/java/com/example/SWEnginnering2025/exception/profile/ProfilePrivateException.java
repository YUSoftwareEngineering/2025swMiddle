/*
   Project: MonthlyCalendarDto.java
   Author: 윤나영
  Date of creation: 2025.11.27
  Date of last update: 2025.11.27
*/
package com.example.SWEnginnering2025.exception.profile;
// 다른 사용자의 프로필을 조회할 때, 해당 프로필이 '비공개' 설정일 경우 발생시키는 예외 클래스.
// 예: getPublicProfile(targetUserId) 호출 시, 상대방이 profilePublic = false 인 경우.
public class ProfilePrivateException extends RuntimeException {

    public ProfilePrivateException(String message) {
        super(message);
    }
}