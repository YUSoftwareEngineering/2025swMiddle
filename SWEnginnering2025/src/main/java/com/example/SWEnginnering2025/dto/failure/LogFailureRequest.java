/*Project: LogFailureRequest.java
        Author: 한지윤
        Date of creation: 2025.11.23
        Date of last update: 2025.11.23
                */
package com.example.SWEnginnering2025.dto.failure;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor
public class LogFailureRequest {

    private Long userId;
    private Long goalId;
    private LocalDate date;          // 실패 날짜 (캘린더/분석용)
    private List<Long> tagIds;       // 선택된 태그 ID 목록
    private String memo;

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setGoalId(Long goalId) {
        this.goalId = goalId;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setTagIds(List<Long> tagIds) {
        this.tagIds = tagIds;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }
}
