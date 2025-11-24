/*
    Project: JwtTokenProvider.java : Jwt 토큰 생성, 유효성 검사, 정보 추출
    Author: YHW
    Date of creation: 2025.11.23
    Date of last update: 2025.11.23
*/

package com.example.SWEnginnering2025.util;

import com.example.SWEnginnering2025.dto.AllJwtTokenAndNickDto;
import com.example.SWEnginnering2025.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenProvider {

    // 보안키
    private final Key key;

    @Value("${jwt.access-token-expiration-in-ms}")
    private long accessTokenExpirationMs;

    @Value("${jwt.refresh-token-expiration-in-ms}")
    private long refreshTokenExpirationMs;

    public JwtTokenProvider(@Value("${jwt.secret-key}") String secretKey) {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // Access Token 생성
    public String generateAccessToken(Long userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + accessTokenExpirationMs);

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Refresh Token 생성
    public String generateRefreshToken() {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshTokenExpirationMs);

        return Jwts.builder()
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 두 토큰을 묶어 DTO 반환
    public AllJwtTokenAndNickDto createAllJwtToken(User user) {
        String accessToken = generateAccessToken(user.getId());
        String refreshToken = generateRefreshToken();

        return new AllJwtTokenAndNickDto(
                accessToken,
                refreshToken,
                user.getName(),
                user.getId()
        );
    }

    // 토큰에서 사용자 ID 추출
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.get("userId", Long.class);
    }

    // 토큰 유효성 검사
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(key).build().parseClaimsJws(authToken);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            // 잘못된 JWT 서명
            System.out.println("Invalid JWT signature");
        } catch (ExpiredJwtException e) {
            // 만료된 JWT 토큰
            System.out.println("Expired JWT token");
        } catch (UnsupportedJwtException e) {
            // 지원되지 않는 JWT 토큰
            System.out.println("Unsupported JWT token");
        } catch (IllegalArgumentException e) {
            // JWT 클레임 문자열이 비어 있음
            System.out.println("JWT claims string is empty.");
        }
        return false;
    }
}