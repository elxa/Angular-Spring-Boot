package com.example.eshopFullStackProject.dao;

import com.example.eshopFullStackProject.entity.Country;
import com.example.eshopFullStackProject.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:4200") //accept calls from web browser scripts for this origin
@RepositoryRestResource(collectionResourceRel = "country", path="countries")
public interface CountryRepository extends JpaRepository<Country, Long> {
}
