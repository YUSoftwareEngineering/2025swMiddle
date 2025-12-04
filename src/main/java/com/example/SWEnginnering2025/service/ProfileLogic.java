/*
   Project: MonthlyCalendarDto.java
   Author: 윤나영
  Date of creation: 2025.11.27
  Date of last update: 2025.11.27
*/
package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.dto.*;
import com.example.SWEnginnering2025.exception.profile.*;
import com.example.SWEnginnering2025.model.Profile;
import com.example.SWEnginnering2025.model.User;
import com.example.SWEnginnering2025.repository.ProfileRepository;
import com.example.SWEnginnering2025.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

@Service
@Transactional
public class ProfileLogic {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileLogic(ProfileRepository profileRepository,
                        UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    /**
     * getMyProfile(userId)
     */
    @Transactional
    public ProfileData getMyProfile(Long userId) {
        User user = findUser(userId);
        Profile profile = profileRepository
                .findByUserId(userId)
                .orElseGet(() -> createDefaultProfile(user));

        return ProfileData.from(profile);
    }

    /**
     * getPublicProfile(targetId)
     */
    @Transactional(readOnly = true)
    public ProfileSummary getPublicProfile(Long targetUserId) {
        findUser(targetUserId);

        Profile profile = profileRepository
                .findByUserId(targetUserId)
                .orElseThrow(() -> new ProfileNotFoundException("프로필이 존재하지 않습니다."));

        if (!profile.isProfilePublic()) {
            throw new ProfilePrivateException("비공개 프로필입니다.");
        }

        return ProfileSummary.from(profile);
    }

    /**
     * updateProfile(userId, data)
     */
    public void updateProfile(Long userId, ProfileUpdate data) {
        validateUpdateData(data);

        User user = findUser(userId);
        Profile profile = profileRepository
                .findByUserId(userId)
                .orElseGet(() -> createDefaultProfile(user));

        System.out.println("[DEBUG] DB Profile: " + profile);
        System.out.println("[DEBUG] DTO Update: " + data);

        boolean noChanges = isNoChanges(profile, data);
        System.out.println("[DEBUG] isNoChanges Result: " + noChanges);

        if (noChanges) {
            throw new NoProfileChangesException("변경된 내용이 없습니다.");
        }

        // 변경된 항목만 반영
        if (data.getNickname() != null) profile.setNickname(data.getNickname());
        if (data.getAvatarUrl() != null) profile.setAvatarUrl(data.getAvatarUrl());
        if (data.getBio() != null) profile.setBio(data.getBio());

        if (data.getProfilePublic() != null) {
            profile.setProfilePublic(data.getProfilePublic());
            user.setProfileOpen(data.getProfilePublic());  // YHW2 기준 유지
        }

        if (data.getActivityPublic() != null) {
            profile.setActivityPublic(data.getActivityPublic());
        }

        if (data.getRepresentativeCharacterId() != null) {
            profile.setRepresentativeCharacterId(data.getRepresentativeCharacterId());
        }

        profile.setUpdatedAt(LocalDateTime.now());
        profileRepository.upsert(profile);
    }

    /**
     * updatePrivacySettings(userId, settings)
     */
    public boolean updatePrivacySettings(Long userId, PrivacyData settings) {
        User user = findUser(userId);

        Profile profile = profileRepository
                .findByUserId(userId)
                .orElseGet(() -> createDefaultProfile(user));

        boolean noChanges =
                profile.isProfilePublic() == settings.isProfilePublic()
                        && profile.isActivityPublic() == settings.isActivityPublic();

        if (noChanges) return false;

        profile.setProfilePublic(settings.isProfilePublic());
        profile.setActivityPublic(settings.isActivityPublic());
        profile.setUpdatedAt(LocalDateTime.now());

        // 최신 버전: user.profileOpen 업데이트 포함
        user.setProfileOpen(settings.isProfilePublic());

        profileRepository.upsert(profile);
        return true;
    }

    // -------- 내부 유틸 메서드 --------

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new InvalidProfileDataException("존재하지 않는 사용자입니다."));
    }

    private Profile createDefaultProfile(User user) {
        Profile profile = new Profile(user.getId(), user.getName());
        profile.setUpdatedAt(LocalDateTime.now());
        return profileRepository.save(profile);
    }

    private void validateUpdateData(ProfileUpdate data) {
        if (data.getNickname() != null && data.getNickname().length() > 10)
            throw new InvalidProfileDataException("닉네임은 10자 이하여야 합니다.");
        if (data.getAvatarUrl() != null && data.getAvatarUrl().length() > 255)
            throw new InvalidProfileDataException("아바타 URL 길이가 너무 깁니다.");
        if (data.getBio() != null && data.getBio().length() > 500)
            throw new InvalidProfileDataException("자기소개는 500자 이하여야 합니다.");
    }

    private boolean isNoChanges(Profile profile, ProfileUpdate data) {
        boolean nicknameSame =
                data.getNickname() == null
                        || Objects.equals(data.getNickname(), profile.getNickname());

        boolean avatarSame =
                data.getAvatarUrl() == null
                        || Objects.equals(data.getAvatarUrl(), profile.getAvatarUrl());

        boolean bioSame =
                data.getBio() == null
                        || Objects.equals(data.getBio(), profile.getBio());

        boolean characterSame =
                data.getRepresentativeCharacterId() == null
                        || Objects.equals(data.getRepresentativeCharacterId(),
                        profile.getRepresentativeCharacterId());

        boolean profilePublicSame =
                data.getProfilePublic() == null
                        || Objects.equals(data.getProfilePublic(), profile.isProfilePublic());

        boolean activityPublicSame =
                data.getActivityPublic() == null
                        || Objects.equals(data.getActivityPublic(), profile.isActivityPublic());

        System.out.println("[DEBUG-COMP] Nickname Same: " + nicknameSame);
        System.out.println("[DEBUG-COMP] AvatarUrl Same: " + avatarSame);
        System.out.println("[DEBUG-COMP] Bio Same: " + bioSame);
        System.out.println("[DEBUG-COMP] ProfilePublic Same: " + profilePublicSame);
        System.out.println("[DEBUG-COMP] ActivityPublic Same: " + activityPublicSame);
        System.out.println("[DEBUG-COMP] CharacterId Same: " + characterSame);

        return nicknameSame && avatarSame && bioSame
                && profilePublicSame && activityPublicSame && characterSame;
    }
}
