package com.example.foodapi.service;

import com.example.foodapi.dto.OrderRequest;
import com.example.foodapi.dto.OrderResponse;
import com.example.foodapi.entity.OrderEntity;
import com.example.foodapi.repository.OrderRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserService userService;

    @Value("${paypal.client.id}")
    private String paypalClientId;

    @Value("${paypal.client.secret}")
    private String paypalClientSecret;

    @Override
    public OrderResponse createOrderWithPayment(OrderRequest request) {

        // Save order before payment
        OrderEntity order = OrderEntity.builder()
                .userAddress(request.getUserAddress())
                .amount(request.getAmount())
                .orderedItems(request.getOrderedItems())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .orderStatus("CREATED")
                .paymentStatus("CREATED")
                .build();

        String userId = userService.getLoggedInUserId();
        order.setUserId(userId);

        // Simulated PayPal Order ID (for demo/project)
        String paypalOrderId = "PAYPAL-" + UUID.randomUUID();

        order.setPaypalOrderId(paypalOrderId);
        order = orderRepository.save(order);

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .amount(order.getAmount())
                .paypalOrderId(order.getPaypalOrderId())
                .paymentStatus(order.getPaymentStatus())
                .orderStatus(order.getOrderStatus())
                .build();
    }
}
