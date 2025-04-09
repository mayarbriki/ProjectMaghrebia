package com.example.projectmaghrebia.Repositories;

import com.example.projectmaghrebia.Entities.Blog;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Integer> {
    List<Blog> findByPublishedFalseAndScheduledPublicationDateBefore(LocalDateTime dateTime);
    List<Blog> findAll(Sort sort); // Added for sorted retrieval
    @Query("SELECT b FROM Blog b WHERE " +
            "LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.content) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.type) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.image) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "CAST(b.id AS string) LIKE CONCAT('%', :query, '%') OR " +
            "CAST(b.createdAt AS string) LIKE CONCAT('%', :query, '%') OR " +
            "CAST(b.scheduledPublicationDate AS string) LIKE CONCAT('%', :query, '%') OR " +
            "CAST(b.published AS string) LIKE CONCAT('%', :query, '%') OR " +
            "CAST(b.likes AS string) LIKE CONCAT('%', :query, '%')")
    List<Blog> searchBlogs(@Param("query") String query, Sort sort);
}
