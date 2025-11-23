/*
    Project: DailyCalendarDto.java
    Author: CES
	Date of creation: 2025.11.23
	Date of last update: 2025.11.23
*/

package com.example.SWEnginnering2025.dto;

import java.time.LocalDate;
import java.util.List;

public class DailyCalendarDto { // 하루에 대한 캘린더 정보 전체를 담는 DTO

    private LocalDate date;           // DTO가 표현하고 있는 날짜(하루)
    private List<DetailItem> items;   // 그 날에 등록된 목표들 목록
                                      // 각 목표는  DetailItem 타입 하나로 표현되고, 그 DetailItem들이 List로 여러 개 모여 있다

    public DailyCalendarDto(LocalDate date, List<DetailItem> items) {
        this.date = date;
        this.items = items;
    }

    public LocalDate getDate() { return date; }
    public List<DetailItem> getItems() { return items; }


    public static class DetailItem { // 하루 상세 화면에서 목표 하나의 정보를 담음
        private Long id;  // 이 목표의 고유 ID 저장
        private String title;
        private String description;
        private String status; // "NOT_STARTED", "PARTIAL", "DONE", "FAILED"

        public DetailItem(Long id, String title, String description, String status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.status = status;
        }

        public Long getId() { return id; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public String getStatus() { return status; }
    }
}
