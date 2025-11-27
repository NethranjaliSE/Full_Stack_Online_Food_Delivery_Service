package com.example.foodiesapi.service.impl;

import com.example.foodiesapi.entity.MenuItem;
import com.example.foodiesapi.repository.MenuItemRepository;
import com.example.foodiesapi.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {

    private final MenuItemRepository repo;

    @Override
    public List<MenuItem> getAllMenu() {
        return repo.findAll();
    }

    @Override
    public List<MenuItem> getByCategory(String category) {
        return repo.findByCategory(category);
    }

    @Override
    public List<MenuItem> searchByName(String name) {
        return repo.findByNameContainingIgnoreCase(name);
    }

    @Override
    public MenuItem getItem(String id) {
        return repo.findById(id).orElse(null);
    }
}
