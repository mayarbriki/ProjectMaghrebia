package com.example.projectmaghrebia.Repositories;

import com.example.projectmaghrebia.Entities.Property;
import com.example.projectmaghrebia.Entities.PropertyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByType(PropertyType type);
    List<Property> findByFullNameContaining(String name);
    List<Property> findByBusinessNameContaining(String businessName);
}