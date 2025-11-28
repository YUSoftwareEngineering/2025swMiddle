/*
   Project: MonthlyCalendarDto.java
   Author: 윤나영
  Date of creation: 2025.11.27
  Date of last update: 2025.11.27
*/
package com.example.SWEnginnering2025.dto;
import com.example.SWEnginnering2025.model.Profile;
// 다른 사용자의 공개 프로필 정보를 반환할 때 사용하는 DTO.
public class ProfileSummary {

    private Long userId; // 사용자 ID (프로필의 소유자)
    private String nickname;// 사용자 닉네임
    private String avatarUrl;// 프로필 이미지 URL
    private String bio;// 자기소개 글
    private Long representativeCharacterId; // 대표 캐릭터 ID

    public ProfileSummary() {
    }

    public ProfileSummary(Long userId,
                          String nickname,
                          String avatarUrl,
                          String bio,
                          Long representativeCharacterId) {
        this.userId = userId;
        this.nickname = nickname;
        this.avatarUrl = avatarUrl;
        this.bio = bio;
        this.representativeCharacterId = representativeCharacterId;
    }

    // Profile 엔티티의 전체 정보를 모두 포함하지 않고,
    // 공개 가능한 필드만 뽑아서 제공한다.
    public static ProfileSummary from(Profile profile) {
        return new ProfileSummary(
                profile.getUserId(),
                profile.getNickname(),
                profile.getAvatarUrl(),
                profile.getBio(),
                profile.getRepresentativeCharacterId()
        );
    }
    // ------------ Getter (읽기 전용 DTO) ------------
    // 사용자 ID 반환
    public Long getUserId() {
        return userId;
    }
    // 닉네임 반환
    public String getNickname() {
        return nickname;
    }
    // 아바타 이미지 URL 반환
    public String getAvatarUrl() {
        return avatarUrl;
    }
    // 자기소개 반환
    public String getBio() {
        return bio;
    }
    // 대표 캐릭터 ID 반환
    public Long getRepresentativeCharacterId() {
        return representativeCharacterId;
    }
}