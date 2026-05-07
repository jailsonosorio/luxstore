package com.luxstore.backend.luxstore_api.order;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luxstore.backend.luxstore_api.user.User;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/user/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class UserOrderController {

    private final OrderRepository repository;

    public UserOrderController(OrderRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    @Operation
    public List<Order> getMyOrders(Authentication auth) {

        String email = auth.getName();
        Order order = new Order();
        order.setUserEmail(email);

        return repository.findByUserEmailOrderByIdDesc(email);
    }

    @PutMapping("/{id}/confirm")
    @Operation
    public Order confirmDelivery(@PathVariable Long id) {

        Order order = repository.findById(id)
                .orElseThrow();

        order.setStatus("FECHADO");

        return repository.save(order);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter detalhes de um pedido específico do usuário")
    public Order getOrderById(
        @PathVariable Long id,
        Authentication auth
) {

    String username = auth.getName();

    Order order = repository.findById(id)
            .orElseThrow();

    // segurança: pedido pertence ao utilizador?
    if (!order.getUserEmail().equals(username)) {
        throw new RuntimeException("Acesso negado");
    }

    return order;
}
}