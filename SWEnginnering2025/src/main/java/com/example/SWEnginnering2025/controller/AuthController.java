/*
    Project: AuthController.java
    Author: YHW
    Date of creation: 2025.11.22
    Date of last update: 2025.11.23
*/

package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.dto.*;
import com.example.SWEnginnering2025.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ---  회원가입 ---

    // 1. 로컬 회원가입
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationData request) {
        try {
            // 회원가입 성공 -> 즉시 로그인 (토큰 반환)
            AllJwtTokenAndNickDto result = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            String message = e.getMessage();

            if (message.startsWith("DUPLICATE_EMAIL")) {
                // 이미 가입된 사용자일 경우, 409 Conflict 반환 (로그인/찾기 페이지 이동 옵션 제공)
                return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 가입된 사용자입니다. 로그인 또는 아이디/비밀번호 찾기를 시도하세요.");
            } else if (message.startsWith("DUPLICATE_NICKNAME")) {
                // ID 중복일 경우, 400 Bad Request 반환 (다시 입력 받도록)
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
        }
    }

    // 2. 소셜 회원가입
    @PostMapping("/register/social")
    public ResponseEntity<AllJwtTokenAndNickDto> registerSocialUser(@RequestBody SocialRegistrationData request) {
        try {
            AllJwtTokenAndNickDto result = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // --- 로그인 ---

    // 1. 로컬 로그인
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            // 입력 정보가 올바른 경우 시스템은 사용자에게 메인화면을 보여준다 (토큰 반환)
            AllJwtTokenAndNickDto result = authService.login(loginRequest);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            // NOT_FOUND 또는 LOGIN_FAILED 모두 Unauthorized 처리
            String message = e.getMessage();
            if (message.equals("NOT_FOUND") || message.equals("LOGIN_FAILED")) {
                // 사용자 요구사항 반영: 실패 시 '아이디/비밀번호 찾기 옵션을 띄워준다.'
                String responseMessage = "아이디 또는 비밀번호가 올바르지 않습니다. 아이디/비밀번호 찾기를 시도하세요.";
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseMessage);
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
        }
    }

    // 2. 소셜 로그인
    @PostMapping("/login/social")
    public ResponseEntity<?> socialLogin(@RequestBody SocialLoginRequest request) {
        try {
            AllJwtTokenAndNickDto result = authService.login(request);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            // ACCOUNT_NOT_FOUND 예외: 소셜 회원가입 유도
            if (e.getMessage().equals("ACCOUNT_NOT_FOUND")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ACCOUNT_NOT_FOUND");
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("소셜 로그인 실패");
        }
    }

    // --- 로그아웃 ---

    // 1. 로그아웃 전 비밀번호 재인증
    @PostMapping("/reauthenticate")
    public ResponseEntity<String> reauthenticate(@RequestBody ReAuthRequest request) {
        Long userId = 1L; // (실제로는 토큰에서 userId를 추출해야 함)

        try {
            authService.reauthenticate(userId, request.getPassword());
            return ResponseEntity.ok("REAUTH_SUCCESS");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
        }
    }

    // 2. 로그아웃 (서버와의 연결을 끊음)
    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser() {
        // 서버 측에서 Refresh Token 무효화 및 인증 관련 캐시 삭제 로직 필요

        // 로그아웃이 성공한다면 사용자는 어플의 기능을 이용할 수 없다. (클라이언트 측 토큰 삭제)
        return ResponseEntity.ok("로그아웃 성공. 서버와의 연결을 끊습니다.");
    }
}