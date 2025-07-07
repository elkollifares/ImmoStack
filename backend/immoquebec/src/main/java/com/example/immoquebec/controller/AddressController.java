package com.example.immoquebec.controller;

import com.example.immoquebec.dto.AddressDto;
import com.example.immoquebec.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping(path = "api/address")
public class AddressController {
    private final AddressService addressService;

    @Autowired
    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping(path = "ad/{adId}")
    public AddressDto getAddressByAdId(@PathVariable("adId") Long id) {
        return addressService.getAddressByAdId(id);
    }

}
