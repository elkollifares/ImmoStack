package com.example.immoquebec.service;

import com.example.immoquebec.dto.AddressDto;

import com.example.immoquebec.entity.Address;
import com.example.immoquebec.mapper.AddressMapper;
import com.example.immoquebec.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;

@Service
public class AddressService {
    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;

    @Autowired
    public AddressService(AddressRepository addressRepository, AddressMapper addressMapper) {
        this.addressRepository = addressRepository;
        this.addressMapper = addressMapper;
    }

    public void add(Address address){ addressRepository.save(address);}

    public AddressDto getAddressByAdId(Long id) {
        return addressMapper.toDto(addressRepository.findAddressByAdId(id)
                .orElseThrow(EntityNotFoundException::new));
    }

}
