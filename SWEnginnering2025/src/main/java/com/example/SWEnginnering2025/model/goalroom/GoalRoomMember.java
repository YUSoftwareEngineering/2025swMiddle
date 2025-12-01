/*
   Project:GoalRoomMember.java
   Author: 윤나영
  Date of creation: 2025.11.30
  Date of last update: 2025.11.30
*/
package com.example.SWEnginnering2025.model.goalroom;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "goal_room_member",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_room_user",
                        columnNames = {"room_id", "user_id"})
        }
)
public class GoalRoomMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Room FK
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private GoalRoom goalRoom;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    private GoalRoomMemberRole role;

    private LocalDateTime joinedAt;

    public GoalRoomMember() {}

    public GoalRoomMember(Long id, GoalRoom goalRoom, Long userId,
                          GoalRoomMemberRole role, LocalDateTime joinedAt) {
        this.id = id;
        this.goalRoom = goalRoom;
        this.userId = userId;
        this.role = role;
        this.joinedAt = joinedAt;
    }

    @PrePersist
    public void onJoin() {
        this.joinedAt = LocalDateTime.now();
    }

    // ------------- Getters & Setters ----------------
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public GoalRoom getGoalRoom() { return goalRoom; }
    public void setGoalRoom(GoalRoom goalRoom) { this.goalRoom = goalRoom; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public GoalRoomMemberRole getRole() { return role; }
    public void setRole(GoalRoomMemberRole role) { this.role = role; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
}
