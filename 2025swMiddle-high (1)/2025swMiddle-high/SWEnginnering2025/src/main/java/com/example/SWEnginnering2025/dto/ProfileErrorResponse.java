/*
   Project: MonthlyCalendarDto.java
   Author: 윤나영
  Date of creation: 2025.11.27
  Date of last update: 2025.11.27
*/
package com.example.SWEnginnering2025.dto;
// 프로필 관련 에러가 발생했을 때,
// 클라이언트에게 전달할 표준화된 오류 응답 형식을 정의하는 DTO.
public class ProfileErrorResponse {
    private String code;
    private String message;

    public ProfileErrorResponse() {
    }

    public ProfileErrorResponse(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
