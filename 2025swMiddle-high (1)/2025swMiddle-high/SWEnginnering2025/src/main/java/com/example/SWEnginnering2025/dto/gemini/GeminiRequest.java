package com.example.SWEnginnering2025.dto.gemini;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.Collections;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GeminiRequest {
    private List<Content> contents;

    public GeminiRequest(String text) {
        this.contents = Collections.singletonList(new Content(new Part(text)));
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Content {
        private List<Part> parts;

        public Content(Part part) {
            this.parts = Collections.singletonList(part);
        }
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Part {
        private String text;
    }
}