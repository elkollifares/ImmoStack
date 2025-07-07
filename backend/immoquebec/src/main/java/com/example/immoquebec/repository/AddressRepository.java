package com.example.immoquebec.repository;


import com.example.immoquebec.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    Optional<Address> findAddressByAdId(Long id);

    @Query(value = "SELECT a FROM Address a WHERE a.streetName = :streetName AND a.streetNumber = :streetNumber AND a.postalCode = :postalCode AND a.country.id = :countryId AND a.city.id = :cityId")
    Address findByDetails(@RequestParam("streetName") String streetName,
                          @RequestParam("streetNumber") int streetNumber,
                          @RequestParam("postalCode") String postalCode,
                          @RequestParam("countryId") Long countryId,
                          @RequestParam("cityId") Long cityId);
}
