package com.example.immoquebec.mapper;


import com.example.immoquebec.dto.UserDto;
import com.example.immoquebec.entity.User;
import com.example.immoquebec.entity.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDto toDto(User user, UserDetails userDetails) {

        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                userDetails.getName(),
                userDetails.getSurname(),
                userDetails.getPhoneNumber(),
                userDetails.getImageUrl()
        );
    }
}
