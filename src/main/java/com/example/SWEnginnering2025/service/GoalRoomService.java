/*
   Project:GoalRoomService.java
   Author: 윤나영
  Date of creation: 2025.11.30
  Date of last update: 2025.11.30
*/
package com.example.SWEnginnering2025.service;
import com.example.SWEnginnering2025.dto.goalroom.*;
import com.example.SWEnginnering2025.model.goalroom.*;
import com.example.SWEnginnering2025.model.Goal;
import com.example.SWEnginnering2025.model.Profile;
import com.example.SWEnginnering2025.repository.goalroom.GoalRoomRepository;
import com.example.SWEnginnering2025.repository.goalroom.GoalRoomMemberRepository;
import com.example.SWEnginnering2025.repository.goalroom.GoalRoomMessageRepository;
import com.example.SWEnginnering2025.repository.GoalRepository;
import com.example.SWEnginnering2025.repository.ProfileRepository;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class GoalRoomService {

    private final GoalRoomRepository roomRepository;
    private final GoalRoomMemberRepository memberRepository;
    private final GoalRoomMessageRepository messageRepository;

    private final ProfileRepository profileRepository;
    private final GoalRepository goalRepository;

    private final GroupChatService groupChatService;

    public GoalRoomService(
            GoalRoomRepository roomRepository,
            GoalRoomMemberRepository memberRepository,
            GoalRoomMessageRepository messageRepository,
            ProfileRepository profileRepository,
            GoalRepository goalRepository,
            GroupChatService groupChatService
    ) {
        this.roomRepository = roomRepository;
        this.memberRepository = memberRepository;
        this.messageRepository = messageRepository;
        this.profileRepository = profileRepository;
        this.goalRepository = goalRepository;
        this.groupChatService = groupChatService;
    }

    // -----------------------------------------------------
    // 1. 방 생성
    // -----------------------------------------------------
    public CreateRoomResponse createRoom(Long userId, CreateRoomRequest req) {

        GoalRoom room = new GoalRoom();
        room.setRoomName(req.getRoomName());
        room.setGoal(req.getGoal());
        room.setDescription(req.getDescription());
        room.setStartDate(req.getStartDate());
        room.setEndDate(req.getEndDate());
        room.setMaxMembers(req.getMaxMembers());
        room.setVisibility(req.getVisibility());
        room.setOwnerId(userId);

        room = roomRepository.save(room);

        // 방장 멤버 등록
        GoalRoomMember host = new GoalRoomMember();
        host.setGoalRoom(room);
        host.setUserId(userId);
        host.setRole(GoalRoomMemberRole.OWNER);
        memberRepository.save(host);

        return new CreateRoomResponse(room.getId());
    }

    // -----------------------------------------------------
    // 2. 방 참여
    // -----------------------------------------------------
    public void joinRoom(Long userId, Long roomId) {

        Optional<GoalRoom> optional = roomRepository.findById(roomId);
        if (!optional.isPresent()) {
            throw new IllegalArgumentException("Room not found");
        }
        GoalRoom room = optional.get();

        boolean alreadyJoined = memberRepository.existsByGoalRoomIdAndUserId(roomId, userId);
        if (alreadyJoined) {
            throw new IllegalStateException("Already joined");
        }

        int count = memberRepository.countByGoalRoomId(roomId);
        if (count >= room.getMaxMembers()) {
            throw new IllegalStateException("Room is full");
        }

        GoalRoomMember m = new GoalRoomMember();
        m.setGoalRoom(room);
        m.setUserId(userId);
        m.setRole(GoalRoomMemberRole.MEMBER);
        memberRepository.save(m);
    }

    // -----------------------------------------------------
    // 3. 방 탈퇴
    // -----------------------------------------------------
    @Transactional
    public void leaveRoom(Long userId, Long roomId) {
        Optional<GoalRoom> optional = roomRepository.findById(roomId);
        if (!optional.isPresent()) {
            throw new IllegalArgumentException("Room not found");
        }
        GoalRoom room = optional.get();

        if (room.getOwnerId().equals(userId)) {
            throw new IllegalStateException("Owner cannot leave the room");
        }

        memberRepository.deleteByGoalRoomIdAndUserId(roomId, userId);
    }

    // -----------------------------------------------------
    // 4. 공개 방 검색
    // -----------------------------------------------------
    public List<GoalRoomSummaryDto> search(String keyword) {

        List<GoalRoom> rooms =
                roomRepository.findByVisibilityAndRoomNameContainingIgnoreCase(
                        GoalRoomVisibility.PUBLIC, keyword);

        List<GoalRoomSummaryDto> result = new ArrayList<>();

        for (GoalRoom room : rooms) {
            result.add(toSummary(room));
        }
        return result;
    }

    // -----------------------------------------------------
    // 5. 내 방 + 공개 방 목록 조회
    // -----------------------------------------------------
    public GoalRoomListResponse getRooms(Long userId, String scope) {

        GoalRoomListResponse response = new GoalRoomListResponse();

        // 내 방
        if (scope == null || scope.equals("my")) {
            List<GoalRoomMember> joined = memberRepository.findByUserId(userId);
            List<GoalRoomSummaryDto> myRooms = new ArrayList<>();

            for (GoalRoomMember m : joined) {
                myRooms.add(toSummary(m.getGoalRoom()));
            }
            response.setMyRooms(myRooms);
        }

        // 공개 방
        if (scope == null || scope.equals("public")) {
            List<GoalRoom> publics = roomRepository.findByVisibility(GoalRoomVisibility.PUBLIC);
            List<GoalRoomSummaryDto> publicRooms = new ArrayList<>();

            for (GoalRoom room : publics) {
                publicRooms.add(toSummary(room));
            }
            response.setPublicRooms(publicRooms);
        }

        return response;
    }

    private GoalRoomSummaryDto toSummary(GoalRoom room) {

        int count = memberRepository.countByGoalRoomId(room.getId());

        GoalRoomSummaryDto dto = new GoalRoomSummaryDto();
        dto.setId(room.getId());
        dto.setRoomName(room.getRoomName());
        dto.setGoal(room.getGoal());
        dto.setVisibility(room.getVisibility());
        dto.setCurrentMembers(count);
        dto.setMaxMembers(room.getMaxMembers());
        dto.setOwnerId(room.getOwnerId());

        return dto;
    }

    // -----------------------------------------------------
    // 6. 메시지 저장
    // -----------------------------------------------------
    public MessageDto saveMessage(Long userId, Long roomId, SendMessageRequest req) {

        Optional<GoalRoom> optional = roomRepository.findById(roomId);
        if (!optional.isPresent()) {
            throw new IllegalArgumentException("Room not found");
        }
        GoalRoom room = optional.get();

        boolean joined = memberRepository.existsByGoalRoomIdAndUserId(roomId, userId);
        if (!joined) {
            throw new IllegalStateException("Not a member");
        }

        return groupChatService.saveMessage(userId, room, req.getContent());
    }

    // -----------------------------------------------------
    // 7. 메시지 페이징 조회
    // -----------------------------------------------------
    public Page<MessageDto> getMessages(Long roomId, int page, int size) {

        return groupChatService.getMessages(roomId, PageRequest.of(page, size));
    }

    // -----------------------------------------------------
    // 8. 오늘의 목표 달성률 조회
    // -----------------------------------------------------
    public TodayStatusDto getTodayStatus(Long roomId) {

        LocalDate today = LocalDate.now();

        List<GoalRoomMember> members = memberRepository.findByGoalRoomId(roomId);
        List<MemberTodayStatusDto> result = new ArrayList<>();

        for (GoalRoomMember m : members) {

            Long uid = m.getUserId();
            String nickname = "User" + uid;

            Optional<Profile> profileOpt = profileRepository.findByUserId(uid);
            if (profileOpt.isPresent()) {
                Profile profile = profileOpt.get();
                nickname = profile.getNickname();
            }

            List<Goal> todayGoals = goalRepository.findByUserIdAndTargetDate(uid, today);

            int total = todayGoals.size();
            int done = 0;

            for (Goal g : todayGoals) {
                if (g.getStatus().name().equals("COMPLETED") ||
                        g.getStatus().name().equals("DONE"))
                    done++;
            }

            double rate = (total == 0) ? 0 : (done * 100.0 / total);

            MemberTodayStatusDto dto = new MemberTodayStatusDto(
                    uid, nickname, total, done, rate
            );

            result.add(dto);
        }

        TodayStatusDto dto = new TodayStatusDto();
        dto.setRoomId(roomId);
        dto.setDate(today);
        dto.setMembers(result);

        return dto;
    }
}