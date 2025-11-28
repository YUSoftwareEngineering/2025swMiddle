/*
    Project: Goal.java
    Author: 최은샘, 이채민
	Date of creation: 2025.11.23
	Date of last update: 2025.11.24
*/

package com.example.SWEnginnering2025.model;

import jakarta.persistence.*;  // JPA 관련 어노테이션을 사용하기 위해 import.
import java.time.LocalDate;   // 날짜(년/월/일)를 표현하는 자바 타입
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalTime;


@Entity  // 이 클래스가 JPA 엔티티, 즉 DB 테이블과 연결되는 클래스
@Table(name = "goals")  // 이 엔티티가 DB의 goals라는 테이블과 연결된다고 지정
@Getter
@NoArgsConstructor      // ★ JPA용
public class Goal { // 사용자의 하루 목표 한 개를 나타냄

    @Id // 이 필드가 데이블의 기본 키
    @GeneratedValue(strategy = GenerationType.IDENTITY) // IDENTITY 전략은 id값을 DB가 자동으로 증가시키면서 생성후 각 goal마다 값을 지정해줌
    private Long id;  // 각 목표를 구분하는 고유 번호

    // User 엔티티와의 연관관계 대신, 우선 User의 PK(id)를 직접 저장한다.
   // (User.userId는 로그인용 문자열이고, 여기의 userId는 User 테이블의 id 컬럼과 매핑되는 숫자 PK이다)
    @Column(nullable = false)
    private Long userId;  //  이 목표가 어떤 user의 것인지 나타내는 식별자

    // 이 목표를 수행해야 하는 날짜 (캘린더의 날짜)
    @Column(nullable = false)
    private LocalDate targetDate;  // "연-월-일" 만 저장

    @Column(nullable = false, length = 100)
    private String title;       // 목표의 제목 (예: "영어 공부 30분")

    @Column(columnDefinition = "TEXT")
    private String description; // 목표에 대한 설명/메모 (예: "듀오링고 + 뉴스 읽기")

    @Enumerated(EnumType.STRING) // 이 필드가 enum 타입, EnumType.STRING 이라서 DB에 "DONE", "FAILED" 같은 문자열로 저장됨
    private GoalStatus status;  // 목표의 현재 상태로 GoalStatus enum에 정의된 값 중 하나를 가질 수 있음. (NOT_STARTED, PARTIAL, DONE, FAILED)
    private String statusMemo;
    private String proofUrl;

    @Enumerated(EnumType.STRING) // DB에 "EXERCISE" 글자로 저장됨
    private GoalCategory category;

    private boolean isNotificationEnabled; // 알림 여부

    private LocalTime scheduledTime; // 예정 시간

    private LocalDateTime createdAt; //  생성 시각
    private LocalDateTime updatedAt; // 수정 시각

    private boolean notificationEnabled;

    @Builder // 빌더 패턴으로 객체 생성을 쉽게 함
    public Goal(Long userId, String title, String description, LocalDate targetDate,
                GoalCategory category, boolean isNotificationEnabled, LocalTime scheduledTime) {
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.targetDate = targetDate;
        this.category = category;
        this.isNotificationEnabled = isNotificationEnabled;
        this.scheduledTime = scheduledTime;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = GoalStatus.PENDING;
        this.notificationEnabled = false;
    }

    // 비즈니스 로직: 목표 수정 기능 (Setter 대신 사용)
    public void update(String title, String description, LocalDate targetDate,
                       GoalCategory category, boolean isNotificationEnabled, LocalTime scheduledTime) {
        this.title = title;
        this.description = description;
        this.targetDate = targetDate;
        this.category = category;
        this.isNotificationEnabled = isNotificationEnabled;
        this.scheduledTime = scheduledTime;
        this.updatedAt = LocalDateTime.now();
    }

    // 비즈니스 로직: 완료 상태 토글
    public void changeStatus(GoalStatus status, String statusMemo, String proofUrl) {
        this.status = status;
        this.statusMemo = statusMemo;
        this.proofUrl = proofUrl;
        this.updatedAt = LocalDateTime.now(); // 변경 시간 기록 (선택)
    }

    public void update(String title,
                       String description,
                       GoalCategory category,
                       LocalDate targetDate,
                       boolean notificationEnabled,
                       LocalTime scheduledTime) {

        this.title = title;
        this.description = description;
        this.category = category;
        this.targetDate = targetDate;
        this.notificationEnabled = notificationEnabled;
        this.scheduledTime = scheduledTime;
    }

    // ---- getter / setter ----
    public Long getId() { return id; }  // id 값을 읽는 메서드 (외부에서 goal.getId()로 사용시 DB에 저장된 고유 번호를 알 수 있음)

    public Long getUserId() { return userId; } // 이 목표가 어느 사용자의 것인지 읽어오는 메서드
    public void setUserId(Long userId) { this.userId = userId; } // 이 목표를 어느 사용자에게 속하게 할지 설정하는 메서드 (this.userId = 필드, 오른쪽 userId = 매개변수)

    // 목표 날짜를 읽고/바꾸는 메서드
    public LocalDate getTargetDate() { return targetDate; } // 목표를 수행할 날짜를 읽음
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; } // 이 목표를 언제 할지 날짜를 지정

    // 목표 제목을 읽고/바꾸는 메서드
    public String getTitle() { return title; } // 목표 제목(예: "영어 공부 30분")을 가져옴
    public void setTitle(String title) { this.title = title; } // 제목을 설정

    // 목표 설명을 읽고/바꾸는 메서드
    public String getDescription() { return description; }  // 목표 설명을 읽어옴
    public void setDescription(String description) { this.description = description; } // 목표 설명을 설정

    //목표 상태(NOT_STARTED, DONE 등)를 읽고/바꾸는 메서드
    // (예: 사용자가 “완료” 버튼을 누르면 goal.setStatus(GoalStatus.DONE); 같은 식으로 바꿈
    public GoalStatus getStatus() { return status; } // 현재 상태(NOT_STARTED, DONE 등)를 읽어옴
    public void setStatus(GoalStatus status) { this.status = status; } // 상태를 변경

    public String getStatusMemo() {
        return statusMemo;
    }
    public void setStatusMemo(String statusMemo) {
        this.statusMemo = statusMemo;
    }

    public String getProofUrl() {
        return proofUrl;
    }
    public void setProofUrl(String proofUrl) {
        this.proofUrl = proofUrl;
    }

    public GoalCategory getCategory() {
        return category;
    }
    public void setCategory(GoalCategory category) {
        this.category = category;
    }

    public boolean isNotificationEnabled() {
        return isNotificationEnabled;
    }
    public void setNotificationEnabled(boolean notificationEnabled) {
        isNotificationEnabled = notificationEnabled;
    }

    public LocalTime getScheduledTime() {
        return scheduledTime;
    }
    public void setScheduledTime(LocalTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

}

