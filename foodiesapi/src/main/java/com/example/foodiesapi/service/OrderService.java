package com.example.foodiesapi.service;

import com.example.foodiesapi.entity.OrderEntity;
import com.example.foodiesapi.io.OrderRequest;
import com.example.foodiesapi.io.OrderResponse;

import java.util.List;
import java.util.Map;

public interface OrderService {

    // --- New PayHere Methods ---
    Map<String, Object> initiatePayHereCheckout(OrderRequest request);

    void handlePayHereNotification(Map<String, String> paymentData);


    // --- Standard Order Methods ---
    List<OrderResponse> getUserOrders();

    void removeOrder(String orderId);

    List<OrderResponse> getOrdersOfAllUsers();

    void updateOrderStatus(String orderId, String status);

    // --- NEW: Delivery System Methods ---

    /**
     * Assigns a specific delivery boy to an order.
     * This will also update the order status to "ASSIGNED".
     */
    OrderResponse assignDeliveryBoy(String orderId, String deliveryBoyId);

    /**
     * Fetches all orders assigned to a specific delivery boy.
     * Used for the Delivery Boy's dashboard.
     */
    List<OrderResponse> getDeliveryBoyOrders(String deliveryBoyId);
}