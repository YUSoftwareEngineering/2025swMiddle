/*Project: CreateTagRequest.java
        Author: 한지윤
        Date of creation: 2025.11.23
        Date of last update: 2025.11.23
                */
package com.example.SWEnginnering2025.dto.failure;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CreateTagRequest {

    private Long userId;
    private String name;

}
