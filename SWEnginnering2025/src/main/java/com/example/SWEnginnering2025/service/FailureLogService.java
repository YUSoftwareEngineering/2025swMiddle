/*Project: AttachmentController.java
        Author: 한지윤
        Date of creation: 2025.11.23
        Date of last update: 2025.11.23
                */

package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.model.FailureLog;
import com.example.SWEnginnering2025.model.FailureTag;
import com.example.SWEnginnering2025.dto.failure.CreateTagRequest;
import com.example.SWEnginnering2025.dto.failure.FailureLogResponse;
import com.example.SWEnginnering2025.dto.failure.FailureTagDto;
import com.example.SWEnginnering2025.dto.failure.LogFailureRequest;
import com.example.SWEnginnering2025.repository.FailureLogRepository;
import com.example.SWEnginnering2025.repository.FailureTagRepository;
import com.example.SWEnginnering2025.dto.failure.FailurePatternAnalysisResponse;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
@Setter
public class FailureLogService {

    private final FailureTagRepository failureTagRepository;
    private final FailureLogRepository failureLogRepository;
    private final GoalService goalService; // 목표 상태를 FAILED로 바꾸는 용도

    // ============================================================
    // 1) 실패 기록 화면에서 사용할 태그 목록 조회
    //    - 기본 제공 태그(builtIn = true)
    //    - + 해당 유저의 커스텀 태그(userId = ?)
    // ============================================================
    @Transactional(readOnly = true)
    public List<FailureTagDto> getFailureTags(Long userId) {
        List<FailureTag> tags = failureTagRepository.findByBuiltInTrueOrUserId(userId);
        return tags.stream()
                .map(FailureTagDto::from)
                .collect(toList());
    }

    // ============================================================
    // 2) 커스텀 태그 생성
    // ============================================================
    @Transactional
    public FailureTagDto createFailureTag(Long userId, CreateTagRequest request) {
        String rawName = request.getName();
        String name = rawName == null ? "" : rawName.trim();

        if (name.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "태그 이름은 비어 있을 수 없습니다.");
        }

        boolean exists = failureTagRepository.findByUserIdAndName(userId, name).isPresent();
        if (exists) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 동일한 이름의 태그가 존재합니다.");
        }

        FailureTag tag = new FailureTag(userId, name, false);
        FailureTag saved = failureTagRepository.save(tag);

        return FailureTagDto.from(saved);
    }

    // ============================================================
    // 3) 실패 기록 저장 + 해당 Goal 상태를 FAILED 로 변경
    // ============================================================
    @Transactional
    public FailureLogResponse logFailure(Long userId, LogFailureRequest request) {

        // 3-1) 태그 선택 여부 검증
        if (request.getTagIds() == null || request.getTagIds().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "최소 1개 이상의 실패 사유 태그를 선택해야 합니다.");
        }

        // 3-2) 선택된 태그 ID들로 실제 태그 엔티티 조회
        List<FailureTag> tags = failureTagRepository.findAllById(request.getTagIds());
        if (tags.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "선택한 태그들을 찾을 수 없습니다.");
        }

        // 3-3) FailureLog 엔티티 생성 (setter 기반)
        FailureLog log = new FailureLog();
        log.setUserId(userId);
        log.setGoalId(request.getGoalId());
        log.setMemo(request.getMemo());
        log.setFailedDate(LocalDate.now());
        log.setFailedAt(LocalDateTime.now());

        tags.forEach(log::addTag);

        FailureLog saved = failureLogRepository.save(log);

        // 3-4) 해당 목표 상태를 FAILED 로 변경
        goalService.markGoalAsFailed(request.getGoalId());

        // 3-5) DTO로 변환해서 반환
        return FailureLogResponse.from(saved);
    }

    // ============================================================
    // 4) 특정 Goal에 대한 실패 기록 목록 조회
    // ============================================================
    @Transactional(readOnly = true)
    public List<FailureLogResponse> getFailureLogs(Long userId, Long goalId) {
        return failureLogRepository.findByUserIdAndGoalId(userId, goalId)
                .stream()
                .map(FailureLogResponse::from)
                .collect(toList());
    }

    // ============================================================
    // 5) 실패 패턴 분석 (요일별 / 시간대별)
    //    - 24번 개인 맞춤 조언의 근거 데이터
    // ============================================================
    @Transactional(readOnly = true)
    public FailurePatternAnalysisResponse analyzeFailurePattern(
            Long userId,
            LocalDate from,
            LocalDate to
    ) {
        // null 파라미터 방어
        if (from == null) from = LocalDate.of(1970, 1, 1);
        if (to == null) to = LocalDate.now();

        // 기간 내 실패 로그 조회
        List<FailureLog> logs =
                failureLogRepository.findByUserIdAndFailedDateBetween(userId, from, to);

        // 요일별 카운트 (EnumMap 사용)
        Map<DayOfWeek, Long> weekdayCount = new EnumMap<>(DayOfWeek.class);

        // 시간대별 카운트
        Map<String, Long> timeSlotCount = new LinkedHashMap<>();
        timeSlotCount.put("DAWN(00-06)", 0L);
        timeSlotCount.put("MORNING(06-12)", 0L);
        timeSlotCount.put("AFTERNOON(12-18)", 0L);
        timeSlotCount.put("EVENING(18-22)", 0L);
        timeSlotCount.put("NIGHT(22-24)", 0L);

        // 로그 순회하며 카운트
        for (FailureLog log : logs) {
            LocalDateTime failedAt = log.getFailedAt();
            if (failedAt == null) {
                LocalDate failedDate = log.getFailedDate();
                if (failedDate == null) {
                    // 날짜 정보 없으면 분석 제외
                    continue;
                }
                failedAt = failedDate.atStartOfDay();
            }

            // 요일 카운트
            DayOfWeek dayOfWeek = failedAt.getDayOfWeek();
            weekdayCount.merge(dayOfWeek, 1L, Long::sum);

            // 시간대 카운트
            int hour = failedAt.getHour();
            String slotKey;
            if (hour < 6) {
                slotKey = "DAWN(00-06)";
            } else if (hour < 12) {
                slotKey = "MORNING(06-12)";
            } else if (hour < 18) {
                slotKey = "AFTERNOON(12-18)";
            } else if (hour < 22) {
                slotKey = "EVENING(18-22)";
            } else {
                slotKey = "NIGHT(22-24)";
            }

            timeSlotCount.merge(slotKey, 1L, Long::sum);
        }

        // 요일 → 문자열 키 맵으로 변환
        Map<String, Long> weekdayResult = new LinkedHashMap<>();
        for (DayOfWeek d : DayOfWeek.values()) {
            weekdayResult.put(d.name(), weekdayCount.getOrDefault(d, 0L));
        }

        // 최다 실패 요일
        String mostFailedWeekday = weekdayResult.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        // 최다 실패 시간대
        String mostFailedTimeSlot = timeSlotCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        // DTO로 반환
        return new FailurePatternAnalysisResponse(
                weekdayResult,
                timeSlotCount,
                mostFailedWeekday,
                mostFailedTimeSlot
        );
    }
}
