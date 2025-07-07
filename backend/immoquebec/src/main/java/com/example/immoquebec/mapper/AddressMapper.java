package com.example.immoquebec.mapper;


import com.example.immoquebec.dto.AddressDto;
import com.example.immoquebec.entity.Address;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {
    public AddressDto toDto(Address address) {

        return new AddressDto(
                address.getStreetName(),
                address.getStreetNumber(),
                address.getPostalCode(),
                address.getLatitude(),
                address.getLongitude()
        );
    }
}
