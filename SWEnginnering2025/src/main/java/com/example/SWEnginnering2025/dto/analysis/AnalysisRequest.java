package com.example.SWEnginnering2025.dto.analysis;

import java.time.LocalDate;

public class AnalysisRequest {

    private Long userId;
    private LocalDate from;
    private LocalDate to;

    public AnalysisRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public LocalDate getFrom() {
        return from;
    }

    public LocalDate getTo() {
        return to;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setFrom(LocalDate from) {
        this.from = from;
    }

    public void setTo(LocalDate to) {
        this.to = to;
    }
}
