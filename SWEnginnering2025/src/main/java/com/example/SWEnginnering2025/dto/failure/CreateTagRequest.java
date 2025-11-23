package com.example.SWEnginnering2025.dto.failure;

public class CreateTagRequest {

    private Long userId;
    private String name;

    public CreateTagRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setName(String name) {
        this.name = name;
    }
}
