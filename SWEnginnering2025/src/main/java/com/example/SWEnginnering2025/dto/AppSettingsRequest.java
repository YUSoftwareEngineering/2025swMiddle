package com.example.SWEnginnering2025.dto;

import com.example.SWEnginnering2025.model.FriendRequestPolicy;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AppSettingsRequest {
    private boolean isNotificationEnabled;
    private FriendRequestPolicy friendRequestPolicy;
}