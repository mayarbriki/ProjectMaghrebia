package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.User;
import com.example.projectmaghrebia.Repositories.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class UserService implements IUserService {
    @Autowired
    private UserRepository userRepository;
    private  PasswordEncoder passwordEncoder;
    @Override
    public User registerUser(User user) {
        // Encode the password before saving
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        // Save and return the user
        return userRepository.save(user);
    }

    @Override
    public Optional<User> authenticateUser(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        return userOptional.filter(user ->
                passwordEncoder.matches(password, user.getPassword())
        );
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}
