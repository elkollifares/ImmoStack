package com.example.immoquebec.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "historiques")
@Getter
@Setter
public class Historique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;

    @Column(name = "montant_bail", nullable = false)
    private double montantBail;

    @Column(name = "date_entree", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dateEntree;

    @Column(name = "date_sortie", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dateSortie;

    @Column(name = "date_created")
    @CreationTimestamp
    private Date dateCreated;
}

