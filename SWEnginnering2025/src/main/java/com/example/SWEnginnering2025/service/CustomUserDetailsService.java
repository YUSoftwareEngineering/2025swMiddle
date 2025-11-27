/*
    Project: CustomUserDetailsService.java
    Author: YHW
    Date of creation: 2025.11.26
    Date of last update: 2025.11.27
*/

package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.repository.UserRepository;
import com.example.SWEnginnering2025.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    // userId(Long->String)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Long userId;
        try {
            userId = Long.parseLong(username);
        } catch (NumberFormatException e) {
            throw new UsernameNotFoundException("Invalid user ID format.");
        }

        // db 조회
        return userRepository.findById(userId)
                .map(this::createUserDetails)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));
    }

    // User->UserDetails
    private UserDetails createUserDetails(User user) {
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_USER")
        );

        return new org.springframework.security.core.userdetails.User(
                user.getId().toString(), // 사용자 id를 string으로
                user.getPassword(),      // 암호화된 pw
                authorities              // 권한 목록
        );
    }
}