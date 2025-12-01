/*Project: AttachmentController.java
        Author: 한지윤
        Date of creation: 2025.11.23
        Date of last update: 2025.11.23
                */
package com.example.SWEnginnering2025.repository;

import com.example.SWEnginnering2025.model.FailureTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FailureTagRepository extends JpaRepository<FailureTag, Long> {

    // 기본 태그 + 특정 유저 태그 함께 조회
    List<FailureTag> findByBuiltInTrueOrUserId(Long userId);

    // 같은 이름 중복 방지용
    Optional<FailureTag> findByUserIdAndName(Long userId, String name);
}
