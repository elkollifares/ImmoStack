package com.example.immoquebec.mapper;


import com.example.immoquebec.dto.AdImageDto;
import com.example.immoquebec.entity.AdImage;
import org.springframework.stereotype.Component;

@Component
public class AdImageMapper {

    public AdImageDto toDto(AdImage adImage) {

        return new AdImageDto(
                adImage.getImageUrl()
        );
    }
}
