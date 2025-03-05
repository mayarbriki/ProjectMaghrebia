package com.example.projectmaghrebiauser.Controllers;

import com.example.projectmaghrebiauser.Entities.Role;
import com.example.projectmaghrebiauser.Entities.User;
import com.example.projectmaghrebiauser.Repositories.UserRepository;
import com.example.projectmaghrebiauser.Services.FileStorageService;
import com.example.projectmaghrebiauser.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class UserController {
@Autowired
private UserRepository userRepository;
    @Autowired
    private UserService userService;

    @Autowired
    private FileStorageService fileStorageService;

    // Add BCryptPasswordEncoder
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<User> registerUser(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("address") String address,
            @RequestParam(value = "role", required = false) Role role,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        if (role == null) {
            role = Role.CUSTOMER;
        }

        User user = new User();
        user.setUsername(username);
        // Encrypt the password before saving
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);
        user.setAddress(address);
        user.setRole(role);

        // Handle file upload
        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.store(file);
            user.setImage(fileName);
        }

        User registeredUser = userService.registerUser(user);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestParam String username, @RequestParam String password) {
        Optional<User> userOptional = userService.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Compare raw password with encrypted password
            if (passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        return userService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    // Get all bookmarked product IDs for a user
    @GetMapping("/{userId}/bookmarks")
    public ResponseEntity<List<Long>> getBookmarkedProducts(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user.getBookmarkedProductIds());
    }

    // Bookmark a product
    @PostMapping("/{userId}/bookmark")
    public ResponseEntity<String> bookmarkProducts(
            @PathVariable Long userId,
            @RequestBody List<Long> productIds) {

        // Fetch user and add bookmarked products
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.getBookmarkedProductIds().addAll(productIds);
        userRepository.save(user);

        return ResponseEntity.ok("Products bookmarked successfully");
    }


    // Unbookmark a product
    @PostMapping("/{userId}/unbookmark")
    public ResponseEntity<Void> removeBookmark(@PathVariable Long userId, @RequestBody Map<String, Long> request) {
        Long productId = request.get("productId");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getBookmarkedProductIds().remove(productId)) {
            userRepository.save(user);
        }
        return ResponseEntity.ok().build();
    }

}