/*Project: AttachmentController.java
        Author: 이채민
        Date of creation: 2025.11.23
        Date of last update: 2025.11.24
                */

package com.example.SWEnginnering2025.dto;


import com.example.SWEnginnering2025.model.Goal;
import com.example.SWEnginnering2025.model.GoalCategory;
import com.example.SWEnginnering2025.model.GoalStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
@Getter
@AllArgsConstructor
public class GoalResponse {
    private Long id;
    private Long userId;
    private String title;
    private String description;
    private LocalDate targetDate;
    private GoalStatus status;
    private String statusMemo;
    private String proofUrl;
    private GoalCategory category;
    private LocalTime scheduledTime;

    public static GoalResponse from(Goal goal) {
        return new GoalResponse(
                goal.getId(),
                goal.getUserId(),
                goal.getTitle(),
                goal.getDescription(),
                goal.getTargetDate(),
                goal.getStatus(),
                goal.getStatusMemo(),
                goal.getProofUrl(),
                goal.getCategory(),
                goal.getScheduledTime()
        );
    }
}
