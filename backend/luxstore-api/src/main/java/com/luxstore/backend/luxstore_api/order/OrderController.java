package com.luxstore.backend.luxstore_api.order;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order, Authentication auth  ) {
        String email = auth.getName(); // vem do token

        order.setUserEmail(email);
        
        return service.save(order);
    }
}