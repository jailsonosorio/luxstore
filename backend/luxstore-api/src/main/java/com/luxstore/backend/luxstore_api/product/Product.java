package com.luxstore.backend.luxstore_api.product;
import com.luxstore.backend.luxstore_api.category.Category;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Enumerated(EnumType.STRING)
    private ProductBadge badge;

    private BigDecimal price;

    private String image;

    private String description;

    private String details;

    private boolean active = true;

    private Boolean isBestSeller;

    // getters e setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // NAME
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // CATEGORY
    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    // BADGE
    public ProductBadge getBadge() {
        return badge;
    }

    public void setBadge(ProductBadge badge) {
        this.badge = badge;
    }

    // PRICE
    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    // IMAGE
    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    // DESCRIPTION
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // DETAILS
    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public boolean isActive() {
        return active;
    }

    // ACTIVE
    public void setActive(boolean active) {
        this.active = active;
    }

    // BESTSELLER
    public Boolean getIsBestSeller() {
        return isBestSeller;
    }

    public void setIsBestSeller(Boolean isBestSeller) {
        this.isBestSeller = isBestSeller;
    }
}