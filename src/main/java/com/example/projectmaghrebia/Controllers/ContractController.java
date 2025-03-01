package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.Contract;
import com.example.projectmaghrebia.Services.IContractService;
import com.example.projectmaghrebia.Services.PDFService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/contracts")
public class ContractController {

    @Autowired
    private IContractService contractService;

    @Autowired
    private PDFService pdfService;  // Inject PDF generation service

    public ContractController(IContractService contractService) {
        this.contractService = contractService;
    }

    // ✅ Get all contracts
    @GetMapping
    @Operation(summary = "Get all contracts", description = "Returns a list of all contracts")
    public ResponseEntity<List<Contract>> getAllContracts() {
        List<Contract> contracts = contractService.getAllContracts();
        return ResponseEntity.ok(contracts);
    }

    // ✅ Generate & Download Contract PDF (Only One Copy)
    @GetMapping("/{id}/pdf")
    @Operation(summary = "Generate Contract PDF", description = "Generates a PDF contract document for download")
    public ResponseEntity<byte[]> downloadContractPDF(@PathVariable Long id) {
        Optional<Contract> contractOptional = contractService.getContractById(id);

        if (contractOptional.isEmpty()) {
            return ResponseEntity.status(404).body(null);
        }

        Contract contract = contractOptional.get();
        try {
            byte[] pdfContent = pdfService.generateContractPDF(contract);  // ✅ Now correctly receives byte[]

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=contract_" + id + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfContent);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // ✅ Create a new contract
    @PostMapping

    public ResponseEntity<?> createContract(@RequestBody Contract contract) {
        System.out.println("Received contract: " + contract); // ✅ Log incoming request
        Contract savedContract = contractService.createContract(contract);
        return ResponseEntity.ok(savedContract);
    }

    // ✅ Update contract
    @PutMapping("/{id}")
    @Operation(summary = "Update a contract", description = "Updates an existing contract by ID")
    public ResponseEntity<?> updateContract(@PathVariable Long id, @Valid @RequestBody Contract contractDetails) {
        Optional<Contract> existingContract = contractService.getContractById(id);

        if (existingContract.isPresent()) {
            Contract updatedContract = contractService.updateContract(id, contractDetails);
            return ResponseEntity.ok(updatedContract);
        } else {
            return ResponseEntity.status(404).body("{\"message\": \"Contract not found\", \"id\": " + id + "}");
        }
    }

    // ✅ Delete contract
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a contract", description = "Deletes a contract by its ID")
    public ResponseEntity<?> deleteContract(@PathVariable Long id) {
        Optional<Contract> existingContract = contractService.getContractById(id);

        if (existingContract.isPresent()) {
            contractService.deleteContract(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(404).body("{\"message\": \"Contract not found\", \"id\": " + id + "}");
        }
    }
}
