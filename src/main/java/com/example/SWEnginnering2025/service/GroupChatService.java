/*
   Project:GroupChatService.java
   Author: 윤나영
  Date of creation: 2025.11.30
  Date of last update: 2025.11.30
*/
package com.example.SWEnginnering2025.service;
import com.example.SWEnginnering2025.dto.goalroom.MessageDto;
import com.example.SWEnginnering2025.model.goalroom.GoalRoom;
import com.example.SWEnginnering2025.model.goalroom.GoalRoomMessage;
import com.example.SWEnginnering2025.repository.goalroom.GoalRoomMessageRepository;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


@Service
public class GroupChatService {

    private final GoalRoomMessageRepository messageRepository;

    public GroupChatService(GoalRoomMessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    // ---------------------------------------
    // 메시지 저장
    // ---------------------------------------
    public MessageDto saveMessage(Long senderId, GoalRoom room, String content) {

        GoalRoomMessage msg = new GoalRoomMessage();
        msg.setGoalRoom(room);
        msg.setSenderId(senderId);
        msg.setContent(content);

        GoalRoomMessage saved = messageRepository.save(msg);

        MessageDto dto = new MessageDto();
        dto.setId(saved.getId());
        dto.setSenderId(saved.getSenderId());
        dto.setContent(saved.getContent());
        dto.setCreatedAt(saved.getCreatedAt());

        return dto;
    }

    // ---------------------------------------
    // 메시지 페이징 조회
    // ---------------------------------------
    public Page<MessageDto> getMessages(Long roomId, Pageable pageable) {

        return messageRepository.findByGoalRoomId(roomId, pageable)
                .map(msg -> new MessageDto(
                        msg.getId(),
                        msg.getSenderId(),
                        msg.getContent(),
                        msg.getCreatedAt()
                ));
    }
}