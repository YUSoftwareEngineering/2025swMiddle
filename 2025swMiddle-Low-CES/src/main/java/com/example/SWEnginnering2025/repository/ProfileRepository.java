/*
   Project: MonthlyCalendarDto.java
   Author: 윤나영
  Date of creation: 2025.11.27
  Date of last update: 2025.11.27
*/
package com.example.SWEnginnering2025.repository;
import com.example.SWEnginnering2025.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
// Profile 엔티티를 DB와 연결하기 위한 Repository 인터페이스
@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    // userId로 프로필 조회
    Optional<Profile> findByUserId(Long userId);


    default void upsert(Profile profile) {
        save(profile);
    }
}