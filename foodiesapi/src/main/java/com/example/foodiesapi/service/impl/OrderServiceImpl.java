package com.example.foodiesapi.service.impl;

import com.example.foodiesapi.entity.Order;
import com.example.foodiesapi.repository.OrderRepository;
import com.example.foodiesapi.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository repo;

    @Override
    public Order placeOrder(Order order) {
        order.setStatus("Pending");
        order.setCreatedAt(LocalDateTime.now());
        return repo.save(order);
    }

    @Override
    public List<Order> getOrders(String userId) {
        return repo.findByUserId(userId);
    }
}
