package com.example.SWEnginnering2025.dto.analysis;

import java.util.Map;

public class SummaryResultDto {

    // 요일별 실패 횟수 예: {"MON": 3, "TUE": 5}
    private Map<String, Integer> dowSummary;

    // 월별 실패 횟수 예: {"2025-11": 10}
    private Map<String, Integer> monthlySummary;

    public SummaryResultDto(Map<String, Integer> dowSummary,
                            Map<String, Integer> monthlySummary) {
        this.dowSummary = dowSummary;
        this.monthlySummary = monthlySummary;
    }

    public Map<String, Integer> getDowSummary() {
        return dowSummary;
    }

    public Map<String, Integer> getMonthlySummary() {
        return monthlySummary;
    }
}
