/*
    Project: UserService.java
    Author: 윤혜원
	Date of creation: 2025.11.21
	Date of last update: 2025.11.22
*/

package com.example.SWEnginnering2025.service;

import com.example.SWEnginnering2025.model.User;
import com.example.SWEnginnering2025.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 회원가입
    public User register(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다: " + user.getEmail());
        }

        if (userRepository.existsByUserId(user.getUserId())) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다: " + user.getUserId());
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // 로그인 (이메일 or 아이디)
    public User login(String emailOrUserId, String password) {

        Optional<User> userOpt = emailOrUserId.contains("@")
                ? userRepository.findByEmail(emailOrUserId)
                : userRepository.findByUserId(emailOrUserId);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }

        return null;
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(updatedUser.getName());
                    user.setEmail(updatedUser.getEmail());
                    user.setUserId(updatedUser.getUserId());
                    user.setBirth(updatedUser.getBirth());
                    return userRepository.save(user);
                })
                .orElse(null);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}