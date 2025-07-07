package com.example.immoquebec.mapper;


import com.example.immoquebec.dto.CityDto;
import com.example.immoquebec.entity.City;
import org.springframework.stereotype.Component;

@Component
public class CityMapper {
    public CityDto toDto(City city) {

        return new CityDto(
                city.getName()
        );
    }
}
