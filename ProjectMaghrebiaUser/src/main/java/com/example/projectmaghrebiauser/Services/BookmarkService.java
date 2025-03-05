package com.example.projectmaghrebiauser.Services;

import com.example.projectmaghrebiauser.Entities.User;
import com.example.projectmaghrebiauser.Repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class BookmarkService {

    private final UserRepository userRepository;

    public BookmarkService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void bookmarkProduct(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getBookmarkedProductIds().contains(productId)) {
            user.getBookmarkedProductIds().add(productId);
            userRepository.save(user);
        }
    }

    public void removeBookmark(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getBookmarkedProductIds().remove(productId)) {
            userRepository.save(user);
        }
    }

    public List<Long> getBookmarkedProductIds(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getBookmarkedProductIds().isEmpty() ? Collections.emptyList() : user.getBookmarkedProductIds();
    }
}
