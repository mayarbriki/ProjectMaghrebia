package com.example.projectmaghrebia.Repositories;

import com.example.projectmaghrebia.Entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByBlogId(int blogId);
    List<Comment> findByBlogIdAndApproved(int blogId, boolean approved);
}