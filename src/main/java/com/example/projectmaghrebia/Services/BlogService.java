package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Blog;
import com.example.projectmaghrebia.Repositories.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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
}
