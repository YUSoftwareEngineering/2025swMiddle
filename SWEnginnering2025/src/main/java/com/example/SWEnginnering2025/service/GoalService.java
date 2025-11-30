/*
    Project: GoalService.java
    Author: 최은샘, 윤나영 , 이채민, 한지윤
    Date of creation: 2025.11.23
    Date of last update: 2025.11.30/하드링크 수정
*/

package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.dto.DailyCalendarDto;
import com.example.SWEnginnering2025.dto.WeeklyCalendarDto;
import com.example.SWEnginnering2025.model.Goal;
import com.example.SWEnginnering2025.model.GoalStatus;
import com.example.SWEnginnering2025.repository.GoalRepository;
import com.example.SWEnginnering2025.dto.MonthlyCalendarDto;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.Locale;

import com.example.SWEnginnering2025.model.AchievementColor;
import com.example.SWEnginnering2025.dto.CreateGoalRequest;
import com.example.SWEnginnering2025.dto.GoalBulkUpdateRequest;
import com.example.SWEnginnering2025.dto.GoalResponse;
import com.example.SWEnginnering2025.dto.GoalStatusRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.util.List;
import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class GoalService {

    private final GoalRepository goalRepository;

    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    // 월간 캘린더 조회
    public MonthlyCalendarDto getMonthlyCalendar(Long userId, LocalDate baseDate) {
        YearMonth ym = YearMonth.from(baseDate);
        LocalDate monthStart = ym.atDay(1);
        LocalDate monthEnd = ym.atEndOfMonth();
        int lengthOfMonth = ym.lengthOfMonth();

        List<Goal> goals = goalRepository.findByUserIdAndTargetDateBetween(userId, monthStart, monthEnd);
        Map<LocalDate, List<Goal>> byDate = goals.stream()
                .collect(Collectors.groupingBy(Goal::getTargetDate));

        List<MonthlyCalendarDto.DaySummary> days = new ArrayList<>();

        for (int d = 1; d <= lengthOfMonth; d++) {
            LocalDate date = ym.atDay(d);
            List<Goal> daily = byDate.getOrDefault(date, Collections.emptyList());

            int total = daily.size();
            int done  = (int) countCompleted(daily);

            String dayOfWeek = date.getDayOfWeek()
                    .getDisplayName(TextStyle.SHORT, Locale.KOREAN);

            days.add(new MonthlyCalendarDto.DaySummary(date, total, done, dayOfWeek));
        }

        return new MonthlyCalendarDto(monthStart, monthEnd, days);
    }

    // 주간 캘린더 조회
    public WeeklyCalendarDto getWeeklyCalendar(Long userId, LocalDate baseDate) {
        LocalDate monday = baseDate.with(DayOfWeek.MONDAY);
        LocalDate sunday = monday.plusDays(6);

        List<Goal> goals = goalRepository.findByUserIdAndTargetDateBetween(userId, monday, sunday);
        Map<LocalDate, List<Goal>> byDate = goals.stream()
                .collect(Collectors.groupingBy(Goal::getTargetDate));

        List<WeeklyCalendarDto.DaySummary> days = new ArrayList<>();

        for (int i = 0; i < 7; i++) {
            LocalDate date = monday.plusDays(i);
            List<Goal> daily = byDate.getOrDefault(date, Collections.emptyList());

            int total = daily.size();
            int done  = (int) countCompleted(daily);

            String dayOfWeek = date.getDayOfWeek()
                    .getDisplayName(TextStyle.SHORT, Locale.KOREAN);

            days.add(new WeeklyCalendarDto.DaySummary(date, total, done, dayOfWeek));
        }

        return new WeeklyCalendarDto(monday, sunday, days);
    }

    // 특정 날짜의 상세 목표 리스트를 조회
    public DailyCalendarDto getDailyCalendar(Long userId, LocalDate date) {
        List<Goal> daily = goalRepository.findByUserIdAndTargetDate(userId, date);

        List<DailyCalendarDto.DetailItem> items = daily.stream()
                .map(g -> new DailyCalendarDto.DetailItem(
                        g.getId(),
                        g.getTitle(),
                        g.getDescription(),
                        g.getStatus().name()
                ))
                .collect(Collectors.toList());

        return new DailyCalendarDto(date, items);
    }


    // 1. 목표 생성 (수정됨: userId를 파라미터로 받음)
    @Transactional
    public GoalResponse createGoal(Long userId, CreateGoalRequest request) {
        // [수정] 1L -> userId 로 변경 (로그인한 사용자 ID 사용)
        boolean isDuplicate = goalRepository.existsByUserIdAndTargetDateAndTitle(
                userId, request.getTargetDate(), request.getTitle());

        if (isDuplicate) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 유사한 목표가 있습니다.");
        }

        Goal goal = Goal.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .targetDate(request.getTargetDate())
                .category(request.getCategory())
                .isNotificationEnabled(request.isNotificationEnabled())
                .scheduledTime(request.getScheduledTime())
                .userId(userId) // [수정] 1L -> userId 로 변경
                .build();

        Goal savedGoal = goalRepository.save(goal);
        return GoalResponse.from(savedGoal);
    }

    // 2. 목표 수정
    @Transactional
    public GoalResponse updateGoal(Long id, CreateGoalRequest request) {
        Goal goal = findGoalById(id);
        // (추후 필요 시 여기서 goal.getUserId()와 현재 로그인한 userId가 같은지 검증하는 로직 추가 가능)
        goal.update(request.getTitle(), request.getDescription(), request.getTargetDate(),
                request.getCategory(), request.isNotificationEnabled(), request.getScheduledTime());

        return GoalResponse.from(goal);
    }

    // 3. 목표 삭제
    @Transactional
    public void deleteGoal(Long id) {
        Goal goal = findGoalById(id);
        goalRepository.delete(goal);
    }

    // 4. 목표 상태 변경
    @Transactional
    public GoalResponse updateStatus(Long id, GoalStatusRequest request) {
        Goal goal = findGoalById(id);
        goal.changeStatus(request.getStatus(), request.getStatusMemo(), request.getProofUrl());
        return GoalResponse.from(goal);
    }

    // 목표 일괄 상태 변경 (Bulk Update)
    @Transactional
    public void updateStatusBulk(GoalBulkUpdateRequest request) {
        for (Long id : request.getIds()) {
            Goal goal = findGoalById(id);
            goal.changeStatus(request.getStatus(), null, null);
        }
    }

    // 5. 실패 기록
    @Transactional
    public void markGoalAsFailed(Long goalId){
        Goal goal = findGoalById(goalId);
        goal.changeStatus(GoalStatus.FAILED, "FailureLogService 자동 기록", null);
    }

    private Goal findGoalById(Long id) {
        return goalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 목표가 없습니다. ID=" + id));
    }

    // 7. [수정] 특정 날짜의 성과 색상 조회 (userId를 파라미터로 받음)
    @Transactional(readOnly = true)
    public AchievementColor getAchievementColor(Long userId, LocalDate date) {
        // [수정] 1L -> userId 로 변경
        List<Goal> goals = goalRepository.findAllByUserIdAndTargetDate(userId, date);
        return decideAchievementColor(goals);
    }

    private long countCompleted(List<Goal> goals) {
        return goals.stream()
                .filter(goal -> goal.getStatus() == GoalStatus.COMPLETED)
                .count();
    }

    private AchievementColor decideAchievementColor(List<Goal> goals) {
        if (goals.isEmpty()) {
            return AchievementColor.GREY;
        }

        long completedCount = countCompleted(goals);

        if (completedCount == goals.size()) {
            return AchievementColor.BLUE;
        } else if (completedCount == 0) {
            return AchievementColor.RED;
        } else {
            return AchievementColor.YELLOW;
        }
    }
}