/*
    Project: GoalService.java
    Author: CES, YNY
	Date of creation: 2025.11.23
	Date of last update: 2025.11.23
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


// @Service, @Transactional 같은 스프링 어노테이션 사용을 위해 import
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek; // 기준 날짜에서 월요일을 계산할 때 사용
import java.time.LocalDate;
import java.util.*; // List, Map, ArrayList, Collections, HashMap 등을 쓰기위해 사용
import java.util.stream.Collectors; // 스트림으로 그룹핑/변환할 때 사용

@Service // 이 클래스가 서비스 계층(비즈니스 로직 담당)이라는 것을 스프링에게 알려줌
@Transactional(readOnly = true) // 이 클래스의 메서드들은 기본적으로 트랜잭션 안에서 실행되고, 읽기 전용

public class GoalService { // GoalService 안에서만 쓸 수 있고, 생성자에서 한 번 정해진 뒤로는 절대 바뀌지 않는 GoalRepository 필드를 하나 갖고 있다.

    private final GoalRepository goalRepository;

    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

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
            int done = (int) daily.stream()
                    .filter(g -> g.getStatus() == GoalStatus.DONE)
                    .count();

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
            int done = (int) daily.stream()  // 해당 날짜의 Goal 리스트를 스트림으로 변환
                    .filter(g -> g.getStatus() == GoalStatus.DONE) // 상태가 DONE 인 목표들만 골라냄
                    .count(); // 필터링된 목표의 개수를 세서 done(완료된 목표 개수)에 저장

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
                        g.getStatus().name() // enum 값(GoalStatus.DONE)을 문자열 "DONE" 으로 변환
                ))
                .collect(Collectors.toList()); // 변환된 DetailItem 들을 리스트로 모아서 items 에 저장

        return new DailyCalendarDto(date, items); // 전달받은 date와, 방금 만든 items 리스트를 사용해 DailyCalendarDto 객체를 만들고 반환
                                                 //이 값이 ViewModel/프론트로 넘어가서 하루 상세 화면을 구성
    }
}
