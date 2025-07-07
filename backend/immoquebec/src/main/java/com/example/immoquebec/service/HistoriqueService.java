package com.example.immoquebec.service;

import com.example.immoquebec.dto.HistoriqueDto;
import com.example.immoquebec.entity.Address;
import com.example.immoquebec.entity.City;
import com.example.immoquebec.entity.Country;
import com.example.immoquebec.entity.Historique;
import com.example.immoquebec.mapper.HistoriqueMapper;
import com.example.immoquebec.repository.AddressRepository;
import com.example.immoquebec.repository.CityRepository;
import com.example.immoquebec.repository.CountryRepository;
import com.example.immoquebec.repository.HistoriqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistoriqueService {

    @Autowired
    private HistoriqueRepository historiqueRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private CountryRepository countryRepository;
    @Autowired
    private CityRepository cityRepository;
    @Autowired
    private HistoriqueMapper historiqueMapper;

    public List<HistoriqueDto> getAllHistoriques() {
        return historiqueRepository.findAll().stream()
                .map(historiqueMapper::toDto)
                .collect(Collectors.toList());
    }

    public HistoriqueDto getHistoriqueById(Long id) {
        return historiqueRepository.findById(id)
                .map(historiqueMapper::toDto)
                .orElse(null);
    }

    @Transactional
    public HistoriqueDto createHistorique(Historique historique) {
        Address address = historique.getAddress();
        if (address != null) {
            Country country = address.getCountry();
            if (country != null) {
                Country existingCountry = countryRepository.findByName(country.getName());
                if (existingCountry == null) {
                    country = countryRepository.save(country);
                    address.setCountry(country);
                } else {
                    address.setCountry(existingCountry);
                }
            }

            City city = address.getCity();
            if (city != null) {
                City existingCity = cityRepository.findByName(city.getName());
                if (existingCity == null) {
                    city = cityRepository.save(city);
                    address.setCity(city);
                } else {
                    address.setCity(existingCity);
                }
            }

            // Check if the address already exists
            Address existingAddress = addressRepository.findByDetails(
                    address.getStreetName(),
                    address.getStreetNumber(),
                    address.getPostalCode(),
                    address.getCountry().getId(),
                    address.getCity().getId()
            );

            if (existingAddress != null) {
                // Address already exists, use the existing address
                address = existingAddress;
            } else {
                // Save address if it's not already persisted
                if (address.getId() == null) {
                    address = addressRepository.save(address);
                }
            }

            historique.setAddress(address); // Ensure the historique has the persisted address
        }

        Historique savedHistorique = historiqueRepository.save(historique);
        return historiqueMapper.toDto(savedHistorique);
    }

    public List<HistoriqueDto> getHistoriquesByAddress(Address address) {
        return historiqueRepository.findByAddress(address).stream()
                .map(historiqueMapper::toDto)
                .collect(Collectors.toList());
    }

    public Page<HistoriqueDto> getHistoriquesByAddress(String streetName, int streetNumber, String postalCode, String cityName, String countryName, int page, int size) {
        Country country = countryRepository.findByName(countryName);
        if (country == null)
            return Page.empty();
        City city = cityRepository.findByName(cityName);
        if (city == null)
            return Page.empty();
        Address address = addressRepository.findByDetails(streetName, streetNumber, postalCode, country.getId(), city.getId());
        if (address == null)
            return Page.empty();
        Page<Historique> historiques = historiqueRepository.findByAddressId(address.getId(),PageRequest.of(page, 5));
        return historiques.map(historiqueMapper::toDto);
    }

    public void deleteHistorique(Long id) {
        historiqueRepository.deleteById(id);
    }
}
