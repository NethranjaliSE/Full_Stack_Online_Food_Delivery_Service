package com.example.foodiesapi.service;

import com.example.foodiesapi.entity.MenuItem;

import java.util.List;

public interface MenuService {
    List<MenuItem> getAllMenu();
    List<MenuItem> getByCategory(String category);
    List<MenuItem> searchByName(String name);
    MenuItem getItem(String id);
}
