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

    // 시스템 기본 제공 태그 + 사용자 커스텀태그 보여주기
    List<FailureTag> findByBuiltInTrueOrUserId(Long userId);

    // 같은 사용자가 같은 이름의 태그를 또 만들려고 할때 중복을 막기 위한 용도
    Optional<FailureTag> findByUserIdAndName(Long userId, String name);
}
