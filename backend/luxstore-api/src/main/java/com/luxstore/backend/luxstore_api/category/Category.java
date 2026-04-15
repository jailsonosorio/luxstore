package com.luxstore.backend.luxstore_api.category;

import jakarta.persistence.*;

@Entity
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String image;
    private String code;

    // getters e setters
    public Long getId() { return id; }

    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getImage() { return image; }

    public void setId(Long id) { this.id = id; }

    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setImage(String image) { this.image = image; }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}