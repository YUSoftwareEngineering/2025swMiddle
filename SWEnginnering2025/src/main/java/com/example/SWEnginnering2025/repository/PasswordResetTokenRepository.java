/*
    Project: PasswordResetTokenRepository.java
    Author: YHW
    Date of creation: 2025.11.25
    Date of last update: 2025.11.25
*/

package com.example.SWEnginnering2025.repository;

import com.example.SWEnginnering2025.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    // 토큰 문자열로 토큰 객체를 찾아올 때 사용
    Optional<PasswordResetToken> findByToken(String token);

    // 사용자 ID로 기존 토큰이 있는지 확인(중복 요청 방지)할 때 사용
    Optional<PasswordResetToken> findByUserId(Long userId);

    // 사용이 끝난 토큰이나 만료된 토큰을 삭제할 때 사용
    void deleteByUserId(Long userId);
}