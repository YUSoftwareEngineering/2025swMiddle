/*
    Project: ReAuthRequest.java : 로그아웃 전 비밀번호 입력 받아 재인증에 사용
    Author: YHW
    Date of creation: 2025.11.23
    Date of last update: 2025.11.23
*/

package com.example.SWEnginnering2025.dto;

public class ReAuthRequest {
    private String password;

    // Getters and Setters
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}