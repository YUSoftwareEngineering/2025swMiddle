package com.example.todo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity // 이 클래스가 데이터베이스의 테이블을 나타낸다는 것을 알려줍니다.
public class Todo {
    @Id // 이 필드가 고유 번호임을 나타냅니다.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 번호를 자동으로 생성하도록 설정합니다.
    private Long id; // 고유 번호 (예: 1, 2, 3...)
    private String task; // 할 일의 내용 (예: "장보기")
    private boolean completed; // 완료 여부 (true: 완료, false: 미완료)

    // 아래는 이 상자(Todo)에서 정보를 꺼내고 넣는 방법입니다.

    // 고유 번호를 가져오는 메서드
    public Long getId() {
        return id; // 상자에서 번호를 꺼내줍니다.
    }

    // 고유 번호를 설정하는 메서드
    public void setId(Long id) {
        this.id = id; // 상자에 번호를 넣어줍니다.
    }

    // 할 일 내용을 가져오는 메서드
    public String getTask() {
        return task; // 상자에서 할 일 내용을 꺼내줍니다.
    }

    // 할 일 내용을 설정하는 메서드
    public void setTask(String task) {
        this.task = task; // 상자에 할 일 내용을 넣어줍니다.
    }

    // 완료 여부를 가져오는 메서드
    public boolean isCompleted() {
        return completed; // 상자에서 완료 여부를 꺼내줍니다.
    }

    // 완료 여부를 설정하는 메서드
    public void setCompleted(boolean completed) {
        this.completed = completed; // 상자에 완료 여부를 넣어줍니다.
    }
}