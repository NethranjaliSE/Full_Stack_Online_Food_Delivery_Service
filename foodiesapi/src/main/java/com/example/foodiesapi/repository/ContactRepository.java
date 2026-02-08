package com.example.foodiesapi.repository;

import com.example.foodiesapi.entity.ContactEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends MongoRepository<ContactEntity, String> {
}
