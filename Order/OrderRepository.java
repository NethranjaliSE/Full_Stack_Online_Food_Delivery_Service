package com.example.foodapi.repository;

import com.example.foodapi.entity.OrderEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<OrderEntity, String> {

    List<OrderEntity> findByUserId(String userId);
    Optional<OrderEntity> findByPaypalOrderId(String paypalOrderId);
}
