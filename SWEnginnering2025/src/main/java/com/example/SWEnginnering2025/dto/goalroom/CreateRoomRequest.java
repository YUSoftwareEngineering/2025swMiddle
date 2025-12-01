package com.example.SWEnginnering2025.dto.goalroom;

/*
   Project: CreateRoomRequest.java
   Author: 윤나영
  Date of creation: 2025.11.30
  Date of last update: 2025.11.30
*/

import com.example.SWEnginnering2025.model.goalroom.GoalRoomVisibility;
import java.time.LocalDate;

public class CreateRoomRequest {

    private String roomName;
    private String goal;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer maxMembers;
    private GoalRoomVisibility visibility;

    public CreateRoomRequest() {}

    public CreateRoomRequest(String roomName, String goal, String description,
                             LocalDate startDate, LocalDate endDate,
                             Integer maxMembers, GoalRoomVisibility visibility) {
        this.roomName = roomName;
        this.goal = goal;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.maxMembers = maxMembers;
        this.visibility = visibility;
    }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Integer getMaxMembers() { return maxMembers; }
    public void setMaxMembers(Integer maxMembers) { this.maxMembers = maxMembers; }

    public GoalRoomVisibility getVisibility() { return visibility; }
    public void setVisibility(GoalRoomVisibility visibility) { this.visibility = visibility; }
}