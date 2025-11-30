/*
    Project: SocialLoginRequest.java : 서버에 전달 시 소셜 로그인 인증 코드 전달
    Author: YHW
    Date of creation: 2025.11.23
    Date of last update: 2025.11.23
*/

package com.example.SWEnginnering2025.dto;

public class SocialLoginRequest {
    private String provider;    // 소셜 제공자 (ex, "google")
    private String authCode;    // 소셜 로그인 후 전달받은 인증 코드

    // Getters and Setters
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getAuthCode() { return authCode; }
    public void setAuthCode(String authCode) { this.authCode = authCode; }
}