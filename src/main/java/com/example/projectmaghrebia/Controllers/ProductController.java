package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.Category;
import com.example.projectmaghrebia.Entities.Product;
import com.example.projectmaghrebia.Repositories.ProductRepository;
import com.example.projectmaghrebia.Services.FileStorageService;
import com.example.projectmaghrebia.Services.IProductService;
import com.example.projectmaghrebia.Services.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private IProductService productService;

    @Autowired
    private ProductService ProductService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        String baseUrl = "http://localhost:6060/upload-dir/";
        products.forEach(product -> {
            if (product.getFileName() != null && !product.getFileName().isEmpty()) {
                product.setFileName(baseUrl + product.getFileName());
            }
        });
        return ResponseEntity.ok().body(products);
    }

    @GetMapping("/products/{id:\\d+}") // Add regex to match only numeric IDs
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> productOptional = productService.getProductById(id);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            String baseUrl = "http://localhost:6060/upload-dir/";
            if (product.getFileName() != null && !product.getFileName().isEmpty()) {
                product.setFileName(baseUrl + product.getFileName());
            }
            return ResponseEntity.ok(product);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping(value = "/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
            summary = "Create a new product",
            description = "Creates a new product with an optional image file",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Product created successfully"),
                    @ApiResponse(responseCode = "400", description = "Invalid input")
            }
    )
    public ResponseEntity<Product> createProduct(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("category") Category category,
            @RequestParam("description") String description,
            @RequestParam("name") String name,
            @RequestParam("price") Double price) {
        Product product = new Product();
        product.setCategory(category);
        product.setDescription(description);
        product.setName(name);
        product.setPrice(price);

        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.store(file);
            product.setFileName(fileName);
        }

        return ResponseEntity.ok(productService.createProduct(product));
    }

    @PutMapping(value = "/products/{id:\\d+}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE) // Add regex
    @Operation(
            summary = "Update a product",
            description = "Updates an existing product by ID with an optional image file",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Product updated successfully"),
                    @ApiResponse(responseCode = "404", description = "Product not found"),
                    @ApiResponse(responseCode = "400", description = "Invalid input")
            }
    )
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("category") Category category,
            @RequestParam("description") String description,
            @RequestParam("name") String name,
            @RequestParam("price") Double price) {
        Product productDetails = new Product();
        productDetails.setCategory(category);
        productDetails.setDescription(description);
        productDetails.setName(name);
        productDetails.setPrice(price);

        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.store(file);
            productDetails.setFileName(fileName);
        }

        return ResponseEntity.ok(productService.updateProduct(id, productDetails));
    }

    @DeleteMapping("/products/{id:\\d+}") // Add regex
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    @PostMapping("/products/{id:\\d+}/increment-views") // Add regex
    public ResponseEntity<Product> incrementViews(@PathVariable Long id) {
        try {
            Product updatedProduct = ProductService.incrementViews(id);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/products/most-viewed")
    public ResponseEntity<List<Product>> getMostViewedProducts() {
        List<Product> mostViewedProducts = ProductService.getMostViewedProducts();        if
        (mostViewedProducts != null) {
            return ResponseEntity.ok(mostViewedProducts);        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/products/search")
    @Operation(
            summary = "Search products",
            description = "Search products by name, description, or category",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Products found"),
                    @ApiResponse(responseCode = "400", description = "Invalid search query")
            }
    )
    public ResponseEntity<List<Product>> searchProducts(@RequestParam("query") String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<Product> products = productService.searchProducts(query);
        String baseUrl = "http://localhost:6060/upload-dir/";
        products.forEach(product -> {
            if (product.getFileName() != null && !product.getFileName().isEmpty()) {
                product.setFileName(baseUrl + product.getFileName());
            }
        });
        return ResponseEntity.ok(products);
    }
    @PostMapping("/products/sort")
    public ResponseEntity<List<Product>> sortProducts(
            @RequestBody List<Product> products,
            @RequestParam(value = "sortBy", defaultValue = "name") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "asc") String sortDir) {
        if (products == null || products.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<Product> sortedProducts = productService.sortProducts(products, sortBy, sortDir);
        String baseUrl = "http://localhost:6060/upload-dir/";
        sortedProducts.forEach(product -> {
            if (product.getFileName() != null && !product.getFileName().isEmpty()) {
                product.setFileName(baseUrl + product.getFileName());
            }
        });
        return ResponseEntity.ok(sortedProducts);
    }
    @PostMapping("/bulk")
    public ResponseEntity<List<Product>> getProductsByIds(@RequestBody List<Long> productIds) {
        List<Product> products = productRepository.findAllById(productIds);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/products/suggestions")
    public ResponseEntity<SuggestionResponse> getSuggestions(
            @RequestParam("bookmarkedIds") String bookmarkedIds,
            @RequestParam(value = "includeWildCard", defaultValue = "false") boolean includeWildCard) {
        System.out.println("Received suggestion request with bookmarkedIds: " + bookmarkedIds);
        List<Long> ids = Arrays.stream(bookmarkedIds.split(","))
                .map(Long::parseLong)
                .collect(Collectors.toList());

        if (ids.isEmpty()) {
            System.out.println("No bookmarked IDs provided, returning empty suggestions.");
            return ResponseEntity.ok(new SuggestionResponse(Collections.emptyList(), null));
        }

        Map<String, Integer> categoryCount = new HashMap<>();
        for (Long id : ids) {
            String category = productService.getCategoryByProductId(id);
            System.out.println("Product ID " + id + " has category: " + category);
            if (category != null) {
                categoryCount.put(category, categoryCount.getOrDefault(category, 0) + 1);
            }
        }

        String topCategoryStr = categoryCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        System.out.println("Top category (string): " + topCategoryStr);
        if (topCategoryStr == null) {
            System.out.println("No top category found, returning empty suggestions.");
            return ResponseEntity.ok(new SuggestionResponse(Collections.emptyList(), null));
        }

        Category topCategory;
        try {
            topCategory = Category.valueOf(topCategoryStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid category value: " + topCategoryStr + ". Returning empty suggestions.");
            return ResponseEntity.ok(new SuggestionResponse(Collections.emptyList(), null));
        }

        List<Long> suggestions = productService.getProductIdsByCategory(topCategory).stream()
                .filter(productId -> !ids.contains(productId))
                .limit(5)
                .collect(Collectors.toList());

        if (includeWildCard && new Random().nextBoolean()) {
            String wildCategoryStr = categoryCount.keySet().stream()
                    .filter(c -> !c.equals(topCategoryStr))
                    .findAny().orElse(null);
            if (wildCategoryStr != null) {
                Category wildCategory;
                try {
                    wildCategory = Category.valueOf(wildCategoryStr.toUpperCase());
                } catch (IllegalArgumentException e) {
                    System.err.println("Invalid wildcard category value: " + wildCategoryStr + ". Skipping wildcard.");
                    wildCategory = null;
                }
                if (wildCategory != null) {
                    List<Long> wildSuggestions = productService.getProductIdsByCategory(wildCategory).stream()
                            .filter(id -> !ids.contains(id))
                            .limit(1)
                            .collect(Collectors.toList());
                    suggestions.addAll(wildSuggestions);
                    System.out.println("Added wildcard suggestions from category: " + wildCategory);
                }
            }
        }

        System.out.println("Returning suggestions: " + suggestions);
        return ResponseEntity.ok(new SuggestionResponse(suggestions, topCategoryStr));
    }

    private static class SuggestionResponse {
        private List<Long> suggestedProductIds;
        private String topCategory;

        public SuggestionResponse(List<Long> suggestedProductIds, String topCategory) {
            this.suggestedProductIds = suggestedProductIds;
            this.topCategory = topCategory;
        }

        public List<Long> getSuggestedProductIds() { return suggestedProductIds; }
        public void setSuggestedProductIds(List<Long> suggestedProductIds) { this.suggestedProductIds = suggestedProductIds; }
        public String getTopCategory() { return topCategory; }
        public void setTopCategory(String topCategory) { this.topCategory = topCategory; }

        @Override
        public String toString() {
            return "SuggestionResponse{suggestedProductIds=" + suggestedProductIds + ", topCategory='" + topCategory + "'}";
        }
    }
}