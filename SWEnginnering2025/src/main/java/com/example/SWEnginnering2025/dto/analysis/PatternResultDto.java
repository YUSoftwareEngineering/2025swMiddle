package com.example.SWEnginnering2025.dto.analysis;

import java.util.List;

public class PatternResultDto {

    private String status; // "pattern-found" / "no-pattern"
    private List<RepeatedPattern> repeats;

    public static class RepeatedPattern {
        private String dow;      // 요일
        private String slot;     // 시간대 (ex: "MORNING", "EVENING")
        private String reason;   // 대표 태그 이름 등

        public RepeatedPattern(String dow, String slot, String reason) {
            this.dow = dow;
            this.slot = slot;
            this.reason = reason;
        }

        public String getDow() {
            return dow;
        }

        public String getSlot() {
            return slot;
        }

        public String getReason() {
            return reason;
        }
    }

    public PatternResultDto(String status, List<RepeatedPattern> repeats) {
        this.status = status;
        this.repeats = repeats;
    }

    public String getStatus() {
        return status;
    }

    public List<RepeatedPattern> getRepeats() {
        return repeats;
    }
}
