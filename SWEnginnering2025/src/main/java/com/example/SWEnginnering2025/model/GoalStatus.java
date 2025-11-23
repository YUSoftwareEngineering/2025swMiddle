/*
    Project: GoalStatus.java
    Author: CES
	Date of creation: 2025.11.23
	Date of last update: 2025.11.23
*/

package com.example.SWEnginnering2025.model;

// enum은 정해진 몇 개의 값만 쓸 수 있게 묶어 둔 타입

public enum GoalStatus { // 해당 목표의 상태를 나타내는 상태값들
    NOT_STARTED,   // 아직 시작 안함
    PARTIAL,       // 일부만 수행
    DONE,         //완료
    FAILED       // 실패
}
