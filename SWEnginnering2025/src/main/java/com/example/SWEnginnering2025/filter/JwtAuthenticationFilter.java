/*
    Project: JwtAuthenticationFilter.java
    Author: YHW
    Date of creation: 2025.11.26
    Date of last update: 2025.11.27-디버그 코드 추가
*/

package com.example.SWEnginnering2025.filter;

import com.example.SWEnginnering2025.util.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("--- [DEBUG] JWT Filter Start: " + request.getRequestURI() + " ---");

        // 1. HTTP 요청 헤더에서 JWT 토큰 추출
        String token = resolveToken(request);

        // resolveToken 성공 여부 확인
        if (token == null) {
            System.out.println("--- [DEBUG] 1. Token is NULL (Authorization Header Missing or Malformed) ---");
        } else {
            System.out.println("--- [DEBUG] 1. Token extracted successfully: " + token.substring(0, 20) + "..." + " ---");
        }

        if (token != null && jwtTokenProvider.validateToken(token)) {
            try {
                // 2. 토큰에서 사용자 ID(Long)를 추출
                Long userId = jwtTokenProvider.getUserIdFromToken(token);
                System.out.println("--- [DEBUG] 2. Extracted User ID: " + userId + " ---");


                // 3. UserDetailsService를 사용하여 사용자 정보 로드
                UserDetails userDetails = userDetailsService.loadUserByUsername(userId.toString());

                if (userDetails != null) {
                    System.out.println("--- [DEBUG] 3. UserDetails loaded: " + userDetails.getUsername() + " ---");

                    // 4. 인증 객체 생성
                    Authentication authentication = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    // 5. SecurityContext에 인증 정보 저장
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("--- [DEBUG] 4. Authentication SUCCESS! ---");
                } else {
                    // userDetails가 null인 경우
                    System.out.println("--- [DEBUG] 3. UserDetails is NULL (User not found in DB) ---");
                    SecurityContextHolder.clearContext();
                }
            } catch (Exception e) {
                // 토큰 검증은 통과, but  DB에서 사용자를 찾지 못했거나 기타 예외 발생 시 인증 정보 삭제
                System.out.println("--- [DEBUG] 5. Authentication FAILED due to Exception (e.g. DB error) ---");
                e.printStackTrace(); // 어떤 예외인지 확인
                SecurityContextHolder.clearContext();
            }
        } else if (token != null) {
            System.out.println("--- [DEBUG] 5. Token Validation FAILED (See JwtTokenProvider logs for Expired/Invalid Signature) ---");
        }

        // 6. 다음 필터로 진행
        filterChain.doFilter(request, response);
    }

    // 요청 헤더에서 "Bearer <Token>" 형태의 토큰 추출
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}