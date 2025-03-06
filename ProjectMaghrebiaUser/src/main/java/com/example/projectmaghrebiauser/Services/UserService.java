package com.example.projectmaghrebiauser.Services;

import com.example.projectmaghrebiauser.Entities.User;
import com.example.projectmaghrebiauser.Repositories.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class UserService implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User registerUser(User user) {
        // Directly save the password without encoding (NOT SECURE)
        return userRepository.save(user);
    }

    @Override
    public Optional<User> authenticateUser(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        return userOptional.filter(user -> user.getPassword().equals(password)); // Plain-text password check
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    // Generate and save a coupon for the user
    public String generateCoupon(User user, double discountAmount) {
        String couponCode = "DISCOUNT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Add coupon details to the parallel lists
        user.getCouponCodes().add(couponCode);
        user.getCouponDiscountAmounts().add(discountAmount);
        user.getCouponUsedStatuses().add(false);
        user.setAccountBalance(user.getAccountBalance() + discountAmount);
        userRepository.save(user);
        return couponCode;
    }

    // Validate and use a coupon
    public boolean useCoupon(User user, String couponCode) {
        int index = user.getCouponCodes().indexOf(couponCode);
        if (index == -1) {
            return false; // Coupon not found
        }

        if (user.getCouponUsedStatuses().get(index)) {
            return false; // Coupon already used
        }

        user.getCouponUsedStatuses().set(index, true);
        userRepository.save(user);
        return true;
    }

    // Get the discount amount for a coupon (if valid)
    public Double getDiscountAmount(User user, String couponCode) {
        int index = user.getCouponCodes().indexOf(couponCode);
        if (index == -1 || user.getCouponUsedStatuses().get(index)) {
            return 0.0; // Coupon not found or already used
        }

        return user.getCouponDiscountAmounts().get(index);
    }
}
