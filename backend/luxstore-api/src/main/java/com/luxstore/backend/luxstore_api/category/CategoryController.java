package com.luxstore.backend.luxstore_api.category;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Categorias", description = "Operações relacionadas às categorias")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    @Operation(summary = "Listar categorias")
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @PostMapping
    @Operation(summary = "Criação de categorias")
    public Category create(@RequestBody Category category) {
        return categoryRepository.save(category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category category) {
        Category existing = categoryRepository.findById(id).orElseThrow();

        existing.setName(category.getName());
        existing.setDescription(category.getDescription());
        existing.setImage(category.getImage());
        existing.setCode(category.getCode());

        return ResponseEntity.ok(categoryRepository.save(existing));
    }
}