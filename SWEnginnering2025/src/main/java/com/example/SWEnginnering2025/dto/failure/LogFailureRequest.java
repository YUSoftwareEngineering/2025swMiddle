package com.example.SWEnginnering2025.dto.failure;

import java.time.LocalDate;
import java.util.List;

public class LogFailureRequest {

    private Long userId;
    private Long goalId;
    private LocalDate date;          // 실패 날짜 (캘린더/분석용)
    private List<Long> tagIds;       // 선택된 태그 ID 목록
    private String memo;

    public LogFailureRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public Long getGoalId() {
        return goalId;
    }

    public LocalDate getDate() {
        return date;
    }

    public List<Long> getTagIds() {
        return tagIds;
    }

    public String getMemo() {
        return memo;
    }

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
