package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.Property;
import com.example.projectmaghrebia.Entities.PropertyImage;
import com.example.projectmaghrebia.Entities.PropertyType;
import com.example.projectmaghrebia.Services.PropertyService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins ={"http://192.168.1.12:4200", "http://localhost:4200"}, allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;



    // Create property with images
    @PostMapping
    public ResponseEntity<?> createProperty(
            @RequestPart("property") String propertyJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        try {
            System.out.println("Received Property JSON: " + propertyJson); // Debugging
            System.out.println("Received Images: " + (images != null ? images.size() : "No images"));

            ObjectMapper objectMapper = new ObjectMapper();
            Property property = objectMapper.readValue(propertyJson, Property.class); // Convert JSON to Object
            Property createdProperty = propertyService.createProperty(property, images);
            return new ResponseEntity<>(createdProperty, HttpStatus.CREATED);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to process request: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // Get all properties
    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties() {
        List<Property> properties = propertyService.getAllProperties();
        return new ResponseEntity<>(properties, HttpStatus.OK);
    }

    // Get properties by type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Property>> getPropertiesByType(@PathVariable PropertyType type) {
        List<Property> properties = propertyService.getPropertiesByType(type);
        return new ResponseEntity<>(properties, HttpStatus.OK);
    }

    // Get property by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPropertyById(@PathVariable Long id) {
        Optional<Property> property = propertyService.getPropertyById(id);

        if (property.isPresent()) {
            return new ResponseEntity<>(property.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Property not found with ID: " + id, HttpStatus.NOT_FOUND);
        }
    }

    // Update property
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProperty(
            @PathVariable Long id,
            @RequestPart("property") Property propertyDetails,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        try {
            Property updatedProperty = propertyService.updateProperty(id, propertyDetails, images);

            if (updatedProperty != null) {
                return new ResponseEntity<>(updatedProperty, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Property not found with ID: " + id, HttpStatus.NOT_FOUND);
            }
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to update property: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete property
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProperty(@PathVariable Long id) {
        try {
            propertyService.deleteProperty(id);
            return new ResponseEntity<>("Property deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete property: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Upload images to an existing property
    @PostMapping("/{id}/images")
    public ResponseEntity<?> uploadImagesToProperty(
            @PathVariable Long id,
            @RequestParam("images") List<MultipartFile> images) {
        try {
            Optional<Property> propertyOpt = propertyService.getPropertyById(id);
            if (!propertyOpt.isPresent()) {
                return new ResponseEntity<>("Property not found with ID: " + id, HttpStatus.NOT_FOUND);
            }

            List<PropertyImage> uploadedImages = propertyService.uploadPropertyImages(images, id);
            return new ResponseEntity<>(uploadedImages, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to upload images: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get image by ID
    @GetMapping("/images/{imageId}")
    public ResponseEntity<?> getImage(@PathVariable Long imageId) {
        return propertyService.getImageById(imageId);
    }

    // Get all images for a property
    @GetMapping("/{id}/images")
    public ResponseEntity<?> getPropertyImages(@PathVariable Long id) {
        Optional<Property> propertyOpt = propertyService.getPropertyById(id);

        if (propertyOpt.isPresent()) {
            List<PropertyImage> images = propertyOpt.get().getImages();
            return new ResponseEntity<>(images, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Property not found with ID: " + id, HttpStatus.NOT_FOUND);
        }
    }

    // Delete image
    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<?> deleteImage(@PathVariable Long imageId) {
        try {
            propertyService.deleteImage(imageId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Image deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IOException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to delete image: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/export/excel")
    public void exportPropertiesToExcel(HttpServletResponse response) {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        String fileName = "properties.xlsx";
        response.setHeader("Content-Disposition", "attachment; filename=" + fileName);

        List<Property> properties = propertyService.getAllProperties();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Properties");

            // Create header row
            int rowCount = 0;
            Row headerRow = sheet.createRow(rowCount++);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Name");
            headerRow.createCell(2).setCellValue("Type");
            headerRow.createCell(3).setCellValue("Description");
            headerRow.createCell(4).setCellValue("Estimated Value");
            headerRow.createCell(5).setCellValue("Images Count");

            // Populate rows with property data
            for (Property property : properties) {
                Row row = sheet.createRow(rowCount++);
                row.createCell(0).setCellValue(property.getId());
                row.createCell(1).setCellValue(property.getName());
                row.createCell(2).setCellValue(property.getType().toString());
                row.createCell(3).setCellValue(property.getDescription());
                // Assuming estimatedValue is a numeric type; adjust if needed
                row.createCell(4).setCellValue(property.getEstimatedValue().doubleValue());
                row.createCell(5).setCellValue(property.getImages() != null ? property.getImages().size() : 0);
            }

            // Optionally auto-size columns for better readability
            for (int i = 0; i < 6; i++) {
                sheet.autoSizeColumn(i);
            }

            // Write workbook to response output stream
            workbook.write(response.getOutputStream());
        } catch (IOException e) {
            // Log exception and handle error response if needed
            e.printStackTrace();
        }
    }
}
