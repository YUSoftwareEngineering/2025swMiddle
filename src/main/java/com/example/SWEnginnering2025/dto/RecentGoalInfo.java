package com.example.SWEnginnering2025.dto;

import java.time.LocalDateTime;

// 프로필 화면에 표시할 간소화된 목표 정보를 담는 DTO
public class RecentGoalInfo {
    private String title;           // 목표의 제목
    private LocalDateTime completedAt;  // 목표 완료 날짜 (프론트에서 YYYY-MM-DD로 포맷팅 예정)

    public RecentGoalInfo(String title, LocalDateTime completedAt) {
        this.title = title;
        this.completedAt = completedAt;
    }

    // Getter
    public String getTitle() {
        return title;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
}