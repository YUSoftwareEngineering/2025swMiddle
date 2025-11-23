/*Project: AttachmentController.java
        Author: 이채민
        Date of creation: 2025.11.23
        Date of last update: 2025.11.23
                */

package com.example.SWEnginnering2025.dto;

import com.example.SWEnginnering2025.domain.Goal;
import com.example.SWEnginnering2025.domain.GoalCategory;
import com.example.SWEnginnering2025.domain.GoalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Builder
@AllArgsConstructor
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

    // Entity -> DTO 변환기 (공장)
    public static GoalResponse from(Goal entity) {
        return GoalResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .category(entity.getCategory())
                .isNotificationEnabled(entity.isNotificationEnabled())
                .scheduledTime(entity.getScheduledTime())
                .status(entity.getStatus())          // Entity의 status를 가져옴
                .statusMemo(entity.getStatusMemo())  // Entity의 statusMemo를 가져옴
                .proofUrl(entity.getProofUrl())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    @Getter
    @NoArgsConstructor
    public class GoalStatusRequest {
        private GoalStatus status;   // 예: COMPLETED
        private String statusMemo;   // 예: "오늘 정말 힘들었다"
        private String proofUrl;     // 예: "http://image.com/my_proof.jpg"
    }
}