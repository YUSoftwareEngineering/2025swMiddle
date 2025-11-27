 /*
    Project: MonthlyCalendarDto.java
    Author: 윤나영
   Date of creation: 2025.11.23
   Date of last update: 2025.11.23
*/

 package com.example.SWEnginnering2025.dto;

 import java.time.LocalDate;
 import java.util.List;

 public class MonthlyCalendarDto {

     private LocalDate monthStart;              // 해당 달의 1일
     private LocalDate monthEnd;                // 해당 달의 마지막 날
     private List<DaySummary> days;             // 1일 ~ 말일까지 하루 요약 리스트

     public MonthlyCalendarDto(LocalDate monthStart,
                               LocalDate monthEnd,
                               List<DaySummary> days) {
         this.monthStart = monthStart;
         this.monthEnd = monthEnd;
         this.days = days;
     }

     public LocalDate getMonthStart() {
         return monthStart;
     }

     public LocalDate getMonthEnd() {
         return monthEnd;
     }

     public List<DaySummary> getDays() {
         return days;
     }

     // 하루에 대한 요약 정보 (주간 DTO의 DaySummary 와 거의 동일)
     public static class DaySummary {
         private LocalDate date;
         private int totalGoals;
         private int doneCount;
         private String dayOfWeek;

         public DaySummary(LocalDate date, int totalGoals, int doneCount, String dayOfWeek) {
             this.date = date;
             this.totalGoals = totalGoals;
             this.doneCount = doneCount;
             this.dayOfWeek = dayOfWeek;
         }

         public LocalDate getDate() { return date;}

         public int getTotalGoals() {return totalGoals;}

         public int getDoneCount() {return doneCount;}
         public String getDayOfWeek() { return dayOfWeek; }
     }
 }
