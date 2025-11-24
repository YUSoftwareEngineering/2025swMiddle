/*
    Project: UserRegistrationData.java : 로컬 계정 회원 가입 시 클라이언트로부터 받는 데이터
    Author: YHW
    Date of creation: 2025.11.23
    Date of last update: 2025.11.23
*/

package com.example.SWEnginnering2025.dto;

public class UserRegistrationData {
    private String userId;      // 로그인 ID
    private String nickname;    // 사용자 이름 (User.name 필드에 저장됨)
    private String email;
    private String password;
    private String passwordConfirm;
    private String birth;

    // Getters and Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPasswordConfirm() { return passwordConfirm; }
    public void setPasswordConfirm(String passwordConfirm) { this.passwordConfirm = passwordConfirm; }

    public String getBirth() { return birth; }
    public void setBirth(String birth) { this.birth = birth; }
}