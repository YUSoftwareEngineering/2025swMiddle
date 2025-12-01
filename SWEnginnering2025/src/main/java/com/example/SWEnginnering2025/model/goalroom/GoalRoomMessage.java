/*
   Project:GoalRoomMessage.java
   Author: 윤나영
  Date of creation: 2025.11.30
  Date of last update: 2025.11.30
*/
package com.example.SWEnginnering2025.model.goalroom;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "goal_room_message")
public class GoalRoomMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private GoalRoom goalRoom;

    private Long senderId;

    @Column(length = 1000)
    private String content;

    private LocalDateTime createdAt;

    public GoalRoomMessage() {}

    public GoalRoomMessage(Long id, GoalRoom goalRoom, Long senderId, String content, LocalDateTime createdAt) {
        this.id = id;
        this.goalRoom = goalRoom;
        this.senderId = senderId;
        this.content = content;
        this.createdAt = createdAt;
    }

    @PrePersist
    public void onSend() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public GoalRoom getGoalRoom() { return goalRoom; }
    public void setGoalRoom(GoalRoom goalRoom) { this.goalRoom = goalRoom; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
