/*Project: SummaryResultDto.java
        Author: 최은샘
        Date of creation: 2025.12.01
        Date of last update: 2025.12.01
*/

package com.example.SWEnginnering2025.dto.failure;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
public class SummaryResultDto {

    /**
     * 요일별 실패 횟수
     * key: "MON", "TUE", ... (대문자 요일)
     * value: 실패 건수
     */
    private Map<String, Long> dowSummary;

    /**
     * 월별 실패 추이
     * key: "2025-11" 같은 Year-Month 문자열
     * value: 실패 건수
     */
    private Map<String, Long> monthlySummary;
}