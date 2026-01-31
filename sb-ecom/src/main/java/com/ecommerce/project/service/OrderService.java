package com.ecommerce.project.service;

import com.ecommerce.project.payload.OrderDTO;
import com.ecommerce.project.payload.OrderResponse;

public interface OrderService {

    OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage);


    OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String searchBy, String keyword);

    OrderDTO updateOrder(Long orderId, String status);

    OrderResponse getAllSellersOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String searchBy, String keyword);

    OrderResponse getAllUserOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String searchBy, String keyword);
}
