package com.example.SWEnginnering2025.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdate {

    private String nickname;
    private String avatarUrl;
    private String bio;

    // 클라이언트가 camelCase(profilePublic)로 보내더라도, Jackson이 정확히 이 필드에 매핑하도록 지정합니다.
    @JsonProperty("profilePublic")
    private Boolean profilePublic;

    @JsonProperty("activityPublic")
    private Boolean activityPublic;

    private Long representativeCharacterId;

    @Override
    public String toString() {
        return "ProfileUpdate{" +
                "nickname='" + nickname + '\'' +
                ", avatarUrl='" + avatarUrl + '\'' +
                ", bio='" + bio + '\'' +
                ", profilePublic=" + profilePublic +
                ", activityPublic=" + activityPublic +
                ", representativeCharacterId=" + representativeCharacterId +
                '}';
    }
}