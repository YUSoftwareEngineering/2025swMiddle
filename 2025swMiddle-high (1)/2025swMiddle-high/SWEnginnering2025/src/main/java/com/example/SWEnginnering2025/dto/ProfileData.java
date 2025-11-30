/*
   Project: MonthlyCalendarDto.java
   Author: 윤나영
  Date of creation: 2025.11.27
  Date of last update: 2025.11.27
*/
package com.example.SWEnginnering2025.dto;
import com.example.SWEnginnering2025.model.Profile;
import java.time.LocalDateTime;
// 내 프로필(my profile)을 조회할 때 사용하는 DTO.
// ProfileSummary가 "공개된 다른 사람 프로필 요약"이라면,
// ProfileData는 로그인한 사용자가 자신의 전체 프로필 정보를 조회할 때 반환되는 풀(full) 데이터 구조.
//
public class ProfileData {

    // 프로필 PK (고유 ID)
    private Long profileId;

    // 사용자 ID (프로필 소유자)
    private Long userId;

    // 사용자 닉네임
    private String nickname;

    // 프로필 이미지 URL
    private String avatarUrl;

    // 자기소개 문구
    private String bio;

    // 프로필 전체 공개 여부
    private boolean profilePublic;

    // 활동 공개 여부
    private boolean activityPublic;

    // 대표 캐릭터 ID
    private Long representativeCharacterId;

    // 프로필이 마지막으로 수정된 시각
    private LocalDateTime updatedAt;

    public ProfileData() {
    }

    public ProfileData(Long profileId,
                       Long userId,
                       String nickname,
                       String avatarUrl,
                       String bio,
                       boolean profilePublic,
                       boolean activityPublic,
                       Long representativeCharacterId,
                       LocalDateTime updatedAt) {
        this.profileId = profileId;
        this.userId = userId;
        this.nickname = nickname;
        this.avatarUrl = avatarUrl;
        this.bio = bio;
        this.profilePublic = profilePublic;
        this.activityPublic = activityPublic;
        this.representativeCharacterId = representativeCharacterId;
        this.updatedAt = updatedAt;
    }

    public static ProfileData from(Profile profile) {
        return new ProfileData(
                profile.getProfileId(),
                profile.getUserId(),
                profile.getNickname(),
                profile.getAvatarUrl(),
                profile.getBio(),
                profile.isProfilePublic(),
                profile.isActivityPublic(),
                profile.getRepresentativeCharacterId(),
                profile.getUpdatedAt()
        );
    }

    public Long getProfileId() {
        return profileId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getNickname() {
        return nickname;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public String getBio() {
        return bio;
    }

    public boolean isProfilePublic() {
        return profilePublic;
    }

    public boolean isActivityPublic() {
        return activityPublic;
    }

    public Long getRepresentativeCharacterId() {
        return representativeCharacterId;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}