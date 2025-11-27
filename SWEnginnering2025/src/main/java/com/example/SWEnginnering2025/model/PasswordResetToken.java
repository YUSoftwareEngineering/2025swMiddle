/*
    Project: PasswordResetToken.java
    Author: YHW
    Date of creation: 2025.11.25
    Date of last update: 2025.11.25
*/

package com.example.SWEnginnering2025.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class PasswordResetToken {

    // 토큰 고유 ID
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 사용자에게 전송될 실제 토큰 값
    private String token;

    // 해당 토큰을 요청한 user ID
    @Column(nullable = false)
    private Long userId;

    // 토큰 만료 시간
    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Builder
    public PasswordResetToken(String token, Long userId, LocalDateTime expiryDate) {
        this.token = token;
        this.userId = userId;
        this.expiryDate = expiryDate;
    }
    // 토큰 유효성 검사
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }
}