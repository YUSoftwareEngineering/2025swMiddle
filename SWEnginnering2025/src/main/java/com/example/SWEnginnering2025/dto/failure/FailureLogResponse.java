package com.example.SWEnginnering2025.dto.failure;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class FailureLogResponse {

    private Long failureId;
    private Long userId;
    private Long goalId;
    private LocalDate date;
    private String memo;
    private LocalDateTime failedAt;
    private List<FailureTagDto> tags;

    public FailureLogResponse(Long failureId,
                              Long userId,
                              Long goalId,
                              LocalDate date,
                              String memo,
                              LocalDateTime failedAt,
                              List<FailureTagDto> tags) {
        this.failureId = failureId;
        this.userId = userId;
        this.goalId = goalId;
        this.date = date;
        this.memo = memo;
        this.failedAt = failedAt;
        this.tags = tags;
    }

    public Long getFailureId() {
        return failureId;
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

    public String getMemo() {
        return memo;
    }

    public LocalDateTime getFailedAt() {
        return failedAt;
    }

    public List<FailureTagDto> getTags() {
        return tags;
    }
}
