package com.example.projectmaghrebia.Repositories;

import com.example.projectmaghrebia.Entities.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Long> {
    List<FileEntity> findByPropertyId(Long propertyId);
}
