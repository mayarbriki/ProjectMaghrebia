package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Blog;
import com.example.projectmaghrebia.Repositories.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BlogService implements IBlogService {

    @Autowired
    private BlogRepository blogRepository;

    @Override
    public Blog createBlog(Blog blog) {
        return blogRepository.save(blog);
    }

    @Override
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    @Override
    public Optional<Blog> getBlogById(int id) {
        return blogRepository.findById(id);
    }

    @Override
    public Blog updateBlog(int id, Blog blogDetails) {
        return blogRepository.findById(id).map(blog -> {
            blog.setTitle(blogDetails.getTitle());
            blog.setAuthor(blogDetails.getAuthor());
            blog.setContent(blogDetails.getContent());
            blog.setType(blogDetails.getType());
            blog.setImage(blogDetails.getImage());
            return blogRepository.save(blog);
        }).orElseThrow(() -> new RuntimeException("Blog not found with id " + id));
    }

    @Override
    public void deleteBlog(int id) {
        blogRepository.deleteById(id);
    }
    public List<Blog> getScheduledBlogs() {
        return blogRepository.findByPublishedFalseAndScheduledPublicationDateBefore(LocalDateTime.now());
    }

    public List<Blog> getPublishedBlogs() {
        return blogRepository.findAll().stream()
                .filter(Blog::isPublished)
                .collect(Collectors.toList());
    }
    @Override
    public Blog likeBlog(int id) {
        Optional<Blog> blogOpt = blogRepository.findById(id);
        if (blogOpt.isEmpty()) {
            throw new RuntimeException("Blog not found");
        }
        Blog blog = blogOpt.get();
        blog.setLikes(blog.getLikes() + 1); // Increment directly, no null check needed
        return blogRepository.save(blog);
    }

    @Override
    public Blog unlikeBlog(int id) {
        Optional<Blog> blogOpt = blogRepository.findById(id);
        if (blogOpt.isEmpty()) {
            throw new RuntimeException("Blog not found");
        }
        Blog blog = blogOpt.get();
        blog.setLikes(Math.max(0, blog.getLikes() - 1)); // Decrement, but not below 0
        return blogRepository.save(blog);
    }
    @Override
    public List<Blog> getAllBlogsSorted(String sortBy, String direction) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        return blogRepository.findAll(sort);
    }
    @Override
    public Map<String, Object> getBlogStatistics() {
        // Get all published blogs
        List<Blog> publishedBlogs = getPublishedBlogs();

        // Total published blogs
        long totalPublishedBlogs = publishedBlogs.size();

        // Average likes
        double averageLikes = publishedBlogs.isEmpty() ? 0.0 :
                publishedBlogs.stream()
                        .mapToInt(Blog::getLikes)
                        .average()
                        .orElse(0.0);

        // Most liked blog
        Map<String, Object> mostLikedBlog = null;
        if (!publishedBlogs.isEmpty()) {
            Blog maxBlog = publishedBlogs.stream()
                    .max((b1, b2) -> Integer.compare(b1.getLikes(), b2.getLikes()))
                    .orElse(null);
            if (maxBlog != null) {
                mostLikedBlog = new HashMap<>();
                mostLikedBlog.put("id", maxBlog.getId());
                mostLikedBlog.put("title", maxBlog.getTitle());
                mostLikedBlog.put("likes", maxBlog.getLikes());
            }
        }

        // Build the response map
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalPublishedBlogs", totalPublishedBlogs);
        statistics.put("averageLikes", Math.round(averageLikes * 10) / 10.0);
        statistics.put("mostLikedBlog", mostLikedBlog);

        return statistics;
    }
    @Override
    public List<Blog> searchBlogs(String query, String sortBy, String direction) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        return blogRepository.searchBlogs(query, sort);
    }
}
