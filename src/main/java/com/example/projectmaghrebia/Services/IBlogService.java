package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Blog;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface IBlogService {
    Blog createBlog(Blog blog);
    List<Blog> getAllBlogs();
    Optional<Blog> getBlogById(int id);
    Blog updateBlog(int id, Blog blogDetails);
    void deleteBlog(int id);
    public List<Blog> getScheduledBlogs() ;
    public List<Blog> getPublishedBlogs() ;
    Blog likeBlog(int id); // New method
    Blog unlikeBlog(int id); // New method
    List<Blog> getAllBlogsSorted(String sortBy, String direction); // New method for sorting
    Map<String, Object> getBlogStatistics(); // Updated to return a Map
    }
