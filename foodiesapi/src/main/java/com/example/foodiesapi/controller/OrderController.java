package com.example.foodiesapi.controller;

import com.example.foodiesapi.io.OrderRequest;
import com.example.foodiesapi.io.OrderResponse;
import com.example.foodiesapi.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * 1. INITIATE PAYMENT
     * Generates PayHere Hash and prepares checkout data.
     */
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createOrderWithPayHere(@RequestBody OrderRequest request) {
        return orderService.initiatePayHereCheckout(request);
    }

    /**
     * 2. NOTIFY URL (Webhook)
     * Handles PayHere payment status callbacks.
     */
    @PostMapping(value = "/notify", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public void verifyPayment(@RequestParam Map<String, String> paymentData) {
        orderService.handlePayHereNotification(paymentData);
    }

    // --- Standard Endpoints ---

    @GetMapping
    public List<OrderResponse> getOrders() {
        return orderService.getUserOrders();
    }

    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable String orderId) {
        orderService.removeOrder(orderId);
    }

    // --- Admin & Delivery Logic ---

    @GetMapping("/all")
    public List<OrderResponse> getOrdersOfAllUsers() {
        return orderService.getOrdersOfAllUsers();
    }

    /**
     * Updated to handle role-based status changes.
     * Logic inside OrderServiceImpl will handle making delivery boys
     * available again if status is set to 'DELIVERED'.
     */
    @PatchMapping("/status/{orderId}")
    public void updateOrderStatus(@PathVariable String orderId, @RequestParam String status) {
        orderService.updateOrderStatus(orderId, status);
    }

    /**
     * NEW: Assignment endpoint for AdminPanel.
     * Connects an order to a delivery boy.
     */
    @PutMapping("/{orderId}/assign/{deliveryBoyId}")
    public OrderResponse assignDeliveryBoy(
            @PathVariable String orderId,
            @PathVariable String deliveryBoyId) {
        return orderService.assignDeliveryBoy(orderId, deliveryBoyId);
    }
}