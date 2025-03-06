package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Category;
import com.example.projectmaghrebia.Entities.Product;
import com.example.projectmaghrebia.Repositories.ProductRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
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

}
