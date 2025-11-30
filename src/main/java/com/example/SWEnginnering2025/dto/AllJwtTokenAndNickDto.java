/*
    Project: AllJwtTokenAndNickDto.java : 로그인 및 회원가입 성공 시 server->client 반환
    Author: YHW
    Date of creation: 2025.11.23
    Date of last update: 2025.11.23
*/

package com.example.SWEnginnering2025.dto;

// AuthService의 createAllJwtToken 함수에서 사용
public class AllJwtTokenAndNickDto {
    private String accessToken;
    private String refreshToken;
    private String nickname;
    private Long userId; // 내부 관리를 위한 ID

    public AllJwtTokenAndNickDto(String accessToken, String refreshToken, String nickname, Long userId) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.nickname = nickname;
        this.userId = userId;
    }

    // Getters and Setters
    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}