/*
    Project: UserRepository.java
    Author: 윤혜원
	Date of creation: 2025.11.21
	Date of last update: 2025.11.22
*/

package com.example.SWEnginnering2025.repository;

import com.example.SWEnginnering2025.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 이메일로 조회
    Optional<User> findByEmail(String email);

    // 로그인 ID(userId)로 조회
    Optional<User> findByUserId(String userId);

    // 이메일 중복 확인
    boolean existsByEmail(String email);


    // 로그인 ID(userId) 중복 확인
    boolean existsByUserId(String userId);

    // 닉네임(name) 중복 확인
    boolean existsByName(String name);

    // OAuth2 사용자 조회
    Optional<User> findByProviderAndProviderId(String provider, String providerId);

}