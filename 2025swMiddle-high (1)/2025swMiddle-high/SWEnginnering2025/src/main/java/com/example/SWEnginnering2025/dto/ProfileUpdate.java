/*
   Project: MonthlyCalendarDto.java
   Author: 윤나영
  Date of creation: 2025.11.27
  Date of last update: 2025.11.27
*/
package com.example.SWEnginnering2025.dto;
// 프로필 업데이트 요청을 받을 때 사용하는 DTO(Data Transfer Object)
// 클라이언트가 보낸 변경값들만 담으며,
// null 값은 "해당 항목은 변경하지 않겠다"는 의미로 처리된다.
public class ProfileUpdate {
    private String nickname; // 수정할 닉네임 (null이면 변경 없음)
    private String avatarUrl;// 수정할 프로필 이미지 URL (null이면 변경 없음)
    private String bio;// 수정할 자기소개 (null이면 변경 없음)
    private Boolean profilePublic;   // 프로필 전체 공개 여부 null 이면 변경 안 함
    private Boolean activityPublic;  // 활동 공개 여부 (회원 활동 표시 여부)  null 이면 변경 안 함
    private Long representativeCharacterId; // 대표 캐릭터 ID null이면 캐릭터 변경하지 않음
    //------생성자--------//
    public ProfileUpdate() {
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    } // 아바타 URL 변경 요청

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }// 자기소개 변경 요청

    public Boolean getProfilePublic() {
        return profilePublic;
    }

    public void setProfilePublic(Boolean profilePublic) {
        this.profilePublic = profilePublic;
    } // 프로필 공개 여부 설정

    public Boolean getActivityPublic() {
        return activityPublic;
    }

    public void setActivityPublic(Boolean activityPublic) {
        this.activityPublic = activityPublic;
    }   // 활동 공개 여부 설정

    public Long getRepresentativeCharacterId() {
        return representativeCharacterId;
    }

    public void setRepresentativeCharacterId(Long representativeCharacterId) {
        this.representativeCharacterId = representativeCharacterId;
    } //대표 캐릭터 ID 설정
}
