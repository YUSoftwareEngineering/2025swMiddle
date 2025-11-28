/*
    Project: AuthService.java
    Author: YHW
    Date of creation: 2025.11.21
    Date of last update: 2025.11.25
*/

package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.dto.*;
import com.example.SWEnginnering2025.model.User;
import com.example.SWEnginnering2025.model.PasswordResetToken;
import com.example.SWEnginnering2025.repository.UserRepository;
import com.example.SWEnginnering2025.repository.PasswordResetTokenRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.SWEnginnering2025.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;

import java.util.Optional;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;
    private final PasswordResetTokenRepository tokenRepository;

    // 회원가입

    // 1. 로컬 회원가입
    public AllJwtTokenAndNickDto register(UserRegistrationData userData) {
        validatePassword(userData.getPassword(), userData.getPasswordConfirm());
        checkEmailDuplication(userData.getEmail());
        checkNicknameDuplication(userData.getNickname());
        checkUserIdDuplication(userData.getUserId());

        User newUser = new User();
        newUser.setUserId(userData.getUserId());
        newUser.setName(userData.getNickname());
        newUser.setEmail(userData.getEmail());
        newUser.setPassword(passwordEncoder.encode(userData.getPassword()));
        newUser.setBirth(userData.getBirth());

        User registeredUser = userRepository.save(newUser);

        return jwtTokenProvider.createAllJwtToken(registeredUser);
    }

    // 2. 소셜 회원가입
    public AllJwtTokenAndNickDto register(SocialRegistrationData socialData) {
        checkNicknameDuplication(socialData.getNickname());

        User newUser = new User();
        newUser.setEmail(socialData.getEmail());
        newUser.setName(socialData.getNickname());
        newUser.setProvider(socialData.getProvider());
        newUser.setProviderId(socialData.getSocialId());

        newUser.setUserId(socialData.getEmail().split("@")[0] + "_" + socialData.getProvider().substring(0,2));
        newUser.setPassword(passwordEncoder.encode("SOCIAL_DUMMY"));
        newUser.setBirth("2000-01-01");

        User registeredUser = userRepository.save(newUser);

        return jwtTokenProvider.createAllJwtToken(registeredUser);
    }

    // 로그인

    // 1. 로컬 로그인
    public AllJwtTokenAndNickDto login(LoginRequest request) {
        User user = userRepository.findByUserId(request.getEmail())
                .orElseGet(() -> userRepository.findByEmail(request.getEmail()).orElse(null));

        if (user == null) {
            throw new IllegalArgumentException("NOT_FOUND");
        }

        if (!verifyPassword(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("LOGIN_FAILED");
        }

        return jwtTokenProvider.createAllJwtToken(user);
    }

    // 2. 소셜 로그인
    public AllJwtTokenAndNickDto login(SocialLoginRequest request) {
        String socialId = "simulated_social_id";

        User user = findBySocialId(request.getProvider(), socialId)
                .orElse(null);

        if (user == null) {
            throw new RuntimeException("ACCOUNT_NOT_FOUND");
        }

        return jwtTokenProvider.createAllJwtToken(user);
    }

    // 로그아웃 전 비밀번호 확인
    public void reauthenticate(Long userId, String password) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"));

        if (!verifyPassword(password, user.getPassword())) {
            throw new RuntimeException("PASSWORD_MISMATCH");
        }
    }

    // --- 탈퇴 ---
    public void withdraw(Long userId, String password) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("USER_NOT_FOUND"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("PASSWORD_MISMATCH");
        }

        userRepository.delete(user);
        System.out.println("[SERVICE] User " + userId + " withdrawn successfully.");
    }

    // 비밀번호 유효성 검사
    private void validatePassword(String password, String passwordConfirm) {
        if (!password.equals(passwordConfirm)) {
            throw new IllegalArgumentException("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }
        if (password.length() < 8) {
            throw new IllegalArgumentException("비밀번호는 8자 이상이어야 합니다.");
        }
    }

    private void checkEmailDuplication(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("DUPLICATE_EMAIL: 이미 가입된 이메일입니다.");
        }
    }

    private void checkNicknameDuplication(String nickname) {
        if (userRepository.existsByName(nickname)) {
            throw new IllegalArgumentException("DUPLICATE_NICKNAME: 이미 사용 중인 닉네임입니다. 다시 입력해주세요.");
        }
    }

    private void checkUserIdDuplication(String userId) {
        if (userRepository.existsByUserId(userId)) {
            throw new IllegalArgumentException("DUPLICATE_USERID: 이미 사용 중인 로그인 ID입니다.");
        }
    }

    private boolean verifyPassword(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }

    private Optional<User> findBySocialId(String provider, String socialId) {
        return userRepository.findByProviderAndProviderId(provider, socialId);
    }

    // pw 재설정 요청 처리 => 이메일 발송
    @Transactional
    public void createPasswordResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        tokenRepository.findByUserId(user.getId()).ifPresent(tokenRepository::delete);

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .userId(user.getId())
                .expiryDate(LocalDateTime.now().plusMinutes(10))
                .build();

        tokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    // pw 재설정: 토큰 검증, pw 변경
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않거나 만료된 토큰입니다."));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new IllegalArgumentException("토큰이 만료되었습니다. 다시 요청해주세요.");
        }

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }
}