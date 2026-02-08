package com.example.foodiesapi.service;

import com.example.foodiesapi.io.OrderResponse;
import java.util.List;

public interface DeliveryService {
    List<OrderResponse> getOrdersForDriver(String deliveryBoyId);
    void updateDeliveryStatus(String orderId, String status);
}