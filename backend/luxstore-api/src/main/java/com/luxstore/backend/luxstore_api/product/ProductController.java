package com.luxstore.backend.luxstore_api.product;

import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Produtos", description = "Operações relacionadas aos produtos")
public class ProductController {

    private final ProductService service;
    private final ProductRepository repository;

    public ProductController(ProductService service, ProductRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @GetMapping
    @Operation(summary = "Listar todos os produtos")
    public List<Product> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar produto por ID")
    public Product getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/best-sellers")
    @Operation(summary = "Listar produtos mais vendidos")
    public List<Product> getBestSellers() {
        return repository.findByIsBestSellerTrue();
    }
}