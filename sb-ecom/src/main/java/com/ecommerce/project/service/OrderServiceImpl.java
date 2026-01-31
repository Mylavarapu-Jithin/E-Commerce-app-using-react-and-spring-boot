package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.*;
import com.ecommerce.project.payload.*;
import com.ecommerce.project.repositories.*;
import com.ecommerce.project.util.*;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    CartService cartService;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    AuthUtil authUtil;

    @Autowired
    PagedResponseBuilder response;

    @Autowired
    Pagination pagination;

    @Override
    @Transactional
    public OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage) {
        Optional<Payment> existingPayment = paymentRepository.findByPgPaymentId(pgPaymentId);
        if (existingPayment.isPresent()) {
            return modelMapper.map(existingPayment.get().getOrder(), OrderDTO.class);
        }

        Cart cart = cartRepository.getCartByEmail(emailId);

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));

        Order order = new Order();
        order.setEmail(emailId);
        order.setOrderDate(LocalDate.now());
        order.setOrderStatus("Accepted");
        order.setTotalAmount(cart.getTotalPrice());
        order.setAddress(address);

        Payment payment = new Payment(paymentMethod, pgPaymentId, pgStatus, pgResponseMessage, pgName);
        payment.setOrder(order);
        payment = paymentRepository.save(payment);

        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);

        List<CartItem> cartItems = cart.getCartItems();
        if(cartItems.isEmpty()) {
            throw new APIException("Cart is empty");
        }

        List<OrderItem> orderItems = cartItems.stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setDiscount(cartItem.getDiscount());
                    orderItem.setOrderedProductPrice(cartItem.getProductPrice());
                    orderItem.setProduct(cartItem.getProduct());
                    orderItem.setOrder(savedOrder);
                    return orderItem;
                }).toList();

        orderItems = orderItemRepository.saveAll(orderItems);

        new ArrayList<>(cartItems).forEach(item -> {
            int quantity = item.getQuantity();
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() - quantity);
            productRepository.save(product);

            cartService.deleteProductFromCart(cart.getCartId(), item.getProduct().getProductId());
        });

        OrderDTO orderDTO = modelMapper.map(savedOrder, OrderDTO.class);
        orderItems.forEach(item -> orderDTO.getOrderItems().add(modelMapper.map(item, OrderItemDTO.class)));
        orderDTO.setAddressId(addressId);
        return orderDTO;
    }

    @Override
    public OrderDTO updateOrder(Long orderId, String status) {
        Order order = orderRepository.findById(orderId).
                orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", orderId));
        order.setOrderStatus(status);
        orderRepository.save(order);
        return modelMapper.map(order, OrderDTO.class);
    }

    private OrderResponse fetchOrders(
            Specification<Order> scopeSpec,
            String searchBy,
            String keyword,
            Integer pageNumber,
            Integer pageSize,
            String sortBy,
            String sortOrder
    ) {
       Pageable pageable = pagination.createPageable(pageNumber, pageSize, sortBy, sortOrder);

        Specification<Order> searchSpec = OrderSpecifications.searchBy(
                keyword,
                searchBy != null ? OrderSearchField.from(searchBy) : null
        );

        Specification<Order> finalSpec = Specification
                .where(scopeSpec)
                .and(searchSpec);

        Page<Order> page = orderRepository.findAll(finalSpec, pageable);

        return response.build(page, OrderDTO.class, OrderResponse::new, false);
    }

    @Override
    public OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String searchBy,
                                      String keyword) {
        return fetchOrders(OrderSpecifications.adminScope(), searchBy, keyword, pageNumber, pageSize, sortBy, sortOrder);
    }

    @Override
    public OrderResponse getAllSellersOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder,
                                             String searchBy, String keyword) {
       return fetchOrders(OrderSpecifications.sellerScope(authUtil.loggedInUserId()), searchBy, keyword, pageNumber,
               pageSize, sortBy, sortOrder);
    }

    @Override
    public OrderResponse getAllUserOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder,
                                          String searchBy, String keyword) {
        return fetchOrders(OrderSpecifications.userScope(authUtil.loggedInEmail()), searchBy, keyword, pageNumber, pageSize,
                sortBy, sortOrder);
    }
}