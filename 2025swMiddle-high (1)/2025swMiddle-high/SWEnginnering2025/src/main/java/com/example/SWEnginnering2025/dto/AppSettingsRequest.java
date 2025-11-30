/*
    Project: AppSettingRequest 알람켜기, 친구요청 받기 설정
    Author: 이채민
    Date of creation: 2025.11.27
    Date of last update: 2025.11.28
*/
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