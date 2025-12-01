/*
   Project:  MemberTodayStatusDto.java
   Author: 윤나영
  Date of creation: 2025.11.30
  Date of last update: 2025.11.30
*/
package com.example.SWEnginnering2025.dto.goalroom;

public class MemberTodayStatusDto {

    private Long userId;
    private String nickname;
    private int todayGoalCount;
    private int completedCount;
    private double achievementRate;

    public MemberTodayStatusDto() {}

    public MemberTodayStatusDto(Long userId, String nickname, int todayGoalCount,
                                int completedCount, double achievementRate) {
        this.userId = userId;
        this.nickname = nickname;
        this.todayGoalCount = todayGoalCount;
        this.completedCount = completedCount;
        this.achievementRate = achievementRate;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public int getTodayGoalCount() { return todayGoalCount; }
    public void setTodayGoalCount(int todayGoalCount) { this.todayGoalCount = todayGoalCount; }

    public int getCompletedCount() { return completedCount; }
    public void setCompletedCount(int completedCount) { this.completedCount = completedCount; }

    public double getAchievementRate() { return achievementRate; }
    public void setAchievementRate(double achievementRate) { this.achievementRate = achievementRate; }
}