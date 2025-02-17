package com.example.projectmaghrebia.Controllers;
import com.example.projectmaghrebia.Entities.User;
import com.example.projectmaghrebia.Services.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
@Autowired
    private  IUserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User registeredUser = userService.registerUser(user);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestParam String username, @RequestParam String password) {
        Optional<User> authenticatedUser = userService.authenticateUser(username, password);

        if (authenticatedUser.isPresent()) {
            return ResponseEntity.ok(authenticatedUser.get()); // Return User object
        } else {
            return ResponseEntity.status(401).body("Invalid credentials"); // Return error message
        }
    }


    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        return userService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}