package com.luxstore.backend.luxstore_api.order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserEmailOrderByIdDesc(String email);
}