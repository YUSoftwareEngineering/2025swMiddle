package com.example.SWEnginnering2025.dto.failure;

public class FailureTagDto {

    private Long id;
    private String name;
    private boolean builtIn;

    public FailureTagDto(Long id, String name, boolean builtIn) {
        this.id = id;
        this.name = name;
        this.builtIn = builtIn;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public boolean isBuiltIn() {
        return builtIn;
    }
}
