package com.example.foodiesapi.service;

import com.example.foodiesapi.entity.Order;

import java.util.List;

public interface OrderService {
    Order placeOrder(Order order);
    List<Order> getOrders(String userId);
}
