/*
   Project:  GoalRoomListResponse.java
   Author: 윤나영
  Date of creation: 2025.11.30
  Date of last update: 2025.11.30
*/
package com.example.SWEnginnering2025.dto.goalroom;

import java.util.List;

public class GoalRoomListResponse {

    private List<GoalRoomSummaryDto> myRooms;
    private List<GoalRoomSummaryDto> publicRooms;

    public GoalRoomListResponse() {}

    public GoalRoomListResponse(List<GoalRoomSummaryDto> myRooms, List<GoalRoomSummaryDto> publicRooms) {
        this.myRooms = myRooms;
        this.publicRooms = publicRooms;
    }

    public List<GoalRoomSummaryDto> getMyRooms() { return myRooms; }
    public void setMyRooms(List<GoalRoomSummaryDto> myRooms) { this.myRooms = myRooms; }

    public List<GoalRoomSummaryDto> getPublicRooms() { return publicRooms; }
    public void setPublicRooms(List<GoalRoomSummaryDto> publicRooms) { this.publicRooms = publicRooms; }
}