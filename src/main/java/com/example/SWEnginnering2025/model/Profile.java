/*
   Project: MonthlyCalendarDto.java
   Author: 윤나영
  Date of creation: 2025.11.27
  Date of last update: 2025.11.27
*/
package com.example.SWEnginnering2025.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;          // 프로필 고유 ID

    @Column(nullable = false)
    private Long userId;             // User 테이블의 PK (User.id)

    @Column(nullable = false, length = 10)
    private String nickname;         // 사용자 별명

    @Column(length = 255)
    private String avatarUrl;        // 프로필 사진 경로

    @Column(length = 500)
    private String bio;              // 자기소개

    @Column(nullable = false)
    private boolean profilePublic;   // 프로필 전체 공개 여부 (5-9, 10-2)

    @Column(nullable = false)
    private boolean activityPublic;  // 활동 상태 공개 여부 (5-10)

    @Column(nullable = false)
    private boolean bioPublic;

    @Column
    private Long representativeCharacterId; // 대표 캐릭터 ID (3-5, 5-5)

    // 22312281 이가인 추가 - 레벨 시스템
    @Column(nullable = false)
    private Integer level = 1; // 사용자 레벨 (기본값 1)

    // 22312281 이가인 추가 - 경험치 시스템
    @Column(nullable = false)
    private Integer xp = 0; // 경험치 (기본값 0)

    @Column(nullable = false)
    private LocalDateTime updatedAt; // 마지막 수정 시각

    // ----------- 기본 생성자 (JPA용) -----------
    public Profile() {
    }

    // ----------- 편의 생성자 -----------
    // 사용자 ID + 닉네임으로 기본 프로필 생성
    // 서비스에서 "기본(default) 프로필"을 만들 때 사용됨
    public Profile(Long userId, String nickname) {
        this.userId = userId;
        this.nickname = nickname;
        this.profilePublic = true; // 새 프로필은 기본적으로 공개 상태로 설정
        this.activityPublic = true;
        this.bioPublic = true;
        this.level = 1; // 22312281 이가인 추가 - 기본 레벨 1
        this.xp = 0; // 22312281 이가인 추가 - 기본 경험치 0
        this.updatedAt = LocalDateTime.now();// 생성 시점 기준 업데이트 시간 기록
    }

    // ----------- Getter / Setter -----------

    public Long getProfileId() {
        return profileId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
        touchUpdatedAt();
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
        touchUpdatedAt();
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
        touchUpdatedAt();
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
        touchUpdatedAt();
    }

    public boolean isProfilePublic() {
        return profilePublic;
    }

    public void setProfilePublic(boolean profilePublic) {
        this.profilePublic = profilePublic;
        touchUpdatedAt();
    }

    public boolean isActivityPublic() {
        return activityPublic;
    }

    public boolean isBioPublic() {
        return bioPublic;
    }

    public void setBioPublic(boolean bioPublic) {
        this.bioPublic = bioPublic;
        touchUpdatedAt();
    }


    public void setActivityPublic(boolean activityPublic) {
        this.activityPublic = activityPublic;
        touchUpdatedAt();
    }

    public Long getRepresentativeCharacterId() {
        return representativeCharacterId;
    }

    public void setRepresentativeCharacterId(Long representativeCharacterId) {
        this.representativeCharacterId = representativeCharacterId;
        touchUpdatedAt();
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // 22312281 이가인 추가 - 레벨 Getter/Setter
    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
        touchUpdatedAt();
    }

    // 22312281 이가인 추가 - 경험치 Getter/Setter
    public Integer getXp() {
        return xp;
    }

    public void setXp(Integer xp) {
        this.xp = xp;
        touchUpdatedAt();
    }

    // 22312281 이가인 추가 - 경험치 추가 메서드
    public void addXp(int amount) {
        this.xp += amount;
        // 레벨업 체크 (1000 XP당 1레벨)
        while (this.xp >= 1000) {
            this.xp -= 1000;
            this.level++;
        }
        touchUpdatedAt();
    }
    private void touchUpdatedAt() {
        this.updatedAt = LocalDateTime.now();
    }

    // [디버깅용 추가]
    @Override
    public String toString() {
        return "Profile{" +
                "profileId=" + profileId +
                ", userId=" + userId +
                ", nickname='" + nickname + '\'' +
                ", profilePublic=" + profilePublic +
                ", activityPublic=" + activityPublic +
                ", bioPublic=" + bioPublic +
                ", level=" + level +
                ", xp=" + xp +
                ", updatedAt=" + updatedAt +
                '}';
    }
}