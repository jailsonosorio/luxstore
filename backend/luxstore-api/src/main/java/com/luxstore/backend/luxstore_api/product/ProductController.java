package com.luxstore.backend.luxstore_api.product;

import org.springframework.web.bind.annotation.*;

import com.luxstore.backend.luxstore_api.category.CategoryRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Produtos", description = "Operações relacionadas aos produtos")
public class ProductController {

    private final ProductService service;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductController(ProductService service, ProductRepository productRepository,
            CategoryRepository categoryRepository) {
        this.service = service;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    @Operation(summary = "Listar todos os produtos")
    public List<Product> getAll() {
        return service.findAll();
    }

    @PostMapping
    public Product create(@RequestBody Product product) {

        if (product.getCategory() != null && product.getCategory().getId() != null) {
            var category = categoryRepository
                    .findById(product.getCategory().getId())
                    .orElseThrow();

            product.setCategory(category);
        }

        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar um produto existente")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        Product existing = productRepository.findById(id).orElseThrow();

        existing.setName(product.getName());
        existing.setDescription(product.getDescription());
        existing.setPrice(product.getPrice());
        existing.setImage(product.getImage());
        existing.setBadge(product.getBadge()); //BY DEFAULT, ALL UPDATED PRODUCTS ARE MARKED AS "NEW"
        existing.setActive(true); //BY DEFAULT, ALL UPDATED PRODUCTS ARE MARKED AS ACTIVE
        existing.setIsBestSeller(product.getIsBestSeller());
        existing.setActive(product.isActive());

        if (product.getCategory() != null && product.getCategory().getId() != null) {
            var category = categoryRepository
                    .findById(product.getCategory().getId())
                    .orElseThrow();

            existing.setCategory(category);
        }

        return productRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir um produto")
    public void delete(@PathVariable Long id) {
        productRepository.deleteById(id);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar produto por ID")
    public Product getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/best-sellers")
    @Operation(summary = "Listar produtos mais vendidos")
    public List<Product> getBestSellers() {
        return productRepository.findByIsBestSellerTrue();
    }
}