package com.example.SWEnginnering2025.dto;

import com.example.SWEnginnering2025.domain.GoalStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;

@Getter
@NoArgsConstructor
public class GoalBulkUpdateRequest {
    // 1. 바꿀 목표들의 ID 목록 (예: [1, 2, 3])
    private List<Long> ids;

    // 2. 한꺼번에 바꿀 상태 (예: COMPLETED)
    private GoalStatus status;
}