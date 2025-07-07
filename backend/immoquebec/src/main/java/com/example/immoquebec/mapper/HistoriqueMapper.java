package com.example.immoquebec.mapper;

import com.example.immoquebec.dto.HistoriqueDto;
import com.example.immoquebec.entity.Address;
import com.example.immoquebec.entity.City;
import com.example.immoquebec.entity.Country;
import com.example.immoquebec.entity.Historique;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

@Component
public class HistoriqueMapper {

    public HistoriqueDto toDto(Historique historique) {
        Address address = historique.getAddress();
        return new HistoriqueDto(
                historique.getId(),
                address.getStreetName(),
                address.getStreetNumber(),
                address.getPostalCode(),
                address.getCity().getName(),
                address.getCountry().getName(),
                historique.getMontantBail(),
                historique.getDateEntree(),
                historique.getDateSortie(),
                historique.getDateCreated()
        );
    }

    public Historique toEntity(HistoriqueDto dto) {
        Address address = new Address();
        address.setStreetName(dto.getStreetName());
        address.setStreetNumber(dto.getStreetNumber());
        address.setPostalCode(dto.getPostalCode());

        City city = new City();
        city.setName(dto.getCity());
        address.setCity(city);

        Country country = new Country();
        country.setName(dto.getCountry());
        address.setCountry(country);

        Historique historique = new Historique();
        historique.setAddress(address);
        historique.setMontantBail(dto.getMontantBail());
        historique.setDateEntree(dto.getDateEntree());
        historique.setDateSortie(dto.getDateSortie());
        return historique;
    }
}

