package com.example.immoquebec.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserDetailsDto {
    private Long userId;
    private String surname;
    private String name;
    private String phoneNumber;
    private String imageUrl;


}
