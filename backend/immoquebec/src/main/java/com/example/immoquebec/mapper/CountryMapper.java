package com.example.immoquebec.mapper;


import com.example.immoquebec.dto.CountryDto;
import com.example.immoquebec.entity.Country;
import org.springframework.stereotype.Component;

@Component
public class CountryMapper {
    public CountryDto toDto(Country country) {

        return new CountryDto(
                country.getId(),
                country.getName()
        );
    }
}
