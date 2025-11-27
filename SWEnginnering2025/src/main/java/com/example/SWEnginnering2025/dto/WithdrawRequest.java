/*
    Project: WithdrawRequest.java
    Author: YHW
    Date of creation: 2025.11.27
    Date of last update: 2025.11.27
*/

package com.example.SWEnginnering2025.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WithdrawRequest {
    // 회원 탈퇴 시 최종 확인을 위해 비밀번호를 받음
    private String password;
}