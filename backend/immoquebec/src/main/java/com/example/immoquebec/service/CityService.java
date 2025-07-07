package com.example.immoquebec.service;


import com.example.immoquebec.entity.City;
import com.example.immoquebec.mapper.CityMapper;
import com.example.immoquebec.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CityService {

    private final CityRepository cityRepository;
    private final CityMapper cityMapper;

    @Autowired
    public CityService(CityRepository cityRepository, CityMapper cityMapper) {
        this.cityRepository = cityRepository;
        this.cityMapper = cityMapper;
    }

    public boolean checkIfExist(String name) {

        return cityRepository.existsByName(name);
    }

    public Long getIdByName(String name) {
        return cityRepository.getIdByName(name);
    }

    public Long add(City city) {
        return cityRepository.save(city).getId();
    }

    public void ajouter (City city) {cityRepository.save(city);}
}
