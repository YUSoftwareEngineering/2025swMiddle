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

    // 22312281 이가인 추가 - 로그인 ID
    private String loginId;

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

    // 22312281 이가인 추가 - 레벨
    private Integer level;

    // 22312281 이가인 추가 - 경험치
    private Integer xp;

    // 프로필이 마지막으로 수정된 시각
    private LocalDateTime updatedAt;

    public ProfileData() {
    }

    public ProfileData(Long profileId,
                       Long userId,
                       String loginId,  // 22312281 이가인 추가
                       String nickname,
                       String avatarUrl,
                       String bio,
                       boolean profilePublic,
                       boolean activityPublic,
                       Long representativeCharacterId,
                       Integer level,  // 22312281 이가인 추가
                       Integer xp,     // 22312281 이가인 추가
                       LocalDateTime updatedAt) {
        this.profileId = profileId;
        this.userId = userId;
        this.loginId = loginId;  // 22312281 이가인 추가
        this.nickname = nickname;
        this.avatarUrl = avatarUrl;
        this.bio = bio;
        this.profilePublic = profilePublic;
        this.activityPublic = activityPublic;
        this.representativeCharacterId = representativeCharacterId;
        this.level = level;   // 22312281 이가인 추가
        this.xp = xp;         // 22312281 이가인 추가
        this.updatedAt = updatedAt;
    }

    public static ProfileData from(Profile profile) {
        return from(profile, null);
    }

    // 22312281 이가인 추가 - User 정보 포함 버전
    public static ProfileData from(Profile profile, String loginId) {
        return new ProfileData(
                profile.getProfileId(),
                profile.getUserId(),
                loginId,  // 22312281 이가인 추가
                profile.getNickname(),
                profile.getAvatarUrl(),
                profile.getBio(),
                profile.isProfilePublic(),
                profile.isActivityPublic(),
                profile.getRepresentativeCharacterId(),
                profile.getLevel(),  // 22312281 이가인 추가
                profile.getXp(),     // 22312281 이가인 추가
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

    // 22312281 이가인 추가 - 레벨 Getter
    public Integer getLevel() {
        return level;
    }

    // 22312281 이가인 추가 - 경험치 Getter
    public Integer getXp() {
        return xp;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}