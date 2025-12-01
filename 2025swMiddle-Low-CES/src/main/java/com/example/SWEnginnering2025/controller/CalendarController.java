package com.example.SWEnginnering2025.controller;

import com.example.SWEnginnering2025.dto.DailyCalendarDto;
import com.example.SWEnginnering2025.dto.WeeklyCalendarDto;
import com.example.SWEnginnering2025.dto.MonthlyCalendarDto;
import com.example.SWEnginnering2025.service.GoalService; // 컨트롤러는 HTTP 요청만 받고, 로직은 전부 이 서비스에게 맡김

// 스프링 MVC 어노테이션들을 쓰기 위한 import
import org.springframework.format.annotation.DateTimeFormat; // 문자열을 LocalDate 로 변환할 때 형식 지정
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController // 메서드에서 리턴하는 객체를 바로 JSON 으로 변환해서 응답 본문에 넣어줌
@RequestMapping("/api/v1/calendar") // 이 컨트롤러의 기본 URL prefix 를 /api/calendar 로 설정
// 아래 메서드의 경로 /weekly, /daily 앞에 자동으로 /api/calendar 가 붙습니다.
public class CalendarController {

    // 이 컨트롤러가 사용할 서비스 객체를 담을 필드
    // final 이라서 생성자에서 한 번 정해지면 변경되지 않음
    private final GoalService GoalService;


    public CalendarController(GoalService GoalService) { // 스프링이 애플리케이션을 시작할 때 CalendarService 빈을 만들어 이 생성자의 GoalService 파라미터에 넣어 줌
        this.GoalService = GoalService; // 우리는 그 객체를 this.GoalService 필드에 저장해 두고 아래의 메서드들에서 사용
    }

    @GetMapping("/monthly")
    public MonthlyCalendarDto getMonthlyCalendar(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        return GoalService.getMonthlyCalendar(userId, date);
    }


    @GetMapping("/weekly") // HTTP GET 요청 중에서  GET /api/calendar/weekly 로 들어오는 요청을 이 메서드와 매핑
    public WeeklyCalendarDto getWeeklyCalendar( // 반환 타입이 WeeklyCalendarDto 이므로 호출 결과가 JSON 으로 변환되어 프론트로 넘어감
                                                @RequestParam Long userId, // URL 쿼리스트링의 userId 값을 읽어옴 (예:...?userId=1&date=2025-11-05)
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) // yyyy-MM-dd 형식의 문자열을 LocalDate 로 변환하라고 지정
                                                LocalDate date  // URL 쿼리스트링의 data값을 읽어옴
    ) {
        // 서비스의 getWeeklyCalendar(userId, date)를 호출해서 주간 데이터(WeeklyCalendarDto)를 받아 그대로 반환
        return GoalService.getWeeklyCalendar(userId, date);
    }

    @GetMapping("/daily") // GET /api/calendar/daily 요청을 이 메서드에 매핑
    public DailyCalendarDto getDailyCalendar(  // 하루에 대한 상세 목표 리스트가 JSON 으로 내려감
                                               @RequestParam Long userId,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                                               LocalDate date
    ) {
        // 서비스의 getDailyCalendar(userId, date) 를 호출
        // 이 메서드가 DB에서 해당 날짜의 Goal 들을 조회하고 DailyCalendarDto 로 변환해서 돌려줌
        return GoalService.getDailyCalendar(userId, date);
    }
}
