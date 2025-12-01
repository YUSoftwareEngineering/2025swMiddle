/*
   Project:  GoalRoomSummaryDto.java
   Author: 윤나영
  Date of creation: 2025.11.30
  Date of last update: 2025.11.30
*/
package com.example.SWEnginnering2025.dto.goalroom;

import com.example.SWEnginnering2025.model.goalroom.GoalRoomVisibility;

public class GoalRoomSummaryDto {

    private Long id;
    private String roomName;
    private String goal;
    private GoalRoomVisibility visibility;
    private int currentMembers;
    private int maxMembers;
    private Long ownerId;

    public GoalRoomSummaryDto() {}

    public GoalRoomSummaryDto(Long id, String roomName, String goal,
                              GoalRoomVisibility visibility, int currentMembers,
                              int maxMembers, Long ownerId) {
        this.id = id;
        this.roomName = roomName;
        this.goal = goal;
        this.visibility = visibility;
        this.currentMembers = currentMembers;
        this.maxMembers = maxMembers;
        this.ownerId = ownerId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }

    public GoalRoomVisibility getVisibility() { return visibility; }
    public void setVisibility(GoalRoomVisibility visibility) { this.visibility = visibility; }

    public int getCurrentMembers() { return currentMembers; }
    public void setCurrentMembers(int currentMembers) { this.currentMembers = currentMembers; }

    public int getMaxMembers() { return maxMembers; }
    public void setMaxMembers(int maxMembers) { this.maxMembers = maxMembers; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
}
