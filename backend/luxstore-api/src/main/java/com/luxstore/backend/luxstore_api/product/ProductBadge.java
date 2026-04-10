package com.luxstore.backend.luxstore_api.product;

public enum ProductBadge {
    MAIS_VENDIDO("Mais vendido"),
    POPULAR("Popular"),
    NOVO("Novo"),
    OFERTAS("Ofertas");

    private final String description;

    ProductBadge(String description) {
        this.description = description;
    }

    public String getCode() {
        return this.name();
    }

    public String getDescription() {
        return description;
    }
    
}
