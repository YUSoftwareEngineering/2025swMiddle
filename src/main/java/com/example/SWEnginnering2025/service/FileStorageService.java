/*Project: AttachmentController.java
        Author: 한지윤
        Date of creation: 2025.11.23
        Date of last update: 2025.11.23
                */

package com.example.SWEnginnering2025.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileStorageService {

    // 파일을 저장할 폴더 경로 (C드라이브나 프로젝트 폴더 등)
    // 맥/리눅스라면 "/tmp/uploads/" 등으로 변경 필요
    private final String uploadDir = System.getProperty("user.dir") + "/uploads/";

    public String saveFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return null;
        }

        // 1. 폴더가 없으면 만들기
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // 2. 파일명 중복 방지를 위해 UUID(랜덤문자) 붙이기
        String originalFilename = file.getOriginalFilename();
        String savedFilename = UUID.randomUUID() + "_" + originalFilename;

        // 3. 파일 저장 (내 컴퓨터로 전송!)
        File dest = new File(uploadDir + savedFilename);
        file.transferTo(dest);

        // 4. 저장된 파일의 경로(주소) 반환
        // (실제 서비스에선 http://도메인/images/파일이름 형식이 됩니다)
        return dest.getAbsolutePath();
    }
}