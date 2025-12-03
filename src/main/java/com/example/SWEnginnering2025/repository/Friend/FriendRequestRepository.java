package com.example.SWEnginnering2025.repository.Friend;

import com.example.SWEnginnering2025.model.Friend.FriendRequest;
import com.example.SWEnginnering2025.model.Friend.FriendRequestStatus;
import com.example.SWEnginnering2025.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {

    List<FriendRequest> findByToUserAndStatus(User toUser, FriendRequestStatus status);

    List<FriendRequest> findByFromUserAndStatus(User fromUser, FriendRequestStatus status);

    boolean existsByFromUserAndToUserAndStatus(User fromUser, User toUser, FriendRequestStatus status);

    @Query("SELECT COUNT(fr) FROM FriendRequest fr WHERE fr.toUser.id = :userId AND fr.status = :status")
    long countByToUserIdAndStatus(@Param("userId") Long userId, @Param("status") FriendRequestStatus status);
}