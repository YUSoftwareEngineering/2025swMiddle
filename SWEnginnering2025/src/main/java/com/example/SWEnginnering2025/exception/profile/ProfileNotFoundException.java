/*
   Project: MonthlyCalendarDto.java
   Author: 윤나영
  Date of creation: 2025.11.27
  Date of last update: 2025.11.27
*/
package com.example.SWEnginnering2025.exception.profile;
// 특정 사용자의 프로필이 존재하지 않을 때 발생시키는 사용자 정의 예외 클래스.
// 예: 다른 사용자의 프로필을 조회할 때 해당 사용자에게 프로필 데이터가 없으면 발생.
public class ProfileNotFoundException extends RuntimeException {
    public ProfileNotFoundException(String message) {
        super(message);//// message에는 "프로필을 찾을 수 없습니다" 등 에러 상황을 나타내는 설명이 전달된다.
    }
}
