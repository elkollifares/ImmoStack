package com.example.immoquebec.service;

import com.example.immoquebec.dto.UserDto;

import com.example.immoquebec.entity.User;
import com.example.immoquebec.entity.UserDetails;
import com.example.immoquebec.mapper.UserMapper;
import com.example.immoquebec.repository.UserDetailsRepository;
import com.example.immoquebec.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserDetailsRepository userDetailsRepository;
    private final UserMapper userMapper;


    @Autowired
    public UserService(UserRepository userRepository, UserDetailsRepository userDetailsRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userDetailsRepository = userDetailsRepository;
        this.userMapper = userMapper;
    }

    public UserDto getUserById(Long id) {

        User user = findById(id);
        UserDetails userDetails = findDetailsByUserId(id);
        return userMapper.toDto(user, userDetails);

    }

    public User findUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id " + id));

    }

    private User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id " + id));
    }

    public UserDetails findDetailsByUserId(Long id) {
        return userDetailsRepository.findByUserId(id)
                .orElseThrow(() -> new EntityNotFoundException("User details not found for user id " + id));
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public void add(User user) {
        userRepository.save(user);
    }

    public void addDetails(UserDetails userDetails) {
        userDetailsRepository.save(userDetails);
    }

    public void update(UserDto userDto) {
        User user = findById(userDto.getUserId());
        UserDetails userDetails = findDetailsByUserId(userDto.getUserId());

        userDetails.setPhoneNumber(userDto.getPhoneNumber());
        userDetails.setSurname(userDto.getSurname());
        userDetails.setName(userDto.getName());
        userDetails.setImageUrl(userDto.getImageUrl());

        userDetailsRepository.save(userDetails);
    }

    public Page<UserDto> getAll(Pageable pageable) {
        List<UserDto> userDtoList = new ArrayList<>();

        Page<User> usersPage = userRepository.findAll(pageable);
        for (User user : usersPage) {
            UserDetails userDetails = user.getUserDetails();
            userDtoList.add(userMapper.toDto(user, userDetails));
        }

        return new PageImpl<>(userDtoList, pageable, usersPage.getTotalElements());
    }

    public void deleteUserById(Long id) {
        User user = findById(id);
        UserDetails userDetails = findDetailsByUserId(id);

        userDetailsRepository.delete(userDetails);
        userRepository.delete(user);

    }


}
