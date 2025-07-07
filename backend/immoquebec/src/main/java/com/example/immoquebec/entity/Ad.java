package com.example.immoquebec.entity;


import com.example.immoquebec.config.PostgreSQLEnumType;
import com.example.immoquebec.entity.enums.AdType;
import lombok.Getter;
import lombok.Setter;

import org.hibernate.annotations.*;
import org.hibernate.annotations.Parameter;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "ads", uniqueConstraints = {
        @UniqueConstraint(name = "address_unique", columnNames = "address_id")

})
@TypeDef(
        name = "pgsql_enum",
        typeClass = PostgreSQLEnumType.class
)
@Getter
@Setter
public class Ad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "ad_name", columnDefinition = "VARCHAR(100)", nullable = false)
    private String adName;

    @Column(name = "description", columnDefinition = "VARCHAR(500)", nullable = false)
    private String description;

    @Column(name = "plot_surface", nullable = false)
    private double plotSurface;

    @Column(name = "price", nullable = false)
    private int price;

    @Column(name = "number_of_bedrooms", nullable = false)
    private int numberOfBedrooms;

    @Column(name = "number_of_bathrooms", nullable = false)
    private int numberOfBathrooms;

    @Column(name = "floor_number", columnDefinition = "integer default 0")
    private int floorNumber;

    @Column(name = "date_created")
    @CreationTimestamp
    private Date dateCreated;

    @Column(name = "last_updated")
    @UpdateTimestamp
    private Date lastUpdated;

    @Column(name = "is_active", columnDefinition = "boolean default true")
    private boolean isActive = true;

    @Column(name = "low_income_building", columnDefinition = "boolean default false")
    private boolean lowIncomeBuilding = false; // Added property

    //    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @OneToOne(cascade = CascadeType.ALL , orphanRemoval = true)
    @JoinColumn(name = "address_id", referencedColumnName = "id", nullable = false)
    private Address address;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "ad")
    private Set<AdImage> adImages;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "users_favorites",
            joinColumns = @JoinColumn(name = "ad_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    Set<User> usersFav;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "permitted_users",
            joinColumns = @JoinColumn(name = "ad_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    Set<User> permittedUsers;

    @Enumerated(EnumType.STRING)
    @Column(name = "ad_type", columnDefinition = "AdType", nullable = false)
    @Type(type = "pgsql_enum")
    AdType adType;


}
