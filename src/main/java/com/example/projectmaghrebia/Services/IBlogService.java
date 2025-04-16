package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Blog;
import com.example.projectmaghrebia.Entities.Comment;

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
    List<Blog> searchBlogs(String query, String sortBy, String direction);
    // Comment-related methods
    Comment addComment(int blogId, Comment comment);
    Comment approveComment(int commentId);
    Comment declineComment(int commentId);
    List<Comment> getCommentsByBlogId(int blogId, boolean approved);
}
