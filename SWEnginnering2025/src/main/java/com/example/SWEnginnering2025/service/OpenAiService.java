package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.dto.openai.ChatRequest;
import com.example.SWEnginnering2025.dto.openai.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class OpenAiService {

    @Value("${openai.model}")
    private String model;

    @Value("${openai.api-url}")
    private String apiUrl;

    @Value("${openai.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public String chat(String prompt) {
        // 1. 요청 상자 만들기
        ChatRequest request = new ChatRequest(model, prompt);

        // 2. 헤더 설정 (여기가 중요!)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON); // "나 JSON 보낸다!"
        headers.set("Authorization", "Bearer " + apiKey);   // "내 키는 이거야!"

        // 3. 편지 봉투에 담기 (헤더 + 내용)
        HttpEntity<ChatRequest> entity = new HttpEntity<>(request, headers);

        // 4. 전송 및 응답 받기
        try {
            ResponseEntity<ChatResponse> response = restTemplate.postForEntity(apiUrl, entity, ChatResponse.class);

            if (response.getBody() == null || response.getBody().getChoices() == null || response.getBody().getChoices().isEmpty()) {
                return "AI 응답이 비어있습니다.";
            }
            return response.getBody().getChoices().get(0).getMessage().getContent();
        } catch (Exception e) {
            return "AI 요청 실패: " + e.getMessage();
        }
    }
}