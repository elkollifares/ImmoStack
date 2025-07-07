package com.example.immoquebec.service;

import com.example.immoquebec.dto.CountryDto;
import com.example.immoquebec.entity.Country;
import com.example.immoquebec.mapper.CountryMapper;
import com.example.immoquebec.repository.CountryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CountryService {
    private final CountryRepository countryRepository;
    private final CountryMapper countryMapper;

    @Autowired
    public CountryService(CountryRepository countryRepository, CountryMapper countryMapper) {
        this.countryRepository = countryRepository;
        this.countryMapper = countryMapper;
    }

    public void add (Country country) { countryRepository.save(country);}

    public List<CountryDto> getCountries(){
        return countryRepository.findAll().stream().map(countryMapper::toDto)
                .collect(Collectors.toList());
    }
}
