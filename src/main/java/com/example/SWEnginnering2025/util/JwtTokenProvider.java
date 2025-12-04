/*
    Project: JwtTokenProvider.java : Jwt 토큰 생성, 유효성 검사, 정보 추출
    Author: YHW
    Date of creation: 2025.11.23
    Date of last update: 2025.11.30
*/

package com.example.SWEnginnering2025.util;

import com.example.SWEnginnering2025.dto.AllJwtTokenAndNickDto;
import com.example.SWEnginnering2025.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenProvider {

    // 보안키 (final)
    private final Key key;

    // 만료 시간
    private final long accessTokenExpirationMs;

    private final long refreshTokenExpirationMs;

    public JwtTokenProvider(
            @Value("${jwt.secret-key}") String secretKey,
            @Value("${jwt.access-token-expiration-in-ms}") long accessTokenExpirationMs,
            @Value("${jwt.refresh-token-expiration-in-ms}") long refreshTokenExpirationMs) {

        // 1. Secret Key 설정
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);

        // 2. 만료 시간 설정
        this.accessTokenExpirationMs = accessTokenExpirationMs;
        this.refreshTokenExpirationMs = refreshTokenExpirationMs;
    }

    // access token 생성
    public String generateAccessToken(Long userId) {
        Date now = new Date();
        // 토큰 만료 시각 = 현재 시각 + 유효 기간
        Date expiryDate = new Date(now.getTime() + accessTokenExpirationMs);

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now) // 토큰 발급 시각
                .setExpiration(expiryDate) // 토큰 만료 시각
                .signWith(key, SignatureAlgorithm.HS256) // 서명에 사용하는 키, 알골
                .compact();
    }

    // refresh token 생성
    // (Refresh Token에 userId를 넣는 것은 보안상 권장되지 않으므로, userId 인수를 제거합니다.)
    public String generateRefreshToken() {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshTokenExpirationMs);

        return Jwts.builder()
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // access+ refresh token 묶어서 dto로 반환
    public AllJwtTokenAndNickDto createAllJwtToken(User user) {
        // generateAccessToken에는 userId를 전달해야 합니다.
        String accessToken = generateAccessToken(user.getId());
        String refreshToken = generateRefreshToken();

        return new AllJwtTokenAndNickDto(
                accessToken,
                refreshToken,
                user.getName(),
                user.getId()
        );
    }

    // get user id
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token) // 토큰 파싱, 서명 검증
                .getBody();
        return claims.get("userId", Long.class);
    }

    // 토큰 유효성 검사
    public boolean validateToken(String authToken) {
        // null 또는 빈 토큰 체크
        if (authToken == null || authToken.trim().isEmpty()) {
            System.out.println("JWT token is null or empty");
            return false;
        }
        
        // 토큰 정리 (앞뒤 공백 제거)
        String token = authToken.trim();
        
        try {
            Jwts.parser()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            // 잘못된 JWT 서명
            System.out.println("Invalid JWT signature: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            // 만료된 JWT 토큰
            System.out.println("Expired JWT token: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            // 지원되지 않는 JWT 토큰
            System.out.println("Unsupported JWT token: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            // JWT 클레임 문자열이 비어 있음
            System.out.println("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }
}