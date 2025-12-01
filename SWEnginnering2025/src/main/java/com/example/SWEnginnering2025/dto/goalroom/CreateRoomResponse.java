/*
   Project: CreateRoomResponse.java
   Author: 윤나영
  Date of creation: 2025.11.30
  Date of last update: 2025.11.30
*/

package com.example.SWEnginnering2025.dto.goalroom;


public class CreateRoomResponse {

    private Long roomId;

    public CreateRoomResponse() {}

    public CreateRoomResponse(Long roomId) {
        this.roomId = roomId;
    }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }
}