package com.example.foodiesapi.service;

import com.example.foodiesapi.io.OrderResponse;
import com.example.foodiesapi.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class DeliveryServiceImpl implements DeliveryService {

    private final OrderService orderService;

    @Override
    public List<OrderResponse> getOrdersForDriver(String deliveryBoyId) {
        // Reuse the logic we added to OrderService earlier
        return orderService.getDeliveryBoyOrders(deliveryBoyId);
    }

    @Override
    public void updateDeliveryStatus(String orderId, String status) {
        // Update the order status
        orderService.updateOrderStatus(orderId, status);

        // Note: Our OrderServiceImpl.updateOrderStatus already handles
        // making the driver 'Available' again if status is 'DELIVERED'.
    }
}