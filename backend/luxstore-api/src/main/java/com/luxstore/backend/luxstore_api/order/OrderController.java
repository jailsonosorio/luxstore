package com.luxstore.backend.luxstore_api.order;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Pedidos", description = "Operações relacionadas aos pedidos")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping
    @Operation(summary = "Criação de pedidos")
    public Order createOrder(@RequestBody Order order, Authentication auth  ) {
        String email = auth.getName(); // vem do token

        order.setUserEmail(email);
        
        return service.save(order);
    }
}