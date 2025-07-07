package com.example.immoquebec.mapper;

import com.example.immoquebec.dto.AdDetailsDto;

import com.example.immoquebec.entity.Ad;
import org.springframework.stereotype.Component;

@Component
public class AdDetailsMapper {
    public AdDetailsDto toDto(Ad ad) {
        return new AdDetailsDto(
                ad.getId(),
                ad.getFloorNumber(),
                ad.getUser().getId(),
                ad.getUser().getUserDetails().getName(),
                ad.getUser().getUserDetails().getPhoneNumber(),
                ad.getUser().getEmail(),
                ad.getUser().getUserDetails().getImageUrl(),
                ad.getDescription(),
                ad.getAddress().getLongitude(),
                ad.getAddress().getLatitude()
        );
    }
}
