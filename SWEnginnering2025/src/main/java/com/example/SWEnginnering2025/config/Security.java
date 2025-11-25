
/*
    Project: Security.java
    Author: YHW
    Date of creation: 2025.11.21
    Date of last update: 2025.11.26
*/


package com.example.SWEnginnering2025.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity; // 테스트한다고 추가해놈
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/* @Configuration
public class Security {

=======
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import com.example.SWEnginnering2025.service.CustomOAuth2UserService;

@Configuration
public class Security {

    private final CustomOAuth2UserService customOAuth2UserService;

    public Security(CustomOAuth2UserService customOAuth2UserService) {
        this.customOAuth2UserService = customOAuth2UserService;
    }

>>>>>>> origin/YHW
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
<<<<<<< HEAD
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/register", "/login").permitAll()
=======
                // 회원가입을 제외한 모든 기능을 사용하려면 로그인이 필요
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/register/**", "/api/auth/login/**", "/api/auth/reauthenticate", "/login", "/oauth2/**").permitAll()
>>>>>>> origin/YHW
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .usernameParameter("email")
                        .passwordParameter("password")
                        .defaultSuccessUrl("/", true)
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/login")
<<<<<<< HEAD
=======
                        .logoutUrl("/api/auth/logout") // 로그아웃 엔드포인트 설정
>>>>>>> origin/YHW
                )
                .oauth2Login(oauth -> oauth
                        .loginPage("/login")
                        .defaultSuccessUrl("/", true)
<<<<<<< HEAD
                );

        return http.build();
    }
}


                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService) // OAuth2 사용자 정보를 처리할 서비스

                        )
                )
                .csrf(csrf -> csrf.disable()); // API 통신을 위해 CSRF 임시 비활성화

        return http.build();
    }
    */


// 혼자 테스트 하기 위해 바꿈 (수정됨: H2 접속 및 API 테스트 허용)
@Configuration
@EnableWebSecurity
public class Security {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 설정 (H2 콘솔 접속을 위해 예외 처리 필요)
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/h2-console/**") // H2 콘솔은 CSRF 검사 제외
                        .disable() // 나머지는 비활성화
                )

                // H2 콘솔 화면이 깨지지 않도록 설정
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin())
                )

                // 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // H2 콘솔과 내 API(/api/...)는 무조건 허용
                        .requestMatchers("/h2-console/**", "/api/**").permitAll()
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}




