package com.example.foodapi.service;

import com.example.foodapi.dto.OrderRequest;
import com.example.foodapi.dto.OrderResponse;

public interface OrderService {
    OrderResponse createOrderWithPayment(OrderRequest request);
}
