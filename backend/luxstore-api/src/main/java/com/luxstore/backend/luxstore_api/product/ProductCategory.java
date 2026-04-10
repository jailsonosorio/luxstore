package com.luxstore.backend.luxstore_api.product;

public enum ProductCategory {

    RELOGIOS("Relógios"),
    JOIAS("Joias"),
    ROUPAS_ACESSORIOS("Roupas & Acessórios"),
    CABELOS_HUMANOS("Cabelos Humanos");

    private final String description;

    ProductCategory(String description) {
        this.description = description;
    }

    public String getCode() {
        return this.name();
    }

    public String getDescription() {
        return description;
    }
}
