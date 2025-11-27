/*
    Project: AuthService.java
    Author: YHW
    Date of creation: 2025.11.21
    Date of last update: 2025.11.26 - 탈퇴 기능
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
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor // 생성자 자동 생성
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider; // JWT 제공자 의존성
    private final EmailService emailService;
    private final PasswordResetTokenRepository tokenRepository;


    // 회원가입

    // 1. 로컬 회원가입
    public AllJwtTokenAndNickDto register(UserRegistrationData userData) {
        // 1. 유효성 검사 및 중복 검사
        validatePassword(userData.getPassword(), userData.getPasswordConfirm());
        checkEmailDuplication(userData.getEmail());
        checkNicknameDuplication(userData.getNickname());
        checkUserIdDuplication(userData.getUserId());

        // 2. 사용자 객체 생성 및 저장
        User newUser = new User();
        newUser.setUserId(userData.getUserId());
        newUser.setName(userData.getNickname());
        newUser.setEmail(userData.getEmail());
        newUser.setPassword(passwordEncoder.encode(userData.getPassword()));
        newUser.setBirth(userData.getBirth());

        User registeredUser = userRepository.save(newUser);

        // 3. 토큰 생성 및 반환
        return jwtTokenProvider.createAllJwtToken(registeredUser);
    }

    // 2. 소셜 회원가입
    public AllJwtTokenAndNickDto register(SocialRegistrationData socialData) {
        // 1. 닉네임 중복 검사
        checkNicknameDuplication(socialData.getNickname());

        // 2. 사용자 객체 생성 (소셜 정보 포함)
        User newUser = new User();
        newUser.setEmail(socialData.getEmail());
        newUser.setName(socialData.getNickname());
        newUser.setProvider(socialData.getProvider());
        newUser.setProviderId(socialData.getSocialId());

        newUser.setUserId(socialData.getEmail().split("@")[0] + "_" + socialData.getProvider().substring(0,2));
        newUser.setPassword(passwordEncoder.encode("SOCIAL_DUMMY"));
        newUser.setBirth("2000-01-01");

        User registeredUser = userRepository.save(newUser);

        // 3. 토큰 생성 및 반환
        return jwtTokenProvider.createAllJwtToken(registeredUser);
    }

    // 로그인

    // 1. 로컬 로그인
    public AllJwtTokenAndNickDto login(LoginRequest request) {
        // ID 또는 이메일로 사용자 조회
        User user = userRepository.findByUserId(request.getEmail())
                .orElseGet(() -> userRepository.findByEmail(request.getEmail()).orElse(null));

        if (user == null) {
            // NOT_FOUND: 사용자 없음. 아이디/비밀번호 찾기 옵션 제공
            throw new IllegalArgumentException("NOT_FOUND");
        }

        // 1. 비밀번호 검증
        if (!verifyPassword(request.getPassword(), user.getPassword())) {
            // LOGIN_FAILED: 비밀번호 불일치. 아이디/비밀번호 찾기 옵션 제공
            throw new IllegalArgumentException("LOGIN_FAILED");
        }

        // 2. 로그인 성공 시 토큰 반환
        return jwtTokenProvider.createAllJwtToken(user);
    }

    // 2. 소셜 로그인
    public AllJwtTokenAndNickDto login(SocialLoginRequest request) {
        String socialId = "simulated_social_id"; // authCode를 이용해 소셜 ID 획득

        User user = findBySocialId(request.getProvider(), socialId)
                .orElse(null);

        if (user == null) {
            // 계정 없음: ACCOUNT_NOT_FOUND 오류 코드, 가입 유도
            throw new RuntimeException("ACCOUNT_NOT_FOUND");
        }

        // 3. 로그인 성공 및 토큰 반환
        return jwtTokenProvider.createAllJwtToken(user);
    }

    // 로그아웃

    // 로그아웃 전 pw확인
    public void reauthenticate(Long userId, String password) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"));

        if (!verifyPassword(password, user.getPassword())) {
            throw new RuntimeException("PASSWORD_MISMATCH");
        }
    }

    // 계정 탈퇴
    @Transactional
    public void deleteUser(Long userId, String password) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"));
        // pw 확인
        if (!verifyPassword(password, user.getPassword())) {
            throw new RuntimeException("PASSWORD_MISMATCH");
        }
        // 관련 토큰 삭제
        tokenRepository.deleteByUserId(userId);

        // 관련 데이터 삭제
        userRepository.delete(user);
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

    // 이메일 중복 검사
    private void checkEmailDuplication(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("DUPLICATE_EMAIL: 이미 가입된 이메일입니다.");
        }
    }

    // 닉네임 중복 검사
    private void checkNicknameDuplication(String nickname) {
        if (userRepository.existsByName(nickname)) {
            throw new IllegalArgumentException("DUPLICATE_NICKNAME: 이미 사용 중인 닉네임입니다. 다시 입력해주세요.");
        }
    }

    // 로그인 중복 검사
    private void checkUserIdDuplication(String userId) {
        if (userRepository.existsByUserId(userId)) {
            throw new IllegalArgumentException("DUPLICATE_USERID: 이미 사용 중인 로그인 ID입니다.");
        }
    }

    // 비밀번호 일치 여부 검증
    private boolean verifyPassword(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }

    // 소셜 ID로 사용자 조회
    private Optional<User> findBySocialId(String provider, String socialId) {
        return userRepository.findByProviderAndProviderId(provider, socialId);
    }

    // 이메일 주소로 사용자 ID를 찾아 이메일로 전송
    public void findUserIdByEmail(String email) {
        User user = userRepository.findByEmail(email)
                // 해당 이메일로 가입된 사용자가 없으면 예외 처리
                .orElseThrow(() -> new IllegalArgumentException("FIND_FAILED: 해당 이메일로 가입된 사용자가 없습니다."));
        // 사용자 ID를 포함한 이메일 전송
        emailService.sendUserIdReminderEmail(user.getEmail(), user.getUserId());
    }

    // pw 재설정 요청 처리 => 이메일 발송
    @Transactional
    public void createPasswordResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 기존 토큰이 있다면 삭제 (중복 요청 방지)
        tokenRepository.findByUserId(user.getId()).ifPresent(tokenRepository::delete);

        // 새 토큰 생성
        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .userId(user.getId())
                .expiryDate(LocalDateTime.now().plusMinutes(10)) // 유효 시간 10분 
                .build();

        tokenRepository.save(resetToken);

        // 이메일 전송 호출
        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    // pw 재설정: 토큰 검증, pw 변경
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않거나 만료된 토큰입니다."));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken); // 만료된 토큰 정리
            throw new IllegalArgumentException("토큰이 만료되었습니다. 다시 요청해주세요.");
        }

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // pw 업데이트
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // 사용 완료된 토큰 삭제
        tokenRepository.delete(resetToken);
    }
}