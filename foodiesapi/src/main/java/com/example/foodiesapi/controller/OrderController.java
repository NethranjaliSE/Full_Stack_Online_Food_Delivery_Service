package com.example.foodiesapi.controller;

import com.example.foodiesapi.entity.Order;
import com.example.foodiesapi.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin
public class OrderController {

    private final OrderService service;

    @PostMapping
    public Order placeOrder(@RequestBody Order order) {
        return service.placeOrder(order);
    }

    @GetMapping("/{userId}")
    public List<Order> getOrders(@PathVariable String userId) {
        return service.getOrders(userId);
    }
}
