package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.dto.gemini.GeminiRequest;
import com.example.SWEnginnering2025.dto.gemini.GeminiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api-url}")
    private String apiUrl;

    @Value("${gemini.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public String chat(String prompt) {
        // 1. 요청 데이터 생성
        GeminiRequest request = new GeminiRequest(prompt);

        // [수정] 사용자님 목록에 있는 'gemini-2.5-flash' 모델을 사용합니다!
        String requestUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        System.out.println("👉 요청 URL: " + requestUrl); // (로그 확인용)

        try {
            // 2. API 호출
            GeminiResponse response = restTemplate.postForObject(requestUrl, request, GeminiResponse.class);

            // 3. 응답 파싱
            if (response != null && response.getCandidates() != null && !response.getCandidates().isEmpty()) {
                return response.getCandidates().get(0).getContent().getParts().get(0).getText();
            }
            return "Gemini 응답 없음";
        } catch (Exception e) {
            return "Gemini 호출 오류: " + e.getMessage();
        }
    }
}