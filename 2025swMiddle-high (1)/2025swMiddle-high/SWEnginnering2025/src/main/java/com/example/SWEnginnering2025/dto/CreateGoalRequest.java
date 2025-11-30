/*Project: AttachmentController.java
        Author: 이채민
        Date of creation: 2025.11.22
        Date of last update: 2025.11.23
                */

package com.example.SWEnginnering2025.dto;

import com.example.SWEnginnering2025.model.GoalCategory;
import jakarta.validation.constraints.NotBlank; // 유효성 검사
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@NoArgsConstructor
public class CreateGoalRequest {

    @NotBlank(message = "제목은 필수입니다.") // 제목 빈칸 방지!
    private String title;

    private String description;
    private LocalDate targetDate;

    private GoalCategory category;
    private boolean isNotificationEnabled;
    private LocalTime scheduledTime;



}