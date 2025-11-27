package com.example.foodiesapi.service;

import com.example.foodiesapi.entity.Cart;

public interface CartService {
    Cart getCart(String userId);
    Cart addToCart(String userId, Cart.CartItem item);
    Cart removeFromCart(String userId, String foodId);
}
