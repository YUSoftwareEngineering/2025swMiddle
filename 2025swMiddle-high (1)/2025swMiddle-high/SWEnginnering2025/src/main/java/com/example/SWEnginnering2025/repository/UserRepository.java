/*
    Project: UserRepository.java
    Author: YHW
    Date of creation: 2025.11.21
    Date of last update: 2025.11.27
*/

package com.example.SWEnginnering2025.repository;

import com.example.SWEnginnering2025.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 이메일로 조회
    Optional<User> findByEmail(String email);

    // 로그인 ID(userId)로 조회
    Optional<User> findByUserId(String userId);

    // 이메일 중복 확인
    boolean existsByEmail(String email);

    // 닉네임(name) 중복 확인
    boolean existsByName(String name);

    // 로그인 ID(userId) 중복 확인
    boolean existsByUserId(String userId);

    // OAuth2 사용자 조회
    Optional<User> findByProviderAndProviderId(String provider, String providerId);

    // 닉네임 또는 로그인 ID에 키워드가 포함되는 사용자 검색
    List<User> findByNameContainingIgnoreCaseOrUserIdContainingIgnoreCase(String nameKeyword, String userIdKeyword);

}