package com.example.foodapi.controller;

import com.example.foodapi.dto.OrderRequest;
import com.example.foodapi.dto.OrderResponse;
import com.example.foodapi.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    public OrderResponse createOrder(@RequestBody OrderRequest request) {
        return orderService.createOrderWithPayment(request);
    }
}
