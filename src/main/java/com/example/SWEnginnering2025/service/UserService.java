/*
    Project: UserService 환경설정-업데이트/설정변경
    Author: 이채민
    Date of creation: 2025.11.27
    Date of last update: 2025.11.28
*/

package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.dto.AppSettingsRequest;
import com.example.SWEnginnering2025.model.User;
import com.example.SWEnginnering2025.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    
    // 사용자 ID로 성공 개수 조회
    public int getSuccessCountByUserId(String userId) {
        return userRepository.findSuccessCountByUserId(userId);
    }
    
    // 사용자 ID로 성공 개수 증가시키기
    public void updateSuccessCount(String userId, int increment) {
        Optional<User> userOpt = userRepository.findByUserId(userId);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setSuccessCount(user.getSuccessCount() + increment);  // 성공 개수 증가
            userRepository.save(user);  // 업데이트된 사용자 저장
        }
    }

    // 환경 설정 업데이트
    @Transactional
    public void updateAppSettings(Long userId, AppSettingsRequest request) {
        // 1. 유저 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. ID=" + userId));

        // 2. 설정 변경
        user.updateSettings(request.isNotificationEnabled(), request.getFriendRequestPolicy());
    }
}