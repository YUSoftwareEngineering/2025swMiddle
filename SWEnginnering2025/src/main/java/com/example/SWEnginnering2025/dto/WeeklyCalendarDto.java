/*
    Project: WeeklyCalendarDto.java
    Author: CES
	Date of creation: 2025.11.23
	Date of last update: 2025.11.23
*/

package com.example.SWEnginnering2025.dto;

import java.time.LocalDate;
import java.util.List;

// 이 정보를 백엔드에서 프론트로 보낼때 사용
public class WeeklyCalendarDto { // 한 주(월~일)의 캘린더 정보를 한번에 담아서 반환 위한 DTO
                                 // 11월 2일 - 11월 8일
                                 // 월, 화, 수 … 카드들

    private LocalDate weekStart;       // 주 시작(월요일)
    private LocalDate weekEnd;         // 주 끝(일요일)
    private List<DaySummary> days;     // 이 주에 속한 각 요일의 요약 정보 리스트
                                       // DaySummary 라는 내부 클래스를 여러 개(List) 담고 있음
                                       //월~일 7개가 들어가게 됩니다.

    public WeeklyCalendarDto(LocalDate weekStart,
                             LocalDate weekEnd,
                             List<DaySummary> days) {
        this.weekStart = weekStart;
        this.weekEnd = weekEnd;
        this.days = days;
    }

    public LocalDate getWeekStart() { return weekStart; } // weekStart 값을 읽어오는 메소드. 외부에서 호출시 해당 값 반환
    public LocalDate getWeekEnd() { return weekEnd; } // weekEnd 값을 읽어오는 메소드.
    public List<DaySummary> getDays() { return days; } // days 리스트(각 날짜의 요약 정보들)를 읽어오는 메소드

    // 하루에 대한 요약 정보
    public static class DaySummary { // 한 날짜(예: 11월 5일)에 대한 정보(몇 개 중 몇 개 완료인지 등)를 담음.
        private LocalDate date;  // 이 요약이 어느 날짜에 대한 것인지
        private int totalGoals; // 그 날짜에 등록된 전체 목표 개수
        private int doneCount; // 그 날짜에 등록된 목표 중에서 완료(DONE)된 목표 개수

        public DaySummary(LocalDate date, int totalGoals, int doneCount) {
            this.date = date;
            this.totalGoals = totalGoals;
            this.doneCount = doneCount;
        }

        public LocalDate getDate() { return date; }
        public int getTotalGoals() { return totalGoals; }
        public int getDoneCount() { return doneCount; }
    }
}
