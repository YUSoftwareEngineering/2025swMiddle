/*Project: FailureTagDto.java
        Author: 한지윤
        Date of creation: 2025.11.23
        Date of last update: 2025.11.23
                */
package com.example.SWEnginnering2025.dto.failure;
import com.example.SWEnginnering2025.model.FailureTag;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FailureTagDto {

    private Long id;
    private String name;
    private boolean builtIn;

    public static FailureTagDto from(FailureTag tag) {
        return new FailureTagDto(tag.getTagid(), tag.getName(), tag.isBuiltIn());
    }

}
