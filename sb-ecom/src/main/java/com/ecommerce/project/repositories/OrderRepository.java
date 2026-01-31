package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    List<Order> findAllByEmail(String email);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o")
    Double getTotalRevenue();

    @Query("SELECT COUNT(DISTINCT oi.order) FROM OrderItem oi WHERE oi.product.user.userId = :sellerId")
    Long countOrdersBySellerProducts(@Param("sellerId") Long sellerId);

    @Query("SELECT COUNT(o) FROM Order o")
    Long countAllOrders();
}
