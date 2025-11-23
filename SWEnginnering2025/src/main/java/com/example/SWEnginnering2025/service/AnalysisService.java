package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.domain.FailureLog;
import com.example.SWEnginnering2025.dto.analysis.AnalysisRequest;
import com.example.SWEnginnering2025.dto.analysis.PatternResultDto;
import com.example.SWEnginnering2025.dto.analysis.SummaryRequest;
import com.example.SWEnginnering2025.dto.analysis.SummaryResultDto;
import com.example.SWEnginnering2025.repository.FailureLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.summingInt;

@Service
public class AnalysisService {

    private final FailureLogRepository failureLogRepository;

    public AnalysisService(FailureLogRepository failureLogRepository) {
        this.failureLogRepository = failureLogRepository;
    }

    // 1) 실패 패턴 분석 (Detection Only)
    @Transactional(readOnly = true)
    public PatternResultDto analyzePatterns(AnalysisRequest request) {
        List<FailureLog> logs = failureLogRepository.findByUserIdAndFailedDateBetween(
                request.getUserId(),
                request.getFrom(),
                request.getTo()
        );

        // 여기서는 간단하게: 요일별 개수 기준으로 가장 많이 나온 요일 하나만 "패턴"이라고 가정
        if (logs.isEmpty()) {
            return new PatternResultDto("no-pattern", Collections.emptyList());
        }

        Map<DayOfWeek, Long> byDow = logs.stream()
                .collect(groupingBy(l -> l.getFailedDate().getDayOfWeek(), summingInt(l -> 1)))
                .entrySet().stream()
                .collect(HashMap::new,
                        (m, e) -> m.put(e.getKey(), e.getValue().longValue()),
                        HashMap::putAll);

        long max = byDow.values().stream().mapToLong(Long::longValue).max().orElse(0);
        if (max < 3) { // 적당히 임계값 3 이상일 때만 "패턴"이라고 칭함
            return new PatternResultDto("no-pattern", Collections.emptyList());
        }

        List<PatternResultDto.RepeatedPattern> repeats = new ArrayList<>();
        for (var entry : byDow.entrySet()) {
            if (entry.getValue() == max) {
                String dow = entry.getKey().name(); // "MONDAY" 등
                repeats.add(new PatternResultDto.RepeatedPattern(dow, "ALL", "FREQUENT_FAILURE"));
            }
        }

        return new PatternResultDto("pattern-found", repeats);
    }

    // 2) 실패 로그 요약 (시각화용)
    @Transactional(readOnly = true)
    public SummaryResultDto getSummary(SummaryRequest request) {
        List<FailureLog> logs = failureLogRepository.findByUserIdAndFailedDateBetween(
                request.getUserId(),
                request.getFrom(),
                request.getTo()
        );

        // 요일별 개수
        Map<String, Integer> dowSummary = new HashMap<>();
        for (FailureLog log : logs) {
            String dow = log.getFailedDate().getDayOfWeek().name(); // MONDAY...
            dowSummary.merge(dow, 1, Integer::sum);
        }

        // 월별 개수 (yyyy-MM)
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");
        Map<String, Integer> monthlySummary = new HashMap<>();
        for (FailureLog log : logs) {
            String key = log.getFailedDate().format(fmt);
            monthlySummary.merge(key, 1, Integer::sum);
        }

        return new SummaryResultDto(dowSummary, monthlySummary);
    }
}
