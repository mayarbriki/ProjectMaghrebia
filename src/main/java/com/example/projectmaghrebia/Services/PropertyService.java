package com.example.projectmaghrebia.Services;
import com.example.projectmaghrebia.Entities.Property;
import com.example.projectmaghrebia.Entities.PropertyImage;
import com.example.projectmaghrebia.Entities.PropertyType;
import com.example.projectmaghrebia.Repositories.PropertyImageRepository;
import com.example.projectmaghrebia.Repositories.PropertyRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PropertyImageRepository imageRepository;


    @Value("${file.upload-dir}")
    private String uploadDir;

    // Get all properties
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    // Get properties by type
    public List<Property> getPropertiesByType(PropertyType type) {
        return propertyRepository.findByType(type);
    }

    // Get property by ID
    public Optional<Property> getPropertyById(Long id) {
        return propertyRepository.findById(id);
    }

    // Delete property
    @Transactional
    public void deleteProperty(Long id) {
        Optional<Property> property = propertyRepository.findById(id);

        if (property.isPresent()) {
            // Delete image files from the file system
            for (PropertyImage image : property.get().getImages()) {
                try {
                    Files.deleteIfExists(Paths.get(image.getFilePath()));
                } catch (IOException e) {
                    // Log error but continue
                    System.err.println("Failed to delete image file: " + image.getFilePath());
                }
            }

            // Delete from database
            propertyRepository.deleteById(id);
        }
    }

    // Helper method to update property fields based on type
    private void updatePropertyFields(Property existingProperty, Property propertyDetails) {
        existingProperty.setName(propertyDetails.getName());
        existingProperty.setDescription(propertyDetails.getDescription());
        existingProperty.setEstimatedValue(propertyDetails.getEstimatedValue());

        // Update address fields
        existingProperty.setAddressLine1(propertyDetails.getAddressLine1());
        existingProperty.setAddressLine2(propertyDetails.getAddressLine2());
        existingProperty.setCity(propertyDetails.getCity());
        existingProperty.setState(propertyDetails.getState());
        existingProperty.setPostalCode(propertyDetails.getPostalCode());
        existingProperty.setCountry(propertyDetails.getCountry());

        // Update type-specific fields based on the property type
        switch (existingProperty.getType()) {
            case CAR:
                existingProperty.setMake(propertyDetails.getMake());
                existingProperty.setModel(propertyDetails.getModel());
                existingProperty.setYear(propertyDetails.getYear());
                existingProperty.setLicensePlate(propertyDetails.getLicensePlate());
                existingProperty.setVin(propertyDetails.getVin());
                break;
            case RESIDENCE:
                existingProperty.setSquareFootage(propertyDetails.getSquareFootage());
                existingProperty.setYearBuilt(propertyDetails.getYearBuilt());
                existingProperty.setConstructionType(propertyDetails.getConstructionType());
                break;
            case LIFE:
                existingProperty.setFullName(propertyDetails.getFullName());
                existingProperty.setDateOfBirth(propertyDetails.getDateOfBirth());
                existingProperty.setOccupation(propertyDetails.getOccupation());
                existingProperty.setSmoker(propertyDetails.getSmoker());
                break;
            case TRAVEL:
                existingProperty.setDestination(propertyDetails.getDestination());
                existingProperty.setDepartureDate(propertyDetails.getDepartureDate());
                existingProperty.setReturnDate(propertyDetails.getReturnDate());
                existingProperty.setTravelPurpose(propertyDetails.getTravelPurpose());
                break;
            case COMMERCIAL:
                existingProperty.setBusinessName(propertyDetails.getBusinessName());
                existingProperty.setBusinessType(propertyDetails.getBusinessType());
                existingProperty.setNumberOfEmployees(propertyDetails.getNumberOfEmployees());
                existingProperty.setAnnualRevenue(propertyDetails.getAnnualRevenue());
                break;
        }
    }

    // Helper method to upload images
// Helper method to upload images
    @Transactional
    public List<PropertyImage> uploadPropertyImages(List<MultipartFile> images, Long propertyId) {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);
        List<PropertyImage> imageList = new ArrayList<>();

        if (propertyOpt.isPresent()) {
            Property property = propertyOpt.get();

            String UPLOAD_DIR = "uploads/";

            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs(); // Ensure directory exists
            }

            for (MultipartFile file : images) {
                try {
                    // Save file with a unique name
                    String originalFilename = file.getOriginalFilename();
                    String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    String fileName = UUID.randomUUID().toString() + fileExtension;

                    Path filePath = Paths.get(UPLOAD_DIR, fileName);
                    Files.write(filePath, file.getBytes());

                    // Create a new PropertyImage
                    PropertyImage propertyImage = new PropertyImage();
                    propertyImage.setFileName(fileName);
                    propertyImage.setFileType(file.getContentType());
                    propertyImage.setFilePath(filePath.toString());
                    propertyImage.setProperty(property);

                    // Save the image
                    PropertyImage savedImage = imageRepository.save(propertyImage);
                    imageList.add(savedImage);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        return imageList;
    }

    // Update the createProperty method to use the uploadPropertyImages method
    @Transactional
    public Property createProperty(Property property, List<MultipartFile> images) throws IOException {
        // Save the property first to get the ID
        Property savedProperty = propertyRepository.save(property);

        // Process images if any
        if (images != null && !images.isEmpty()) {
            List<PropertyImage> propertyImages = uploadPropertyImages(images, savedProperty.getId());
            savedProperty.setImages(propertyImages);
        }

        return propertyRepository.save(savedProperty);
    }

    // Update the updateProperty method to use the uploadPropertyImages method
    @Transactional
    public Property updateProperty(Long id, Property propertyDetails, List<MultipartFile> newImages) throws IOException {
        Optional<Property> optionalProperty = propertyRepository.findById(id);

        if (optionalProperty.isPresent()) {
            Property existingProperty = optionalProperty.get();

            // Update fields based on property type
            updatePropertyFields(existingProperty, propertyDetails);

            // Process new images if any
            if (newImages != null && !newImages.isEmpty()) {
                List<PropertyImage> propertyImages = uploadPropertyImages(newImages, id);
                existingProperty.getImages().addAll(propertyImages);
            }

            return propertyRepository.save(existingProperty);
        }

        return null; // Or throw exception for not found
    }

    // Method to get property with images
    public Optional<Property> getPropertyWithImages(Long id) {
        return propertyRepository.findById(id);
    }

    // Method to get image by ID
    public ResponseEntity<byte[]> getImageById(Long imageId) {
        Optional<PropertyImage> imageOpt = imageRepository.findById(imageId);

        if (imageOpt.isPresent()) {
            PropertyImage image = imageOpt.get();
            try {
                byte[] imageData = Files.readAllBytes(Paths.get(image.getFilePath()));

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(image.getFileType()))
                        .body(imageData);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        return ResponseEntity.notFound().build();
    }

    // Method to delete an image
    @Transactional
    public void deleteImage(Long imageId) throws IOException {
        Optional<PropertyImage> optionalImage = imageRepository.findById(imageId);

        if (optionalImage.isPresent()) {
            PropertyImage image = optionalImage.get();

            // Delete the physical file
            Files.deleteIfExists(Paths.get(image.getFilePath()));

            // Remove from property's images collection
            Property property = image.getProperty();
            if (property != null) {
                property.getImages().remove(image);
                propertyRepository.save(property);
            }

            // Delete from database
            imageRepository.deleteById(imageId);
        }
    }
}