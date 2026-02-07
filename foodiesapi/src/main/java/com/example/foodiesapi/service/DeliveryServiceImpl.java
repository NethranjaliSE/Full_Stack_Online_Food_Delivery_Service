package com.example.foodiesapi.service.impl;

import com.example.foodiesapi.entity.OrderEntity;
import com.example.foodiesapi.entity.UserEntity;
import com.example.foodiesapi.io.OrderResponse;
import com.example.foodiesapi.repository.OrderRepository;
import com.example.foodiesapi.repository.UserRepository;
import com.example.foodiesapi.service.DeliveryService;
import com.example.foodiesapi.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class DeliveryServiceImpl implements DeliveryService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderService orderService;

    @Override
    public List<OrderResponse> getOrdersForDriver(String deliveryBoyId) {
        return orderService.getDeliveryBoyOrders(deliveryBoyId);
    }

    @Override
    public void updateDeliveryStatus(String orderId, String status) {
        orderService.updateOrderStatus(orderId, status);
        // Auto-make driver available if delivered
        if ("Delivered".equalsIgnoreCase(status)) {
            OrderEntity order = orderRepository.findById(orderId).orElse(null);
            if (order != null && order.getDeliveryBoyId() != null) {
                updateAvailability(order.getDeliveryBoyId(), true);
            }
        }
    }

    // --- NEW: ACCEPT/REJECT LOGIC ---
    @Override
    public void respondToAssignment(String orderId, boolean accepted) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (accepted) {
            order.setDeliveryAcceptanceStatus("ACCEPTED");
            order.setOrderStatus("Driver Confirmed");
        } else {
            // REJECTED: Clear the driver so Admin can re-assign
            order.setDeliveryAcceptanceStatus("REJECTED");
            order.setDeliveryBoyId(null);
            order.setDeliveryBoyName(null);
            order.setOrderStatus("Food Processing"); // Reset status

            // Optional: Mark driver as 'Available' again since they didn't take the job
            // updateAvailability(driverId, true);
        }
        orderRepository.save(order);
    }

    @Override
    public void updateAvailability(String userId, boolean isAvailable) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAvailable(isAvailable);
        userRepository.save(user);
    }

    @Override
    public List<UserEntity> getAvailableDrivers() {
        return userRepository.findByRoleAndIsAvailableTrue("ROLE_DELIVERY");
    }

    @Override
    public void assignDriverToOrder(String orderId, String driverId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        UserEntity driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        order.setDeliveryBoyId(driverId);
        order.setDeliveryBoyName(driver.getName());
        order.setOrderStatus("Assigned");
        order.setDeliveryAcceptanceStatus("PENDING"); // Important for buttons to show

        driver.setAvailable(false); // Make them busy
        userRepository.save(driver);
        orderRepository.save(order);
    }
}