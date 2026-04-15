package com.luxstore.backend.luxstore_api.category;

import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Categorias", description = "Operações relacionadas às categorias")
public class CategoryController {

    private final CategoryRepository repo;

    public CategoryController(CategoryRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    @Operation(summary = "Listar categorias")
    public List<Category> getAll() {
        return repo.findAll();
    }
}