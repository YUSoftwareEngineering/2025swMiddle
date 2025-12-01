
/*
    Project: GoalRepository.java
    Author: 최은샘, 이채민
	Date of creation: 2025.11.23
	Date of last update: 2025.11.24
*/


package com.example.SWEnginnering2025.repository;

import com.example.SWEnginnering2025.model.Goal;  // Goal 엔티티 사용위해
import org.springframework.data.jpa.repository.JpaRepository; // 스프링 데이터 JPA가 제공하는 기본 Repository 인터페이스
                                                              // 이걸 상속시 save, findById, delete 같은 기본 CRUD 메서드를 자동으로 쓸 수 있음
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

// 인터페이스라서 구현 코드는 없고 “형태”만 정의
// Goal = Goal 엔티티용 레퍼지토리
// Long = 그 엔티티의 PK 타입 (Goal 의 id 타입)
public interface GoalRepository extends JpaRepository<Goal, Long> {

    // 스프링 데이터 JPA 가 메서드 이름을 해석해서 쿼리를 자동 생성


	// 유저ID, 날짜, 제목 3박자가 다 똑같은 게 있는지 확인
	boolean existsByUserIdAndTargetDateAndTitle(Long userId, LocalDate targetDate, String title);
    List<Goal> findAllByUserIdAndTargetDate(Long userId, LocalDate targetDate);

    // 주간 조회용: [startDate, endDate] 범위
    // 이 사용자(userId)의 목표 중에서, 날짜가 startDate 이상이고 endDate 이하인 것들을 전부 찾아서 리스트로 준다
    List<Goal> findByUserIdAndTargetDateBetween(Long userId,
                                                LocalDate startDate,
                                                LocalDate endDate);

    // 특정 하루에 대한 목표들 상세 조회용
    // 이 사용자(userId)의 목표 중에서, 날짜가 date 인 것만 전부 찾아와라
    List<Goal> findByUserIdAndTargetDate(Long userId, LocalDate targetDate);
}
