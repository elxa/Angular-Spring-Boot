package com.example.eshopFullStackProject.dao;

import com.example.eshopFullStackProject.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

//productCategory --> Name of JSON entry
//product-category --> path   /product-category

@CrossOrigin(origins = "http://localhost:4200") //accept calls from web browser scripts for this origin
@RepositoryRestResource(collectionResourceRel = "productCategory", path="product-category")
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
}
