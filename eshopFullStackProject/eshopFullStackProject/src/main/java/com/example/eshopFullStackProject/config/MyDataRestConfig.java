package com.example.eshopFullStackProject.config;

import com.example.eshopFullStackProject.entity.Country;
import com.example.eshopFullStackProject.entity.Product;
import com.example.eshopFullStackProject.entity.ProductCategory;
import com.example.eshopFullStackProject.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager){
        entityManager = theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        HttpMethod[] theUnSupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        //product ---> read only
        //disable HTTP methods for product: PUT, POST and DELETE
        disableHttpMethods(Product.class,config, theUnSupportedActions);
        //ProductCategory ---> read only
        disableHttpMethods(ProductCategory.class,config, theUnSupportedActions);
        //Country ---> read only
        disableHttpMethods(Country.class,config, theUnSupportedActions);
        //State ---> read only
        disableHttpMethods(State.class,config, theUnSupportedActions);
        
        //call the internal helper method
        exposeIds(config);
    }

    private void disableHttpMethods(Class theClass,RepositoryRestConfiguration config, HttpMethod[] theUnSupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions));
    }

    //we this function we take categories ids to product-category.json
    //http://localhost:8080/api/product-category
    private void exposeIds(RepositoryRestConfiguration config){
        //expose entity ids
        //get a list of all entity classes from the entity manager
        Set<javax.persistence.metamodel.EntityType<?>> entities = entityManager.getMetamodel().getEntities();
        //create an array of the entity types
        List<Class> entityClasses = new ArrayList<>();
        //get the entity types for the entities
        for(EntityType<?> temp : entities){
            entityClasses.add(temp.getJavaType());
        }
        //expose the entity ids for the array of entity/domain types
        Class[] domainTYpes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTYpes);
    }

}
