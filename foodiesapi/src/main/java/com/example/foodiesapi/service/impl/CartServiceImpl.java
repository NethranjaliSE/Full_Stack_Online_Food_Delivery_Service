package com.example.foodiesapi.service.impl;

import com.example.foodiesapi.entity.Cart;
import com.example.foodiesapi.repository.CartRepository;
import com.example.foodiesapi.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository repo;

    @Override
    public Cart getCart(String userId) {
        return repo.findByUserId(userId).orElse(new Cart());
    }

    @Override
    public Cart addToCart(String userId, Cart.CartItem newItem) {
        Cart cart = repo.findByUserId(userId).orElse(new Cart());
        cart.setUserId(userId);

        if (cart.getItems() == null)
            cart.setItems(new ArrayList<>());

        cart.getItems().add(newItem);

        return repo.save(cart);
    }

    @Override
    public Cart removeFromCart(String userId, String foodId) {
        Cart cart = repo.findByUserId(userId).orElse(null);
        if (cart == null) return null;

        cart.getItems().removeIf(i -> i.getFoodId().equals(foodId));

        return repo.save(cart);
    }
}
