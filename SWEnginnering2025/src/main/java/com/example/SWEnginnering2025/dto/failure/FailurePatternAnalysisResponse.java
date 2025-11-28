/*Project: FailurePatternAnalysisResponse.java
        Author: 한지윤
        Date of creation: 2025.11.28
        Date of last update: 2025.11.28
 */

package com.example.SWEnginnering2025.dto.failure;

import lombok.Getter;
import java.util.Map;

/*
 실패 패턴 분석(요일/시간대별) 결과를 담는 DTO.
 countByWeekday      : 요일별 실패 횟수 집계 (예: "MONDAY" -> 3)
 countByTimeOfDay    : 시간대별 실패 횟수 집계 (예: "EVENING(18-22)" -> 5)
 mostFailedWeekday   : 가장 실패가 많이 발생한 요일 (동률이면 그 중 하나)
 mostFailedTimeOfDay : 가장 실패가 많이 발생한 시간대 (동률이면 그 중 하나)
 */

@Getter
public class FailurePatternAnalysisResponse {

    // 예: {"MONDAY": 2, "TUESDAY": 5, ...}
    private final Map<String, Long> countByWeekday;

    // 예: {"MORNING(6-12)": 3, "EVENING(18-22)": 4, ...}
    private final Map<String, Long> countByTimeOfDay;

    // 예: "TUESDAY", "FRIDAY"
    private final String mostFailedWeekday;

    // 예: "EVENING(18-22)"
    private final String mostFailedTimeOfDay;

    public FailurePatternAnalysisResponse(
            Map<String, Long> countByWeekday,
            Map<String, Long> countByTimeOfDay,
            String mostFailedWeekday,
            String mostFailedTimeOfDay
    ) {
        this.countByWeekday = countByWeekday;
        this.countByTimeOfDay = countByTimeOfDay;
        this.mostFailedWeekday = mostFailedWeekday;
        this.mostFailedTimeOfDay = mostFailedTimeOfDay;
    }

}