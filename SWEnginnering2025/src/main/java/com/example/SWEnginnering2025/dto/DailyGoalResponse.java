package com.example.SWEnginnering2025.dto;

import com.example.SWEnginnering2025.domain.Goal;
import com.example.SWEnginnering2025.domain.GoalCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Builder
@AllArgsConstructor
public class DailyGoalResponse {
    private Long id;
    private String title;
    private String description;
    private boolean isCompleted;
    private GoalCategory category;
    private boolean isNotificationEnabled;
    private LocalTime scheduledTime;
    private LocalDateTime createdAt;

    // Entity -> DTO 변환기 (공장)
    public static DailyGoalResponse from(Goal entity) {
        return DailyGoalResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .isCompleted(entity.getIsCompleted())
                .category(entity.getCategory())
                .isNotificationEnabled(entity.isNotificationEnabled())
                .scheduledTime(entity.getScheduledTime())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}