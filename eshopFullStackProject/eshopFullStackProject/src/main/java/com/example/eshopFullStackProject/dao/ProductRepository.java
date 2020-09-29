package com.example.eshopFullStackProject.dao;

import com.example.eshopFullStackProject.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

//accept calls from web browser scripts for this origin
@CrossOrigin(origins = "http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable); //findByCategoryId --> query method behind the scenes Spring will execute a query similar to this SELECT * FROM product where category_id = ?

    Page<Product> findByNameContaining(@RequestParam("name") String name, Pageable pageable); //SELECT * FROM Product p WHERE   p.name LIKE CONCAT('%', :name , '%')

}
