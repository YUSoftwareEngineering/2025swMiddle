/*
    Project: AuthController.java
    Author: YHW
    Date of creation: 2025.11.22
    Date of last update: 2025.11.26-탈퇴기능
*/

package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.dto.*;
import com.example.SWEnginnering2025.service.AuthService;
import com.example.SWEnginnering2025.util.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(AuthService authService, JwtTokenProvider jwtTokenProvider) {
        this.authService = authService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    // --- 회원가입 ---
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationData request) {
        try {
            AllJwtTokenAndNickDto result = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            String message = e.getMessage();
            if (message.startsWith("DUPLICATE_EMAIL")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 가입된 사용자입니다. 로그인 또는 아이디/비밀번호 찾기를 시도하세요.");
            } else if (message.startsWith("DUPLICATE_NICKNAME")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
        }
    }

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
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            AllJwtTokenAndNickDto result = authService.login(loginRequest);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            String message = e.getMessage();
            if (message.equals("NOT_FOUND") || message.equals("LOGIN_FAILED")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 올바르지 않습니다. 아이디/비밀번호 찾기를 시도하세요.");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
        }
    }

    @PostMapping("/login/social")
    public ResponseEntity<?> socialLogin(@RequestBody SocialLoginRequest request) {
        try {
            AllJwtTokenAndNickDto result = authService.login(request);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("ACCOUNT_NOT_FOUND")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ACCOUNT_NOT_FOUND");
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("소셜 로그인 실패");
        }
    }

    // --- pw 재설정 ---
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetConfirmRequest request) {
        try {
            authService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- 로그아웃 ---
    @PostMapping("/reauthenticate")
    public ResponseEntity<String> reauthenticate(@RequestBody ReAuthRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인된 사용자만 가능합니다.");
        }

        try {
            Object principal = authentication.getPrincipal();
            Long userId;

            if (principal instanceof UserDetails) {
                userId = Long.valueOf(((UserDetails) principal).getUsername());
            } else if (principal instanceof String) {
                userId = Long.valueOf((String) principal);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자 정보를 가져올 수 없습니다.");
            }

            authService.reauthenticate(userId, request.getPassword());
            return ResponseEntity.ok("REAUTH_SUCCESS");
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("토큰에서 사용자 정보를 읽을 수 없습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("로그아웃 성공.");
    }

    // --- 회원 탈퇴 ---
    @PostMapping("/withdraw")
    public ResponseEntity<String> withdrawUser(@RequestBody WithdrawRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증된 사용자만 탈퇴할 수 있습니다.");
        }

        try {
            Object principal = authentication.getPrincipal();
            Long userId;

            if (principal instanceof UserDetails) {
                userId = Long.valueOf(((UserDetails) principal).getUsername());
            } else if (principal instanceof String) {
                userId = Long.valueOf((String) principal);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자 정보를 가져올 수 없습니다.");
            }

            authService.withdraw(userId, request.getPassword());
            SecurityContextHolder.clearContext();

            return ResponseEntity.ok("회원 탈퇴가 성공적으로 처리되었습니다.");
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("토큰에서 사용자 정보를 읽을 수 없습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 올바르지 않습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 탈퇴 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}