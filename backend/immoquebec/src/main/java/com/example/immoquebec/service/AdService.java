package com.example.immoquebec.service;

import com.example.immoquebec.dto.AdDetailsDto;
import com.example.immoquebec.dto.AdDto;
import com.example.immoquebec.dto.AdEditDto;
import com.example.immoquebec.entity.*;
import com.example.immoquebec.entity.enums.AdType;
import com.example.immoquebec.mapper.AdDetailsMapper;
import com.example.immoquebec.mapper.AdEditMapper;
import com.example.immoquebec.mapper.AdMapper;
import com.example.immoquebec.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdService {

    private final AdRepository adRepository;
    private final AddressRepository addressRepository;
    private final CountryRepository countryRepository;
    private final CityRepository cityRepository;
    private final UserRepository userRepository;
    private final AdMapper adMapper;
    private final AdDetailsMapper adDetailsMapper;
    private final AdEditMapper adEditMapper;
    private final EntityManager entityManager;

    @Autowired
    public AdService(AdRepository adRepository, AddressRepository addressRepository, CountryRepository countryRepository, CityRepository cityRepository, UserRepository userRepository, AdMapper adMapper, AdDetailsMapper adDetailsMapper, AdEditMapper adEditMapper, EntityManager entityManager) {
        this.adRepository = adRepository;
        this.addressRepository = addressRepository;
        this.countryRepository = countryRepository;
        this.cityRepository = cityRepository;
        this.userRepository = userRepository;
        this.adMapper = adMapper;
        this.adDetailsMapper = adDetailsMapper;
        this.adEditMapper = adEditMapper;
        this.entityManager = entityManager;
    }

    public AdDetailsDto getAdDetailsById(Long id) {
        return adDetailsMapper.toDto(adRepository.findAdById(id).
                orElseThrow(EntityNotFoundException::new));
    }

    public AdDto getAdDtoById(Long id) {
        return adMapper.toDto(adRepository.findAdById(id).
                orElseThrow(EntityNotFoundException::new));
    }

    public Ad getAdById(Long id) {
        return adRepository.findAdById(id).orElseThrow(EntityNotFoundException::new);
    }

    public Page<AdDto> getAllByUserId(Long id, Pageable pageable) {
        return adRepository.findAllByUserId(id, pageable).map(adMapper::toDto);
    }

    @Transactional
    public void ajouterAd(Ad ad) {
        Address address = ad.getAddress();

        // Vérifiez si l'adresse existe déjà en base de données
        if (address.getId() != null) {
            // Si l'adresse existe, fusionnez-la avec le contexte de persistance
            address = entityManager.merge(address);
        } else {
            // Sinon, enregistrez-la comme une nouvelle entité
            address = addressRepository.save(address);
        }

        // Attachez l'adresse fusionnée ou nouvellement enregistrée à l'annonce
        ad.setAddress(address);

        // Persistez l'annonce
        adRepository.save(ad);
    }

    @Transactional
    public Long add(Ad ad) {
        Address address = ad.getAddress();
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
            ad.setAddress(address); // Ensure the historique has the persisted address
        }

        // Save ad and return its ID
        return adRepository.save(ad).getId();
    }

    public void update(Ad ad, Long adId) {
        Ad updatedAd = adRepository.findAdById(adId).
                orElseThrow(EntityNotFoundException::new);
        updatedAd.setAddress(ad.getAddress());
        updatedAd.setAdName(ad.getAdName());
        updatedAd.setAdType(ad.getAdType());
        updatedAd.setLastUpdated(new Date());
        updatedAd.setFloorNumber(ad.getFloorNumber());
        updatedAd.setNumberOfBathrooms(ad.getNumberOfBathrooms());
        updatedAd.setNumberOfBedrooms(ad.getNumberOfBedrooms());
        updatedAd.setDescription(ad.getDescription());
        updatedAd.setPlotSurface(ad.getPlotSurface());
        updatedAd.setPrice(ad.getPrice());
        adRepository.save(updatedAd);
    }

    public void addToFavorites(Long userId, Long adId) {
        Ad ad = adRepository.findAdById(adId).orElseThrow(EntityNotFoundException::new);
        ad.getUsersFav().add(userRepository.findUserById(userId));
        adRepository.save(ad);
    }

    public List<AdDto> getPermissionList(Long userId) {
        User user = userRepository.findUserById(userId);
        return user.getPermittedAds().stream().map(adMapper::toDto).collect(Collectors.toList());
    }

    public void removeFromFavorites(Long userId, Long adId) {
        Ad ad = adRepository.findAdById(adId).orElseThrow(EntityNotFoundException::new);
        ad.getUsersFav().remove(userRepository.findUserById(userId));
        adRepository.save(ad);
    }

    public Page<AdDto> getAdByAdType(AdType adType, Pageable pageable) {
        return adRepository.findAllByAdType(adType, pageable).map(adMapper::toDto);
    }

    public Page<AdDto> getAll(Pageable pageable) {
        return adRepository.findAll(pageable).map(adMapper::toDto);
    }

    public Page<AdDto> findAllByKeyword(String keyword, Pageable pageable) {
        return adRepository.findAllByKeyword(keyword, pageable).map(adMapper::toDto);
    }

    public Page<AdDto> findUserFavoritesByUserId(Long id, Pageable pageable) {
        return adRepository.findAdsByUsersFavId(id, pageable).map(adMapper::toDto);
    }

    public List<Long> findFavList(Long id) {
        return adRepository.findAdsIdByUsersFavId(id);
    }

    public AdEditDto getAdForEdit(Long id) {
        return adEditMapper.toDto(adRepository.findAdById(id)
                .orElseThrow(EntityNotFoundException::new));
    }

    public void deleteAdById(Long id) {
        adRepository.deleteById(id);
    }

    public void setActiveById(Long id, boolean isActive) {
        adRepository.setActiveById(id, isActive);
    }
}