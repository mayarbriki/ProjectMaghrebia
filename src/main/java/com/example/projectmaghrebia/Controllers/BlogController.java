package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.Blog;
import com.example.projectmaghrebia.Entities.BlogType;
import com.example.projectmaghrebia.Services.FileStorageService;
import com.example.projectmaghrebia.Services.IBlogService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    @Autowired
    private IBlogService blogService;

    @Autowired
    private FileStorageService fileStorageService;
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createBlog(
            @RequestParam("title") String title,
            @RequestParam("author") String author,
            @RequestParam("content") String content,
            @RequestParam("type") BlogType type,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "scheduledPublicationDate", required = false)
            @Parameter(description = "Scheduled publication date in ISO-8601 format (e.g., 2025-04-08T10:00:00)", example = "2025-04-08T10:00:00")
            String scheduledDate) {
        try {
            Blog blog = new Blog();
            blog.setTitle(title);
            blog.setAuthor(author);
            blog.setContent(content);
            blog.setType(type);
            blog.setCreatedAt(LocalDateTime.now());

            // Handle scheduled publication date
            if (scheduledDate != null && !scheduledDate.isEmpty()) {
                blog.setScheduledPublicationDate(LocalDateTime.parse(scheduledDate));
                blog.setPublished(false);
            } else {
                blog.setPublished(true); // Publish immediately if no schedule date
            }

            // Handle file upload
            if (file != null && !file.isEmpty()) {
                String fileName = fileStorageService.store(file);
                blog.setImage(fileName);
            }

            return ResponseEntity.ok(blogService.createBlog(blog));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating blog: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateBlog(
            @PathVariable int id,
            @RequestParam("title") String title,
            @RequestParam("author") String author,
            @RequestParam("content") String content,
            @RequestParam("type") BlogType type,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "scheduledPublicationDate", required = false)
            @Parameter(description = "Scheduled publication date in ISO-8601 format (e.g., 2025-04-08T10:00:00)", example = "2025-04-08T10:00:00")
            String scheduledDate) {
        try {
            Optional<Blog> existingBlog = blogService.getBlogById(id);
            if (existingBlog.isEmpty()) {
                return ResponseEntity.status(404).body("Blog not found");
            }

            Blog blog = existingBlog.get();
            blog.setTitle(title);
            blog.setAuthor(author);
            blog.setContent(content);
            blog.setType(type);

            // Handle scheduled publication date
            if (scheduledDate != null && !scheduledDate.isEmpty()) {
                blog.setScheduledPublicationDate(LocalDateTime.parse(scheduledDate));
                blog.setPublished(false);
            }

            // Handle new file upload
            if (file != null && !file.isEmpty()) {
                String fileName = fileStorageService.store(file);
                blog.setImage(fileName);
            }

            return ResponseEntity.ok(blogService.updateBlog(id, blog));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating blog: " + e.getMessage());
        }
    }
    @GetMapping
    public ResponseEntity<List<Blog>> getAllBlogs(
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction) {
        List<Blog> blogs = blogService.getAllBlogsSorted(sortBy, direction);
        blogs.forEach(System.out::println); // Debug: Print the blogs
        return ResponseEntity.ok(blogs);
    }

    // ✅ Get blog by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBlogById(@PathVariable int id) {
        Optional<Blog> blog = blogService.getBlogById(id);
        return blog.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    /*

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateBlog(
            @PathVariable int id,
            @RequestParam("title") String title,
            @RequestParam("author") String author,
            @RequestParam("content") String content,
            @RequestParam("type") BlogType type, // Change to BlogType
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            Optional<Blog> existingBlog = blogService.getBlogById(id);
            if (existingBlog.isEmpty()) {
                return ResponseEntity.status(404).body("Blog not found");
            }

            Blog blog = existingBlog.get();
            blog.setTitle(title);
            blog.setAuthor(author);
            blog.setContent(content);
            blog.setType(type); // Set the BlogType enum directly

            // Handle new file upload
            if (file != null && !file.isEmpty()) {
                String fileName = fileStorageService.store(file);
                blog.setImage(fileName);
            }

            return ResponseEntity.ok(blogService.updateBlog(id, blog));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating blog: " + e.getMessage());
        }
    }*/


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBlog(@PathVariable int id) {
        Optional<Blog> existingBlog = blogService.getBlogById(id);

        if (existingBlog.isEmpty()) {
            return ResponseEntity.status(404).body("Blog not found");
        }

        blogService.deleteBlog(id);
        return ResponseEntity.ok("Blog deleted successfully");
    }
    @GetMapping("/scheduled")
    public ResponseEntity<List<Blog>> getScheduledBlogs() {
        return ResponseEntity.ok(blogService.getScheduledBlogs());
    }

    @GetMapping("/published")
    public ResponseEntity<List<Blog>> getPublishedBlogs() {
        return ResponseEntity.ok(blogService.getPublishedBlogs());
    }
    @PostMapping("/{id}/like")
    public Blog likeBlog(@PathVariable int id) {
        return blogService.likeBlog(id);
    }

    @PostMapping("/{id}/unlike")
    public Blog unlikeBlog(@PathVariable int id) {
        return blogService.unlikeBlog(id);
    }
}
