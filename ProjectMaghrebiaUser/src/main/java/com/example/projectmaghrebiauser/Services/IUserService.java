package com.example.projectmaghrebiauser.Services;

import com.example.projectmaghrebiauser.Entities.User;

import java.util.Optional;

public interface IUserService {
    User registerUser(User user);
    Optional<User> authenticateUser(String username, String password);
    Optional<User> findByUsername(String username);
    Optional<User> findById(Long id);
}
