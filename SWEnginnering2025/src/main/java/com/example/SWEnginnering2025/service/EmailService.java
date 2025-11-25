/*
    Project: EmailService.java
    Author: YHW
    Date of creation: 2025.11.25
    Date of last update: 2025.11.25
*/

package com.example.SWEnginnering2025.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    // 이메일 전송
    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    // 비밀번호 재설정 이메일 내용 생성 및 전송
    public void sendPasswordResetEmail(String userEmail, String token) {
        String subject = "[SWEnginnering2025] 비밀번호 재설정 안내";

        String resetUrl = "http://localhost:8080/api/auth/reset-password-form?token=" + token;

        String text = "비밀번호를 재설정하려면 다음 링크를 클릭하세요:\n" + resetUrl
                + "\n\n이 링크는 10분 동안 유효합니다.";

        sendEmail(userEmail, subject, text);
    }
}