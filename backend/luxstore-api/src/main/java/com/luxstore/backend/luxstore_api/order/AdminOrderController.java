package com.luxstore.backend.luxstore_api.order;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminOrderController {

    private final OrderRepository repository;

    public AdminOrderController(OrderRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable Long id, @RequestParam String status) {
        Order order = repository.findById(id).orElseThrow();

        order.setStatus(status);
        return repository.save(order);
    }
}