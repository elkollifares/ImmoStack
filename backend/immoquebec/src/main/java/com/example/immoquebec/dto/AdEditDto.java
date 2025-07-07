package com.example.immoquebec.dto;


import com.example.immoquebec.entity.enums.AdType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AdEditDto {
    Long adId;
    String adName;
    String description;
    double plotSurface;
    double price;
    int numberOfBedrooms;
    int numberOfBathrooms;
    int floorNumber;
    AddressDto addressDto;
    CountryDto country;
    CityDto city;
    AdType adType;
    Boolean lowIncomeBuilding;
}
