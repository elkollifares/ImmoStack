package com.example.immoquebec.repository;

import com.example.immoquebec.entity.Address;
import com.example.immoquebec.entity.Historique;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Repository
public interface HistoriqueRepository extends JpaRepository<Historique, Long> {

    List<Historique> findByAddress(Address address);

    // Custom query to find Historique by address id
    @Query("SELECT h FROM Historique h WHERE h.address.id = :addressId")
    Page<Historique> findByAddressId(@RequestParam("addressId") Long addressId,Pageable pageable);
}
