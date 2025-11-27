package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.dto.AppSettingsRequest;
import com.example.SWEnginnering2025.model.User;
import com.example.SWEnginnering2025.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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