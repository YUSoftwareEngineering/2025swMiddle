/*
   Project: MonthlyCalendarDto.java
   Author: 윤나영
  Date of creation: 2025.11.27
  Date of last update: 2025.11.27
*/
package com.example.SWEnginnering2025.dto;

// 프로필 공개 설정(privacy settings)을 전달하기 위한 DTO.
public class PrivacyData {
    private boolean profilePublic;// 프로필 전체 공개 여부 (true = 공개, false = 비공개)
    private boolean activityPublic;// 활동 공개 여부 (true = 공개, false = 비공개)

    public PrivacyData() {
    }

    public PrivacyData(boolean profilePublic, boolean activityPublic) {
        this.profilePublic = profilePublic;
        this.activityPublic = activityPublic;
    }

    public boolean isProfilePublic() {
        return profilePublic;
    }

    public void setProfilePublic(boolean profilePublic) {
        this.profilePublic = profilePublic;
    }

    public boolean isActivityPublic() {
        return activityPublic;
    }

    public void setActivityPublic(boolean activityPublic) {
        this.activityPublic = activityPublic;
    }
}
