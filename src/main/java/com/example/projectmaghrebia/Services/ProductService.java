package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Category;
import com.example.projectmaghrebia.Entities.Product;
import com.example.projectmaghrebia.Repositories.ProductRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class ProductService implements IProductService {
    @Autowired
    private ProductRepository productRepository;


    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }


    @Override
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }


    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }


    @Override
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        product.setCategory(productDetails.getCategory());
        product.setDescription(productDetails.getDescription());
        product.setName(productDetails.getName());
        product.setFileName(productDetails.getFileName());
        return productRepository.save(product);
    }


    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Product incrementViews(Long id) {
        return productRepository.findById(id)
                .map(product -> {
                    Long currentViews = product.getViews() != null ? product.getViews() : 0L;
                    product.setViews(currentViews + 1);
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
    @Override
    public List<Product> searchProducts(String query) {
        String lowerCaseQuery = query.toLowerCase();
        return productRepository.findAll().stream()
                .filter(product -> {
                    boolean matchesName = product.getName() != null &&
                            product.getName().toLowerCase().contains(lowerCaseQuery);
                    boolean matchesDescription = product.getDescription() != null &&
                            product.getDescription().toLowerCase().contains(lowerCaseQuery);
                    boolean matchesCategory = product.getCategory() != null &&
                            product.getCategory().name().toLowerCase().contains(lowerCaseQuery);
                    return matchesName || matchesDescription || matchesCategory;
                })
                .collect(Collectors.toList());
    }
    @Override
    public List<Product> sortProducts(List<Product> products, String sortBy, String sortDir) {
        Comparator<Product> comparator;
        switch (sortBy.toLowerCase()) {
            case "price":
                comparator = Comparator.comparing(Product::getPrice, Comparator.nullsLast(Comparator.naturalOrder()));
                break;
            case "views":
                comparator = Comparator.comparing(Product::getViews, Comparator.nullsLast(Comparator.naturalOrder()));
                break;
            case "name":
            default:
                comparator = Comparator.comparing(Product::getName, Comparator.nullsLast(Comparator.naturalOrder()));
                break;
        }

        if (sortDir.equalsIgnoreCase("desc")) {
            comparator = comparator.reversed();
        }

        return products.stream()
                .sorted(comparator)
                .collect(Collectors.toList());
    }

    public List<Product> getMostViewedProducts() {
        return productRepository.findAll(Sort.by(Sort.Direction.DESC, "views"))
                .stream()
                .limit(3)
                .collect(Collectors.toList());
    }
    public List<Product> findByCategory(String category) {
        return productRepository.findByCategory(category);
    }
    @Override
    public String getCategoryByProductId(Long productId) {
        return productRepository.findCategoryById(productId);
    }

    @Override
    public List<Long> getProductIdsByCategory(Category category) {
        return productRepository.findProductIdsByCategory(category);
    }
    @Override
    public Map<String, Object> getProductStatistics() {
        List<Product> products = productRepository.findAll();
        Map<String, Object> statistics = new HashMap<>();

        // Total number of products
        long totalProducts = products.size();
        statistics.put("totalProducts", totalProducts);

        // Average price
        double averagePrice = products.stream()
                .filter(product -> product.getPrice() != null)
                .mapToDouble(Product::getPrice)
                .average()
                .orElse(0.0);
        statistics.put("averagePrice", averagePrice);

        // Total views
        long totalViews = products.stream()
                .filter(product -> product.getViews() != null)
                .mapToLong(Product::getViews)
                .sum();
        statistics.put("totalViews", totalViews);

        // Products by category
        Map<String, Long> productsByCategory = products.stream()
                .filter(product -> product.getCategory() != null)
                .collect(Collectors.groupingBy(
                        product -> product.getCategory().name(),
                        Collectors.counting()
                ));
        statistics.put("productsByCategory", productsByCategory);

        // Views by category
        Map<String, Long> viewsByCategory = products.stream()
                .filter(product -> product.getCategory() != null && product.getViews() != null)
                .collect(Collectors.groupingBy(
                        product -> product.getCategory().name(),
                        Collectors.summingLong(Product::getViews)
                ));
        statistics.put("viewsByCategory", viewsByCategory);

        return statistics;
    }

}
