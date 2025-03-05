package com.example.projectmaghrebia.Repositories;

import com.example.projectmaghrebia.Entities.Category;
import com.example.projectmaghrebia.Entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product,Long> {
    Product findTopByOrderByViewsDesc(); // Fetch the product with the highest views

    List<Product> findByCategory(String category);
    @Query("SELECT p.category FROM Product p WHERE p.idProduct = :id")
    String findCategoryById(@Param("id") Long id);

    @Query("SELECT p.idProduct FROM Product p WHERE p.category = :category")
    List<Long> findProductIdsByCategory(@Param("category") Category category); // Change to Category
}
