package com.ecommerce.project.util;

import java.util.Arrays;

public enum OrderSearchField {
    ORDER_ID("orderId"),
    STATUS("orderStatus"),
    EMAIL("email"),
    TOTAL_AMOUNT("totalAmount"),
    ORDER_DATE("orderDate");

    private final String field;

    OrderSearchField(String field) {
        this.field = field;
    }

    public String getField() {
        return field;
    }

    public static OrderSearchField from(String value) {
        return Arrays.stream(values())
                .filter(v -> v.name().equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid search field"));
    }
}
