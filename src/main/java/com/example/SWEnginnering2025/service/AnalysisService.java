/*Project: AnalysisService.java
        Author: 최은샘
        Date of creation: 2025.12.01
        Date of last update: 2025.12.01
*/

package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.dto.failure.SummaryRequest;
import com.example.SWEnginnering2025.dto.failure.SummaryResultDto;
import com.example.SWEnginnering2025.model.FailureLog;
import com.example.SWEnginnering2025.repository.FailureLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.counting;
import static java.util.stream.Collectors.groupingBy;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalysisService {

    private final FailureLogRepository failureLogRepository;

    // SummaryRequest 를 받아, 실패 로그를 요약한 결과(SummaryResultDto)를 만들어 반환하는 메서드
    public SummaryResultDto getSummary(SummaryRequest request) {

        LocalDate to = request.getTo() != null ? request.getTo() : LocalDate.now(); // 요청에 to 가 들어와 있으면 그 날짜를 쓰고, 없으면 오늘 날짜(LocalDate.now())를 기본값으로 사용
        LocalDate from;
        if (request.getFrom() != null) {  // 요청에 from 이 명시되어 있으면 그대로 사용, 아니면 else로
            from = request.getFrom();
        } else {
            int weeks = request.getWeeks() > 0 ? request.getWeeks() : 4; // weeks 값이 1 이상이면 그대로 쓰고, 0이하라면 기본 4주 사용
            from = to.minusWeeks(weeks); // to=2025-12-01, weeks=4 → from=2025-11-03.
        }

        // userId 가 요청의 userId 이고, 실패 날짜가 from ~ to 사이인 모든 실패 로그를 DB에서 조회해서 logs 리스트에 담음
        List<FailureLog> logs =
                failureLogRepository.findByUserIdAndFailedDateBetween(
                        request.getUserId(), from, to
                );

        // 1) 요일별 실패 횟수 분포 계산
        Map<DayOfWeek, Long> dowMap = logs.stream()
                .collect(groupingBy( // 스트림의 요소들을 요일(DayOfWeek)로 그룹핑
                        log -> log.getFailedDate().getDayOfWeek(),
                        () -> new EnumMap<>(DayOfWeek.class),
                        counting()
                ));

        // 요일 enum 을 "MON" "TUE" 처럼 문자열로 바꾸고, 월요일~일요일 순서로 정렬
        Map<String, Long> dowSummary = new LinkedHashMap<>();
        DayOfWeek[] order = { // 월~일 순서로 요일 배열을 만들고, 이 순서를 기준으로 dowSummary 에 값을 채워 넣음
                DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
                DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY,
                DayOfWeek.SUNDAY
        };
        for (DayOfWeek d : order) { // "MON" → 3, "TUE" → 0 … 형태의 dowSummary 를 완성
            dowSummary.put(d.name().substring(0, 3), dowMap.getOrDefault(d, 0L));
        }

        // 2) 월별 실패 추이를 계산 (YearMonth 기준)
        Map<YearMonth, Long> ymMap = logs.stream()
                .collect(groupingBy(
                        log -> YearMonth.from(log.getFailedDate()), // 날짜에서 년도-월(YearMonth) 만 뽑음
                        counting()
                ));

        Map<String, Long> monthlySummary = new LinkedHashMap<>();
        ymMap.entrySet().stream()
                .sorted(Map.Entry.comparingByKey(Comparator.naturalOrder()))
                .forEach(e -> monthlySummary.put(e.getKey().toString(), e.getValue()));

        return SummaryResultDto.builder() // 요일별, 월별 Map 을 SummaryResultDto 에 넣어 빌더로 생성하고 반환
                .dowSummary(dowSummary)
                .monthlySummary(monthlySummary)
                .build();
    }
}