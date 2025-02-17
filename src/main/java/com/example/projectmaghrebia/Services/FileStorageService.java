package com.example.projectmaghrebia.Services;

import jakarta.annotation.PostConstruct;
import lombok.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
@Service
public class FileStorageService {

    private final Path fileStoragePath;

    public FileStorageService() {
        this.fileStoragePath = Paths.get("upload-dir").toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(fileStoragePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create upload directory!", ex);
        }
    }

    public String store(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file.");
            }

            // Normalize and clean the filename
            String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

            // Generate unique filename
            String fileName = UUID.randomUUID().toString() + "_" + originalFileName;

            // Check if the file's name contains invalid characters
            if (fileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            // Copy file to the target location
            Path targetLocation = fileStoragePath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;

        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file " + file.getOriginalFilename(), ex);
        }
    }

    public Path getFilePath(String fileName) {
        return fileStoragePath.resolve(fileName);
    }
}