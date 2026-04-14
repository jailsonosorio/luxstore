package com.luxstore.backend.luxstore_api.product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByIsBestSellerTrue();
}
