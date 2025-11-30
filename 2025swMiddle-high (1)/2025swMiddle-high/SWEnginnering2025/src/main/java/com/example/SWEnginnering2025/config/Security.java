/*
    Project: Security.java
    Author: YHW
    Date of creation: 2025.11.21
    Date of last update: 2025.11.30
*/
package com.example.SWEnginnering2025.config;

import com.example.SWEnginnering2025.filter.JwtAuthenticationFilter;
import com.example.SWEnginnering2025.handler.OAuth2LoginSuccessHandler;
import com.example.SWEnginnering2025.service.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// WebSecurityCustomizer를 제거했으므로, Configuration 외에 WebSecurityCustomizer도 필요 없음
@Configuration
@EnableWebSecurity // 명시적으로 추가하여 Security 설정을 활성화합니다.
public class Security {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    public Security(CustomOAuth2UserService customOAuth2UserService, JwtAuthenticationFilter jwtAuthenticationFilter, OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler) {
        this.customOAuth2UserService = customOAuth2UserService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 💡 경고를 유발하던 webSecurityCustomizer() 메서드를 제거합니다.
    // @Bean
    // public WebSecurityCustomizer webSecurityCustomizer() { ... }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(formLogin -> formLogin.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) ->
                                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
                        )
                )
                .authorizeHttpRequests(auth -> auth
                        // 💡 정적 리소스 및 모든 공개 페이지 경로를 permitAll()에 통합합니다.
                        // 이로써 web.ignoring()을 사용했을 때 발생하던 경고가 사라집니다.
                        .requestMatchers(
                                // 기존 web.ignoring() 경로 (정적 리소스)
                                "/",
                                "/index.html",
                                "/register.html",
                                "/favicon.ico",
                                "/.well-known/**",
                                "/js/**",
                                "/css/**",
                                "/images/**",

                                // 기존 permitAll() 경로 (API, 로그인 페이지 등)
                                "/api/auth/register/**",
                                "/api/auth/login/**",
                                "/login",
                                "/home.html",
                                "/oauth2/**",
                                "/error"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .logout(logout -> logout.disable())
                .oauth2Login(oauth -> oauth
                        .loginPage("/login")
                        .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                        .successHandler(oAuth2LoginSuccessHandler)
                );
        return http.build();
    }
}