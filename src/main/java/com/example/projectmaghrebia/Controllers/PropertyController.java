package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.FileEntity;
import com.example.projectmaghrebia.Entities.Property;
import com.example.projectmaghrebia.Entities.PropertyDTO;
import com.example.projectmaghrebia.Entities.User;
import com.example.projectmaghrebia.Services.EmailService;
import com.example.projectmaghrebia.Services.FileService;
import com.example.projectmaghrebia.Services.IPropertyService;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.wp.usermodel.Paragraph;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.Document;
import java.io.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/properties")
@CrossOrigin(origins = "http://localhost:4200")
public class PropertyController {

    @Autowired
    private IPropertyService propertyService;
    @Autowired
    private FileService fileService;  // ✅ Use instance instead of static method
    @Autowired
    private EmailService emailService;
    @GetMapping
    public List<PropertyDTO> getAllProperties() {
        List<Property> properties = propertyService.getAllProperties();

        // Debugging: Print all properties fetched from the database
        System.out.println("Fetched properties from DB: " + properties.size());

        // Filter properties for userId = 1
        List<PropertyDTO> filteredProperties = properties.stream()
                .filter(property -> property.getUser() != null && property.getUser().getId() == 1)
                .map(property -> {
                    PropertyDTO dto = new PropertyDTO();
                    dto.setId(property.getId());
                    dto.setAddress(property.getAddress());
                    dto.setPropertyType(property.getPropertyType());
                    dto.setUserId(property.getUser().getId());
                    return dto;
                })
                .collect(Collectors.toList());

        // Debugging: Print filtered properties
        System.out.println("Filtered properties for userId 1: " + filteredProperties.size());
        filteredProperties.forEach(dto -> {
            System.out.println("Property ID: " + dto.getId() + ", Address: " + dto.getAddress() + ", User ID: " + dto.getUserId());
        });

        return filteredProperties;
    }


    @GetMapping("/{id}")
    public Optional<Property> getPropertyById(@PathVariable Long id) {
        return propertyService.getPropertyById(id);
    }

    @PostMapping
    public Property createProperty(@RequestBody Property property) {
        User user = new User();
        user.setId(1L);
        property.setUser(user);
        Property savedProperty = propertyService.saveProperty(property);

        // ✅ Regenerate Excel file after adding a property
        writePropertiesToExcel(propertyService.getAllProperties(), "properties.xlsx");
        emailService.sendPropertyAddedEmail("ayoubmed72@gmail.com", savedProperty);

        return savedProperty;
    }


    private void writePropertiesToExcel(List<Property> properties, String filePath) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Properties");

            // ✅ Create header row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Property ID");
            headerRow.createCell(1).setCellValue("Address");
            headerRow.createCell(2).setCellValue("Property Type");
            headerRow.createCell(3).setCellValue("User ID");

            // ✅ Populate rows with latest DB data
            int rowNum = 1;
            for (Property property : properties) {
                Row newRow = sheet.createRow(rowNum++);
                newRow.createCell(0).setCellValue(property.getId());
                newRow.createCell(1).setCellValue(property.getAddress());
                newRow.createCell(2).setCellValue(property.getPropertyType().toString());
                newRow.createCell(3).setCellValue(property.getUser().getId());
            }

            // ✅ Write to file
            try (FileOutputStream fos = new FileOutputStream(filePath)) {
                workbook.write(fos);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void createNewExcelFile(String filePath, Property property) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Properties");

            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Property ID");
            headerRow.createCell(1).setCellValue("Address");
            headerRow.createCell(2).setCellValue("Property Type");
            headerRow.createCell(3).setCellValue("User ID");

            Row newRow = sheet.createRow(1);
            newRow.createCell(0).setCellValue(property.getId());
            newRow.createCell(1).setCellValue(property.getAddress());
            newRow.createCell(2).setCellValue(property.getPropertyType().toString());
            newRow.createCell(3).setCellValue(property.getUser().getId());

            try (FileOutputStream fos = new FileOutputStream(filePath)) {
                workbook.write(fos);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    @PutMapping("/{id}")
    public Property updateProperty(@PathVariable Long id, @RequestBody Property propertyDetails) {
        return propertyService.updateProperty(id, propertyDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
    }


    @PostMapping("/upload/{propertyId}")
    public ResponseEntity<?> uploadFiles(@PathVariable Long propertyId, @RequestParam("files") MultipartFile[] files) {
        try {
            if (files.length == 0) {
                return ResponseEntity.badRequest().body("No files selected!");
            }

            List<FileEntity> uploadedFiles = new ArrayList<>();
            for (MultipartFile file : files) {
                FileEntity savedFile = fileService.saveFile(propertyId, file);
                if (savedFile != null) {
                    uploadedFiles.add(savedFile);
                }
            }

            if (uploadedFiles.isEmpty()) {
                return ResponseEntity.badRequest().body("Files were not saved.");
            }

            return ResponseEntity.ok("Files uploaded successfully!");
        } catch (Exception e) {
            e.printStackTrace();  // 🔍 Log error
            return ResponseEntity.internalServerError().body("File upload failed.");
        }
    }


    @GetMapping("/{propertyId}/files")
    public ResponseEntity<List<FileEntity>> getPropertyFiles(@PathVariable Long propertyId) {
        List<FileEntity> files = fileService.getFilesByProperty(propertyId); // ✅ Use instance method
        return ResponseEntity.ok(files);
    }


    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportPropertiesToExcel() {
        List<Property> properties = propertyService.getAllProperties();
        String filePath = "properties.xlsx";

        // ✅ Generate updated Excel file
        writePropertiesToExcel(properties, filePath);

        File file = new File(filePath);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        try {
            byte[] fileContent = new FileInputStream(file).readAllBytes();
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=properties.xlsx")
                    .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    .body(fileContent);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
