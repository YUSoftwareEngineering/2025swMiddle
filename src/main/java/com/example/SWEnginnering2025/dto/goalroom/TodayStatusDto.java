/*
   Project:TodayStatusDto.java
   Author: 윤나영
  Date of creation: 2025.11.30
  Date of last update: 2025.11.30
*/
package com.example.SWEnginnering2025.dto.goalroom;

import java.time.LocalDate;
import java.util.List;

public class TodayStatusDto {

    private Long roomId;
    private LocalDate date;
    private List<MemberTodayStatusDto> members;

    public TodayStatusDto() {}

    public TodayStatusDto(Long roomId, LocalDate date, List<MemberTodayStatusDto> members) {
        this.roomId = roomId;
        this.date = date;
        this.members = members;
    }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public List<MemberTodayStatusDto> getMembers() { return members; }
    public void setMembers(List<MemberTodayStatusDto> members) { this.members = members; }
}