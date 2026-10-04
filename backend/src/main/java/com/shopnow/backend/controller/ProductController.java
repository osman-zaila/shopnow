package com.shopnow.backend.controller;

import com.shopnow.backend.entity.Product;
import com.shopnow.backend.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(
            ProductRepository productRepository) {

        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getProducts() {

        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public Product getProductById(
            @PathVariable Long id) {

        return productRepository
                .findById(id)
                .orElse(null);
    }

    @PostMapping
    public Product createProduct(
            @RequestBody Product product) {

        return productRepository.save(product);
    }

    @PostMapping("/bulk")
    public List<Product> createProducts(
            @RequestBody List<Product> products) {

        return productRepository.saveAll(products);
    }

    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @RequestBody Product updatedProduct) {

        Product product = productRepository
                .findById(id)
                .orElse(null);

        if (product == null) {
            return null;
        }

        product.setName(
                updatedProduct.getName()
        );

        product.setCategory(
                updatedProduct.getCategory()
        );

        product.setPrice(
                updatedProduct.getPrice()
        );

        product.setImage(
                updatedProduct.getImage()
        );

        product.setStock(
                updatedProduct.getStock()
        );

        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(
            @PathVariable Long id) {

        productRepository.deleteById(id);
    }
}
