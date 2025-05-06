package com.example.projectmaghrebiauser.Controllers;

import com.example.projectmaghrebiauser.Entities.Role;
import com.example.projectmaghrebiauser.Entities.User;
import com.example.projectmaghrebiauser.Repositories.UserRepository;
import com.example.projectmaghrebiauser.Services.FileStorageService;
import com.example.projectmaghrebiauser.Services.UserService;
import com.example.projectmaghrebiauser.Services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.MessagingException;
import java.util.*;
import java.util.stream.Collectors;

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

    @Autowired
    private EmailService emailService;

    private final RestTemplate restTemplate = new RestTemplate();

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Value("${product.service.url:http://localhost:6060/api}")
    private String PRODUCT_SERVICE_URL;

    private static final List<Long> POPULAR_PRODUCT_IDS = Arrays.asList(10L, 11L, 12L);

    @GetMapping("/{userId}/balance")
    public ResponseEntity<Double> getUserBalance(@PathVariable Long userId) {
        return userService.findById(userId)
                .map(user -> ResponseEntity.ok(user.getAccountBalance()))
                .orElse(ResponseEntity.notFound().build());
    }

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
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);
        user.setAddress(address);
        user.setRole(role);

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

    @GetMapping("/{userId}/bookmarks")
    public ResponseEntity<List<Long>> getBookmarkedProducts(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user.getBookmarkedProductIds());
    }

    @PostMapping("/{userId}/bookmark")
    public ResponseEntity<String> bookmarkProducts(
            @PathVariable Long userId,
            @RequestBody List<Long> productIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Add product IDs to the user's bookmarked list
        user.getBookmarkedProductIds().addAll(productIds);

        // Fetch product categories from the product service
        for (Long productId : productIds) {
            String url = PRODUCT_SERVICE_URL + "/" + productId;
            try {
                ResponseEntity<ProductDTO> response = restTemplate.getForEntity(url, ProductDTO.class);
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    ProductDTO product = response.getBody();
                    String category = product.getCategory(); // Assuming category is a string or enum name
                    if (category != null) {
                        user.setCategory(category); // Set the single category field (most recent)
                        user.getBookmarkedServiceCategories().add(category);
                    } else {
                        System.err.println("Category not found for product ID: " + productId);
                    }
                } else {
                    System.err.println("Failed to fetch product details for product ID: " + productId);
                }
            } catch (Exception e) {
                System.err.println("Error fetching product details for product ID: " + productId + " - " + e.getMessage());
            }
        }

        userRepository.save(user);
        return ResponseEntity.ok("Products bookmarked successfully");
    }

    @PostMapping("/{userId}/unbookmark")
    public ResponseEntity<Void> removeBookmark(@PathVariable Long userId, @RequestBody Map<String, Long> request) {
        Long productId = request.get("productId");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find the index of the product ID in the bookmarked list
        int index = user.getBookmarkedProductIds().indexOf(productId);
        if (index != -1) {
            // Remove the product ID
            user.getBookmarkedProductIds().remove(index);
            // Remove the corresponding category
            if (index < user.getBookmarkedServiceCategories().size()) {
                user.getBookmarkedServiceCategories().remove(index);
            }
        }

        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/suggestions")
    public ResponseEntity<List<Long>> getProductSuggestions(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Long> bookmarkedIds = user.getBookmarkedProductIds();
        if (bookmarkedIds.isEmpty()) {
            System.out.println("Hey " + user.getUsername() + "! Bookmark some insurance plans to unlock magical suggestions!");
            return ResponseEntity.ok(Collections.emptyList());
        }

        String url = PRODUCT_SERVICE_URL + "/suggestions?bookmarkedIds=" + String.join(",",
                bookmarkedIds.stream().map(String::valueOf).toArray(String[]::new)) + "&includeWildCard=true";
        ResponseEntity<SuggestionResponse> response;
        try {
            System.out.println("Calling Product service at: " + url);
            response = restTemplate.getForEntity(url, SuggestionResponse.class);
            System.out.println("Received response from Product service: " + response.getBody());
        } catch (Exception e) {
            System.err.println("Failed to fetch suggestions from Product service for user " + user.getUsername() + ": " + e.getMessage());
            String[] errorMessages = {
                    "Oops, " + user.getUsername() + "! Our suggestion crystal ball is cloudy—try again later!",
                    "Oh no, " + user.getUsername() + "! The suggestion spirits are napping—check back soon!",
                    "Alas, " + user.getUsername() + "! The magic mirror of suggestions is foggy—let’s try again later!"
            };
            String errorMessage = errorMessages[new Random().nextInt(errorMessages.length)];
            System.out.println(errorMessage);

            List<Long> fallbackSuggestions = POPULAR_PRODUCT_IDS.stream()
                    .filter(id -> !bookmarkedIds.contains(id))
                    .limit(3)
                    .collect(Collectors.toList());

            if (!fallbackSuggestions.isEmpty()) {
                String[] magicMessages = {
                        "But wait, " + user.getUsername() + "! Here’s a sprinkle of magic—try these popular picks instead!",
                        "Fear not, " + user.getUsername() + "! The wizards have conjured some popular plans for you!",
                        "Behold, " + user.getUsername() + "! The enchanted vault opens with these timeless picks!"
                };
                System.out.println(magicMessages[new Random().nextInt(magicMessages.length)]);
            } else {
                System.out.println("Looks like you’ve already explored our popular picks, " + user.getUsername() + "! Stay tuned for more!");
            }

            return ResponseEntity.ok(fallbackSuggestions);
        }

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            System.out.println("Hmmm, " + user.getUsername() + ", we couldn’t find any suggestions this time—keep exploring!");
            return ResponseEntity.ok(Collections.emptyList());
        }

        SuggestionResponse suggestionResponse = response.getBody();
        List<Long> suggestions = suggestionResponse.getSuggestedProductIds();
        String topCategory = suggestionResponse.getTopCategory();

        if (suggestions == null || suggestions.isEmpty() || topCategory == null) {
            System.out.println("No valid suggestions received for " + user.getUsername() + ", falling back to popular picks.");
            List<Long> fallbackSuggestions = POPULAR_PRODUCT_IDS.stream()
                    .filter(id -> !bookmarkedIds.contains(id))
                    .limit(3)
                    .collect(Collectors.toList());

            if (!fallbackSuggestions.isEmpty()) {
                System.out.println("But wait, " + user.getUsername() + "! Here’s a sprinkle of magic—try these popular picks instead!");
            } else {
                System.out.println("Looks like you’ve already explored our popular picks, " + user.getUsername() + "! Stay tuned for more!");
            }

            return ResponseEntity.ok(fallbackSuggestions);
        }

        String[] funMessages = {
                "Greetings, " + user.getUsername() + "! The winds whisper you adore " + topCategory + "—feast your eyes on these treasures!",
                "Oh, " + user.getUsername() + "! Your love for " + topCategory + " shines bright—here’s some enchanted picks for you!",
                "Dear " + user.getUsername() + ", the stars align with " + topCategory + "—discover these magical insurance plans!"
        };
        String message = funMessages[new Random().nextInt(funMessages.length)];
        System.out.println(message);

        return ResponseEntity.ok(suggestions);
    }

    @PostMapping("/{userId}/send-product-email")
    public ResponseEntity<String> sendProductEmail(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) throws MessagingException {
        String productName = request.get("productName");
        String productDescription = request.get("productDescription");

        if (productName == null || productDescription == null) {
            return ResponseEntity.status(400).body("Product name and description are required");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        double discountAmount = 10.0;
        String couponCode = userService.generateCoupon(user, discountAmount);

        try {
            emailService.sendProductEmail(
                    user.getEmail(),
                    productName,
                    productDescription,
                    couponCode,
                    discountAmount
            );
        } catch (MessagingException e) {
            return ResponseEntity.status(500).body("Failed to send email: " + e.getMessage());
        }

        return ResponseEntity.ok("Product details and coupon sent to " + user.getEmail());
    }

    @PostMapping("/{userId}/apply-coupon")
    public ResponseEntity<Map<String, Object>> applyCoupon(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        String couponCode = request.get("couponCode");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isValid = userService.useCoupon(user, couponCode);
        if (!isValid) {
            return ResponseEntity.status(400).body(Map.of("message", "Invalid or already used coupon"));
        }

        double discountAmount = userService.getDiscountAmount(user, couponCode);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Coupon applied successfully");
        response.put("discountAmount", discountAmount);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{userId}/share-product")
    public ResponseEntity<String> shareProduct(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) throws MessagingException {
        String productName = request.get("productName");
        String productDescription = request.get("productDescription");
        String recipientEmail = request.get("recipientEmail");

        if (productName == null || productDescription == null || recipientEmail == null) {
            return ResponseEntity.status(400).body("Product name, description, and recipient email are required");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        emailService.sendReferralEmail(
                recipientEmail,
                user.getUsername(),
                productName,
                productDescription
        );

        double discountPercentage = 10.0;
        String couponCode = userService.generateCoupon(user, discountPercentage);

        double baseAmount = 100.0;
        double discountAmount = (discountPercentage / 100.0) * baseAmount;

        emailService.sendProductEmail(
                user.getEmail(),
                productName,
                productDescription,
                couponCode,
                discountPercentage
        );

        return ResponseEntity.ok(
                String.format(
                        "Product shared successfully with %s, a coupon has been sent to %s, and $%.2f has been added to your account balance (new balance: $%.2f).",
                        recipientEmail,
                        user.getEmail(),
                        discountAmount,
                        user.getAccountBalance()
                )
        );
    }

    private static class SuggestionResponse {
        private List<Long> suggestedProductIds;
        private String topCategory;

        public List<Long> getSuggestedProductIds() {
            return suggestedProductIds;
        }

        public void setSuggestedProductIds(List<Long> suggestedProductIds) {
            this.suggestedProductIds = suggestedProductIds;
        }

        public String getTopCategory() {
            return topCategory;
        }

        public void setTopCategory(String topCategory) {
            this.topCategory = topCategory;
        }

        @Override
        public String toString() {
            return "SuggestionResponse{suggestedProductIds=" + suggestedProductIds + ", topCategory='" + topCategory + "'}";
        }
    }

    // DTO to deserialize product response from product service
    private static class ProductDTO {
        private Long idProduct;
        private String category; // Assuming category is serialized as a string
        private String description;
        private String name;
        private String fileName;
        private Double price;
        private Long views;

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        // Add getters and setters for other fields as needed
    }
}