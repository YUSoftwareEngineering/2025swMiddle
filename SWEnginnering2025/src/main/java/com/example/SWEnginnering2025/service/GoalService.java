
/*
    Project: GoalService.java
    Author: 최은샘, 윤나영 , 이채민, 한지윤
	Date of creation: 2025.11.23
	Date of last update: 2025.11.24
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
import com.nimbusds.oauth2.sdk.auth.JWTAuthentication;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.util.List;


// @Service, @Transactional 같은 스프링 어노테이션 사용을 위해 import

import java.time.DayOfWeek; // 기준 날짜에서 월요일을 계산할 때 사용
import java.util.*; // List, Map, ArrayList, Collections, HashMap 등을 쓰기위해 사용
import java.util.stream.Collectors; // 스트림으로 그룹핑/변환할 때 사용

@Service // 이 클래스가 서비스 계층(비즈니스 로직 담당)이라는 것을 스프링에게 알려줌
@Transactional(readOnly = true) // 이 클래스의 메서드들은 기본적으로 트랜잭션 안에서 실행되고, 읽기 전용
@RequiredArgsConstructor
public class GoalService { // GoalService 안에서만 쓸 수 있고, 생성자에서 한 번 정해진 뒤로는 절대 바뀌지 않는 GoalRepository 필드를 하나 갖고 있다.

    private final GoalRepository goalRepository;


    // 월간 캘린더 조회
    public MonthlyCalendarDto getMonthlyCalendar(Long userId, LocalDate baseDate) {

        // baseDate 가 포함된 달의 1일, 마지막 날 계산
        YearMonth ym = YearMonth.from(baseDate);
        LocalDate monthStart = ym.atDay(1);                        // 1일
        LocalDate monthEnd = ym.atEndOfMonth();                    // 마지막 날
        int lengthOfMonth = ym.lengthOfMonth();                    // 일 수

        // 그 달 동안의 모든 Goal 조회
        List<Goal> goals =
                goalRepository.findByUserIdAndTargetDateBetween(userId, monthStart, monthEnd);

        // 날짜별로 묶기
        Map<LocalDate, List<Goal>> byDate = goals.stream()
                .collect(Collectors.groupingBy(Goal::getTargetDate));

        List<MonthlyCalendarDto.DaySummary> days = new ArrayList<>();

        // 1일부터 마지막 날까지 하루씩 돌면서 요약 만들기
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
    // serId 사용자의, baseDate가 포함된 주(월~일)를 기준으로 그 주의 목표 요약 정보를 계산해서 WeeklyCalendarDto로 돌려줌
    public WeeklyCalendarDto getWeeklyCalendar(Long userId, LocalDate baseDate) {

        LocalDate monday = baseDate.with(DayOfWeek.MONDAY);  // baseDate 가 속한 주(week)의 월요일 날짜를 계산
        LocalDate sunday = monday.plusDays(6); // 월요일에 6일을 더해서 일요일 날짜를 구함

        // GoalRepository 를 사용해서 해당 userId 이고, targetDate 가 monday ~ sunday 사이인 모든 Goal 리스트를 DB에서 조회후 결과를 goals 리스트에 담음
        List<Goal> goals =
                goalRepository.findByUserIdAndTargetDateBetween(userId, monday, sunday);


        // goals 안에는 이번주 목표들이 쭉 들어있는데 이 리스트를 날짜 별로 묶어 Map으로 바꿈
        Map<LocalDate, List<Goal>> byDate = goals.stream()  // key는 날짜, value는 그날짜의 Goal들
                .collect(Collectors.groupingBy(Goal::getTargetDate)); // 각 Goal의 targetDate 기준으로 날짜별로 그룹핑

        // 최종적으로 WeeklyCalendarDto 에 넣을 하루 요약 객체(DaySummary) 리스트를 담을 빈 리스트를 생성
        List<WeeklyCalendarDto.DaySummary> days = new ArrayList<>();

        for (int i = 0; i < 7; i++) { // 월요일부터 일요일까지 7일을 순회하기 위한 for문
            LocalDate date = monday.plusDays(i); // i=0은 월요일, i=6은 일요일, 해당 날짜를 data에 저장
            List<Goal> daily = byDate.getOrDefault(date, Collections.emptyList()); // byDate 맵에서 key가 data인 리스트(그 날의 Goal들)를 꺼냄
                                                                                   // 그날짜에 목표가 없다면 Collections.emptyList() (빈 리스트)를 대신 사용

            int total = daily.size(); // 그 날짜에 있는 목표 개수(전체) 를 구함
            int done  = (int) countCompleted(daily);

            // 요일 문자열 (월, 화, 수 ...)
            String dayOfWeek = date.getDayOfWeek()
                    .getDisplayName(TextStyle.SHORT, Locale.KOREAN);

            // 방금 계산한 날짜 (date), 전체 목표 수 (total), 완료 수 (done), 요일(dayOfWeek)를 사용해서 DaySummary 객체를 하나 만들고, days 리스트에 추가
            days.add(new WeeklyCalendarDto.DaySummary(date, total, done, dayOfWeek));
        }

        return new WeeklyCalendarDto(monday, sunday, days); // 이 값이 컨트롤러 거쳐 프론트로 내려감
    }

    // 특정 날짜의 상세 목표 리스트를 조회
    public DailyCalendarDto getDailyCalendar(Long userId, LocalDate date) {

        // GoalRepository를 사용해 userId 이고, targetDate가 date인 모든 Goal 들을 DB에서 조회후 결과를 daily 리스트에 저장
        List<Goal> daily =
                goalRepository.findByUserIdAndTargetDate(userId, date);

        List<DailyCalendarDto.DetailItem> items = daily.stream() // 조회한 Goal 리스트를 스트림으로 변환
                .map(g -> new DailyCalendarDto.DetailItem( // 각 Goal g 를 화면에 필요한 형태로만 갖는 DetailItem DTO 로 변환
                        g.getId(),
                        g.getTitle(),
                        g.getDescription(),
                        g.getStatus().name() // enum 값(GoalStatus.COMPLETED)을 문자열 "CONMLETED" 으로 변환
                ))
                .collect(Collectors.toList()); // 변환된 DetailItem 들을 리스트로 모아서 items 에 저장

        return new DailyCalendarDto(date, items); // 전달받은 date와, 방금 만든 items 리스트를 사용해 DailyCalendarDto 객체를 만들고 반환
                                                 //이 값이 ViewModel/프론트로 넘어가서 하루 상세 화면을 구성
    }


    // 1. 목표 생성
    @Transactional
    public GoalResponse createGoal(Long userId,CreateGoalRequest request) {
        // 중복 체크 로직
        boolean isDuplicate = goalRepository.existsByUserIdAndTargetDateAndTitle(
                userId, request.getTargetDate(), request.getTitle());

        if (isDuplicate) {
            //409 Conflict 에러
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 유사한 목표가 있습니다.");
        }
        // 상자(DTO)에서 꺼내서 진짜 데이터(Entity)로 변환
        Goal goal = Goal.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .targetDate(request.getTargetDate())
                .category(request.getCategory())
                .isNotificationEnabled(request.isNotificationEnabled())
                .scheduledTime(request.getScheduledTime())
                .userId(1L) // 임시 유저 ID
                .build();

        // 저장
        Goal savedGoal = goalRepository.save(goal);

        // 결과 상자(DTO)로 포장해서 반환
        return GoalResponse.from(savedGoal);
    }
    // 2. 목표 수정
    @Transactional
    public GoalResponse updateGoal(Long id, CreateGoalRequest request) {
        Goal goal = findGoalById(id);
        // 내용 수정 (더티 체킹: 저장(save) 안 불러도 알아서 DB가 바뀜)
        goal.update(request.getTitle(), request.getDescription(), request.getTargetDate(),
                request.getCategory(), request.isNotificationEnabled(), request.getScheduledTime());

        return GoalResponse.from(goal);
    }

    // 3. 목표 삭제
    @Transactional
    public void deleteGoal(Long id) {
        // 1. DB에서 목표 찾기 (없으면 에러)
        Goal goal = findGoalById(id);
        // 2. 삭제하기
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
        // 반복문(for-each)으로 하나씩 꺼내서 처리
        for (Long id : request.getIds()) {
            Goal goal = findGoalById(id); // 아까 만든 도우미 메서드 재사용!

            // 일괄 처리는 보통 메모/사진 없이 상태만 바꿈 (null 전달)
            goal.changeStatus(request.getStatus(), null, null);
        }
    }
    // 5. 실패 기록 (Goal 상태를 FAILED로 변경)
    @Transactional
    public void markGoalAsFailed(Long goalId){
        Goal goal = findGoalById(goalId);

        // GoalStatus enum 안에 FAILED 있는지 확인해야 함
        goal.changeStatus(GoalStatus.FAILED, "FailureLogService 자동 기록", null);
    }

    private Goal findGoalById(Long id) {
        return goalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 목표가 없습니다. ID=" + id));
    }

    // 7. [신규] 특정 날짜의 성과 색상 조회
    @Transactional(readOnly = true)
    public AchievementColor getAchievementColor(Long userId,LocalDate date) {
        // 1. 해당 날짜의 모든 목표 가져오기
        List<Goal> goals = goalRepository.findAllByUserIdAndTargetDate(userId, date);

        // 2. 공통 메서드로 색상 결정
        return decideAchievementColor(goals);
    }

    // 1) 해당 날짜(또는 리스트)의 완료 개수만 세는 공통 메서드
    private long countCompleted(List<Goal> goals) {
        return goals.stream()
                .filter(goal -> goal.getStatus() == GoalStatus.COMPLETED)
                .count();
    }

    // 2) 리스트 하나에 대한 성과 색상 계산 공통 메서드
    private AchievementColor decideAchievementColor(List<Goal> goals) {
        if (goals.isEmpty()) {
            return AchievementColor.GREY;   // 목표 없음
        }

        long completedCount = countCompleted(goals);

        if (completedCount == goals.size()) {
            return AchievementColor.BLUE;   // 전부 완료
        } else if (completedCount == 0) {
            return AchievementColor.RED;    // 하나도 안 함
        } else {
            return AchievementColor.YELLOW; // 섞여 있음
        }
    }

}
