package com.example.immoquebec.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
public class HistoriqueDto {

    private final Long id;
    private final String streetName;
    private final int streetNumber;
    private final String postalCode;
    private final String city;
    private final String country;
    private final double montantBail;
    private final Date dateEntree;
    private final Date dateSortie;
    private final Date dateCreated;
}

