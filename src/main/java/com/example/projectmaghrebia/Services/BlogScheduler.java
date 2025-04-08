package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Blog;
import com.example.projectmaghrebia.Repositories.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class BlogScheduler {

    @Autowired
    private BlogRepository blogRepository;

    // Runs every minute
    @Scheduled(cron = "0 * * * * *")
    public void publishScheduledBlogs() {
        List<Blog> scheduledBlogs = blogRepository.findByPublishedFalseAndScheduledPublicationDateBefore(LocalDateTime.now());

        for (Blog blog : scheduledBlogs) {
            blog.setPublished(true);
            blogRepository.save(blog);
        }
    }
}