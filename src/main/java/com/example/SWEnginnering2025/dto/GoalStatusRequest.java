/*Project: AttachmentController.java
        Author: 이채민
        Date of creation: 2025.11.23
        Date of last update: 2025.11.23
                */

package com.example.SWEnginnering2025.dto;

import com.example.SWEnginnering2025.model.GoalStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GoalStatusRequest {
    private GoalStatus status;    // 예: COMPLETED, FAILED 등
    private String statusMemo;    // 예: "오늘 정말 힘들었다"
    private String proofUrl;      // 예: "http://image.com/my_proof.jpg"
}