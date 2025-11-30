/*Project: AttachmentController.java
        Author: 이채민
        Date of creation: 2025.11.23
        Date of last update: 2025.11.24
                */

package com.example.SWEnginnering2025.dto;


import com.example.SWEnginnering2025.model.Goal;
import com.example.SWEnginnering2025.model.GoalCategory;
import com.example.SWEnginnering2025.model.GoalStatus;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
public class GoalResponse {

    private Long id;
    private String title;
    private String description;
    private GoalStatus status;      // 상태 (대기/완료/부분/실패)
    private String statusMemo;      // 상태 메모
    private String proofUrl;        // 인증샷 경로
    private GoalCategory category;
    private boolean isNotificationEnabled;
    private LocalTime scheduledTime;
    private LocalDateTime createdAt;

    // 전체 필드를 받는 생성자 (빌더 대신 사용)
    public GoalResponse(Long id,
                        String title,
                        String description,
                        GoalStatus status,
                        String statusMemo,
                        String proofUrl,
                        GoalCategory category,
                        boolean isNotificationEnabled,
                        LocalTime scheduledTime,
                        LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.statusMemo = statusMemo;
        this.proofUrl = proofUrl;
        this.category = category;
        this.isNotificationEnabled = isNotificationEnabled;
        this.scheduledTime = scheduledTime;
        this.createdAt = createdAt;
    }

    // Entity -> DTO 변환기 (공장)
    public static GoalResponse from(Goal entity) {
        return new GoalResponse(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getStatus(),
                entity.getStatusMemo(),
                entity.getProofUrl(),
                entity.getCategory(),
                entity.isNotificationEnabled(),
                entity.getScheduledTime(),
                entity.getCreatedAt()
        );
    }
}