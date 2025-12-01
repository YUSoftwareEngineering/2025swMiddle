/*
    Project: SocialRegistrationData.java : 소셜 회원가입, 소셜 계정 연동 후, 닉네임을 추가로 입력 받아 최종 회원 가입 시 사용
    Author: YHW
    Date of creation: 2025.11.23
    Date of last update: 2025.11.23
*/

package com.example.SWEnginnering2025.dto;

public class SocialRegistrationData {
    private String provider;    // 소셜 제공자 (ex, "google", "kakao")
    private String socialId;    // 소셜 제공자 고유 ID
    private String email;       // 소셜에서 받은 이메일
    private String nickname;    // 사용자에게 추가로 입력받은 닉네임

    // Getters and Setters
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getSocialId() { return socialId; }
    public void setSocialId(String socialId) { this.socialId = socialId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
}