package com.example.projectmaghrebia.Repositories;

import com.example.projectmaghrebia.Entities.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Integer> {
    List<Blog> findByPublishedFalseAndScheduledPublicationDateBefore(LocalDateTime dateTime);
}
