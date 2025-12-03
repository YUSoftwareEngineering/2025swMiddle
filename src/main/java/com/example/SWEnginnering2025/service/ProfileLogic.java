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
// Profile 데이터를 DB에서 조회/저장하는 Repository
public class ProfileLogic {
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    // User 존재 여부 검증을 위해 사용하는 Repository
    public ProfileLogic(ProfileRepository profileRepository,
                        UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    /**
     * getMyProfile(userId)
     * 현재 사용자의 상세 프로필 조회
     */
    // 22312281 이가인 수정 - readOnly = true 제거 (프로필 없을 때 기본 프로필 생성 허용)
    @Transactional
    public ProfileData getMyProfile(Long userId) {
        // 1. 실제 존재하는 사용자 ID인지 검증
        User user = findUser(userId);

        // 2. 프로필 찾기 (없으면 기본 프로필 생성)
        Profile profile = profileRepository
                .findByUserId(userId)
                .orElseGet(() -> createDefaultProfile(user));

        return ProfileData.from(profile);
    }

    /**
     * getPublicProfile(targetId)
     * 다른 사용자의 '공개 프로필' 조회
     */
    @Transactional(readOnly = true)
    public ProfileSummary getPublicProfile(Long targetUserId) {
        findUser(targetUserId); // 대상 사용자가 실제 존재하는지 확인 (존재만 검증)

        Profile profile = profileRepository // 대상 사용자의 프로필 가져오기 (없으면 예외 발생)
                .findByUserId(targetUserId)
                .orElseThrow(() -> new ProfileNotFoundException("프로필이 존재하지 않습니다."));

        if (!profile.isProfilePublic()) { // 프로필이 비공개 상태이면 예외 발생
            throw new ProfilePrivateException("비공개 프로필입니다.");
        }

        return ProfileSummary.from(profile);// 공개가 허용된 프로필 DTO 형태로 반환
    }

    /**
     * updateProfile(userId, data)
     * - 입력 데이터 유효성 검사
     * - 기존 데이터와 동일하면 예외 발생
     * - 변경 내용이 있을 때만 DB 저장
     */
    public void updateProfile(Long userId, ProfileUpdate data) {
        validateUpdateData(data);// 1. 입력값 검증 (닉네임 길이, bio 길이

        User user = findUser(userId);// 2. 사용자 존재 여부 확인

        Profile profile = profileRepository// 3. 프로필 조회 (없으면 기본 프로필 생성)
                .findByUserId(userId)
                .orElseGet(() -> createDefaultProfile(user));

        boolean noChanges = isNoChanges(profile, data); // 2. 사용자 존재 여부 확인

        if (noChanges) {
            throw new NoProfileChangesException("변경된 내용이 없습니다.");
        }

        // 5. 변경된 항목만 반영
        if (data.getNickname() != null) {
            profile.setNickname(data.getNickname());
        }
        if (data.getAvatarUrl() != null) {
            profile.setAvatarUrl(data.getAvatarUrl());
        }
        if (data.getBio() != null) {
            profile.setBio(data.getBio());
        }
        if (data.getProfilePublic() != null) {
            profile.setProfilePublic(data.getProfilePublic());
            user.setProfileOpen(data.getProfilePublic());
        }
        if (data.getActivityPublic() != null) {
            profile.setActivityPublic(data.getActivityPublic());

        }
        if (data.getRepresentativeCharacterId() != null) {
            profile.setRepresentativeCharacterId(data.getRepresentativeCharacterId());
        }

        profile.setUpdatedAt(LocalDateTime.now());// 마지막 업데이트 시간 갱신
        profileRepository.upsert(profile);// 변경 사항을 upsert 방식(존재하면 update, 없으면 insert)으로 저장
    }

    /**
     * updatePrivacySettings(userId, settings)
     * 프로필 공개 범위, 활동 공개 여부만 따로 수정
     * @return 실제 변경이 있었는지 여부
     */
    public boolean updatePrivacySettings(Long userId, PrivacyData settings) {
        User user = findUser(userId);

        Profile profile = profileRepository
                .findByUserId(user.getId())
                .orElseGet(() -> createDefaultProfile(user));

        boolean noChanges = // 3. 기존 값과 완전히 동일하면 변경 필요 없음 → false 반환
                profile.isProfilePublic() == settings.isProfilePublic()
                        && profile.isActivityPublic() == settings.isActivityPublic();

        if (noChanges) {
            return false; // 변경 없음
        }

        profile.setProfilePublic(settings.isProfilePublic());
        profile.setActivityPublic(settings.isActivityPublic());
        profile.setUpdatedAt(LocalDateTime.now());

        user.setProfileOpen(settings.isProfilePublic());

        profileRepository.upsert(profile);// 5. 저장
        return true;
    }

    // ---------- 내부 유틸 메서드들 ----------

    private User findUser(Long userId) {// 사용자 존재 여부 확인하는 메서드
        Optional<User> optional = userRepository.findById(userId);
        // 존재하지 않으면 예외
        if (!optional.isPresent()) {
            throw new InvalidProfileDataException("존재하지 않는 사용자입니다.");
        }
        return optional.get();
    }
    // 프로필이 존재하지 않을 경우 기본 프로필 생성하는 메서드
    private Profile createDefaultProfile(User user) {
        Profile profile = new Profile(user.getId(), user.getName());// 사용자 ID, 이름 기반 기본 프로필 생성
        profile.setUpdatedAt(LocalDateTime.now()); // 생성 시점의 시간 저장
        return profileRepository.save(profile);// DB에 저장한 뒤 반환
    }
    // updateProfile()에서 입력 검증 로직
    private void validateUpdateData(ProfileUpdate data) {
        if (data.getNickname() != null && data.getNickname().length() > 10) {
            throw new InvalidProfileDataException("닉네임은 10자 이하여야 합니다.");
        }
        if (data.getAvatarUrl() != null && data.getAvatarUrl().length() > 255) {
            throw new InvalidProfileDataException("아바타 URL 길이가 너무 깁니다.");
        }
        if (data.getBio() != null && data.getBio().length() > 500) {
            throw new InvalidProfileDataException("자기소개는 500자 이하여야 합니다.");
        }
    }
    // 기존 데이터와 입력된 데이터가 동일한지 체크 → 변경이 하나도 없으면 true
    private boolean isNoChanges(Profile profile, ProfileUpdate data) {
        boolean nicknameSame =// 닉네임 비교 (입력 null이면 비교 제외)
                data.getNickname() == null
                        || Objects.equals(data.getNickname(), profile.getNickname());
        boolean avatarSame =// 아바타 URL 비교
                data.getAvatarUrl() == null
                        || Objects.equals(data.getAvatarUrl(), profile.getAvatarUrl());
        boolean bioSame = // 자기소개 글 비교
                data.getBio() == null
                        || Objects.equals(data.getBio(), profile.getBio());
        boolean profilePublicSame =// 프로필 공개 여부 비교
                data.getProfilePublic() == null
                        || data.getProfilePublic() == profile.isProfilePublic();
        boolean activityPublicSame =// 활동 공개 여부 비교
                data.getActivityPublic() == null
                        || data.getActivityPublic() == profile.isActivityPublic();
        boolean characterSame =// 대표 캐릭터 ID 비교
                data.getRepresentativeCharacterId() == null
                        || Objects.equals(data.getRepresentativeCharacterId(),
                        profile.getRepresentativeCharacterId());

        return nicknameSame && avatarSame && bioSame // 하나라도 다르면 변경됨 → false
                && profilePublicSame && activityPublicSame && characterSame;
    }



}