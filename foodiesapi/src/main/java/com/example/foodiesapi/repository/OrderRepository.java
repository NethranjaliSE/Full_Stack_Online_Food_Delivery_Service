package com.example.foodiesapi.repository;

import com.example.foodiesapi.entity.OrderEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<OrderEntity, String> {

    // Finds all orders for a specific user (Standard)
    List<OrderEntity> findByUserId(String userId);

    /**
     * NEW: Finds all orders assigned to a specific delivery boy.
     * This will be used in the Delivery Boy's dashboard to see their current tasks.
     */
    List<OrderEntity> findByDeliveryBoyId(String deliveryBoyId);

    /**
     * NEW: Finds orders by their current status.
     * Useful for Admin to see "Placed" orders or Delivery Boys to see "Ready for Pickup" orders.
     */
    List<OrderEntity> findByOrderStatus(String orderStatus);

    // CHANGED: Replaced Razorpay ID with PayHere Payment ID
    Optional<OrderEntity> findByPayherePaymentId(String payherePaymentId);

    // NOTE: Built-in findById() is used during PayHere callbacks.
}