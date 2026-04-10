package com.luxstore.backend.luxstore_api.product;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(ProductRepository repo) {
        return args -> {
            if (repo.count() == 0) {

                Product p = new Product();
                p.setName("Relógio Executive Gold");
                p.setCategory(ProductCategory.RELOGIOS);
                p.setBadge(ProductBadge.MAIS_VENDIDO);
                p.setPrice(new BigDecimal("32500"));
                p.setImage("/images/products/relogio_silver_gold.avif");
                p.setDescription("Relógio elegante premium");
                p.setDetails("Ideal para ocasiões especiais");

                repo.save(p);
            }
        };
    }
}