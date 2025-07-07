package com.example.immoquebec.controller;

import com.example.immoquebec.dto.GetResponseHistoryItems;
import com.example.immoquebec.dto.HistoriqueDto;
import com.example.immoquebec.dto.PageableInfo;
import com.example.immoquebec.entity.*;
import com.example.immoquebec.service.HistoriqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/history")
public class HistoriqueController {

    @Autowired
    private HistoriqueService historiqueService;

    @GetMapping
    public List<HistoriqueDto> getAllHistoriques() {
        return historiqueService.getAllHistoriques();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistoriqueDto> getHistoriqueById(@PathVariable Long id) {
        HistoriqueDto historiqueDto = historiqueService.getHistoriqueById(id);
        if (historiqueDto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(historiqueDto);
    }

    @PostMapping
    public ResponseEntity<HistoriqueDto> createHistorique(@RequestBody Historique historique) {
        HistoriqueDto createdHistorique = historiqueService.createHistorique(historique);
        return ResponseEntity.ok(createdHistorique);
    }

    @GetMapping("/search")
    public ResponseEntity<GetResponseHistoryItems> getHistoriquesByAddress(
            @RequestParam String streetName,
            @RequestParam int streetNumber,
            @RequestParam String postalCode,
            @RequestParam String cityName,
            @RequestParam String countryName,
            @RequestParam int page,
            @RequestParam int size) {

        Address address = new Address();
        address.setStreetName(streetName);
        address.setStreetNumber(streetNumber);
        address.setPostalCode(postalCode);

        City city = new City();
        city.setName(cityName);
        address.setCity(city);

        Country country = new Country();
        country.setName(countryName);
        address.setCountry(country);

        Page<HistoriqueDto> historiquePage = historiqueService.getHistoriquesByAddress(streetName,streetNumber,postalCode,cityName,countryName,page,size);

        GetResponseHistoryItems response = new GetResponseHistoryItems();
        response.setContent(historiquePage.getContent());
        response.setPageable(new PageableInfo(
                historiquePage.getSize(),
                historiquePage.getTotalElements(),
                historiquePage.getTotalPages(),
                historiquePage.getNumber()
        ));

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHistorique(@PathVariable Long id) {
        historiqueService.deleteHistorique(id);
        return ResponseEntity.noContent().build();
    }
}

