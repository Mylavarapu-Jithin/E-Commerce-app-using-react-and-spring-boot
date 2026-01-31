package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Cart;
import com.ecommerce.project.model.CartItem;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.repositories.CartItemRepository;
import com.ecommerce.project.repositories.CartRepository;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.security.response.CartDTO;
import com.ecommerce.project.security.response.CartItemDTO;
import com.ecommerce.project.util.AuthUtil;
import com.ecommerce.project.util.CartMapper;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Autowired AuthUtil authUtil;

    @Autowired ProductRepository productRepository;

    @Autowired CartRepository cartRepository;

    @Autowired CartItemRepository cartItemRepository;

    @Autowired ModelMapper modelMapper;

    @Autowired CartMapper cartMapper;

    private Cart getExistingCart() {
        String email = authUtil.loggedInEmail();
        Cart cart = cartRepository.getCartByEmail(email);
        if (cart == null) throw new APIException("Cart not found for user");
        return cart;
    }

    private Product findProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
    }

    private void validateStock(Product product, int requiredQuantity) {
        if (product.getQuantity() < requiredQuantity) {
            throw new APIException("Insufficient stock for " + product.getProductName());
        }
    }

    public static CartItem createCartItem(Cart cart, Product product, Integer quantity) {
        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(quantity);
        item.setProductPrice(product.getSpecialPrice());
        item.setDiscount(product.getDiscount());
        return item;
    }


    @Override
    public CartDTO getCart(String emailId, Long cartId) {
        Cart cart = cartRepository.getCartByEmailAndId(emailId, cartId);

        return cartMapper.toDTO(cart);
    }


    @Transactional
    @Override
    public CartDTO updateProductQuantity(Long productId, Integer quantity) {
        Cart cart = getExistingCart();

        Product product = findProductById(productId);
        CartItem cartItem = cartItemRepository.findCartItemByProductIdAndCartId(cart.getCartId(), productId);

        if(cartItem == null) {
            throw new APIException(product.getProductName() + " is not available in your cart");
        }

        int newQuantity = cartItem.getQuantity() + quantity;
        validateStock(product, newQuantity);
        if(newQuantity < 0) {
            throw new APIException("product quantity cannot be negative");
        }
        if(newQuantity == 0) {
            deleteProductFromCart(cart.getCartId(), productId);
        }
        else {
            cartItem.updateQuantity(product, quantity);
            cart.setTotalPrice(cart.getTotalPrice() + (product.getSpecialPrice() * quantity));
            cartRepository.save(cart);
        }

        return cartMapper.toDTO(cart);
    }

    @Override
    @Transactional
    public String deleteProductFromCart(Long cartId, Long productId) {
        Cart cart = cartRepository.getCartById(cartId);

        CartItem cartItem = cartItemRepository.findCartItemByProductIdAndCartId(cartId, productId);

        if(cartItem == null) {
            throw new ResourceNotFoundException("Product", "productId", productId);
        }
        cart.setTotalPrice(cart.getTotalPrice() - (cartItem.getProductPrice() * cartItem.getQuantity()));
        cartItemRepository.deleteCartItemByProductIdAndCartId(cartId, productId);
        cartItemRepository.save(cartItem);
        cartRepository.save(cart);

        return cartItem.getProduct().getProductName() + " deleted successfully from cart!!";
    }

    @Override
    public void updateProductInCarts(Long cartId, Long productId) {
        Cart cart = cartRepository.getCartById(cartId);

        Product product = findProductById(productId);

        CartItem cartItem = cartItemRepository.findCartItemByProductIdAndCartId(cartId, productId);

        if(cartItem == null) {
            throw new ResourceNotFoundException("Product", "productId", productId);
        }

        double cartPrice = cart.getTotalPrice() - (cartItem.getProductPrice() * cartItem.getQuantity());
        cartItem.setProductPrice(product.getSpecialPrice());
        cart.setTotalPrice(cartPrice + (cartItem.getProductPrice() * cartItem.getQuantity()));
        cartItemRepository.save(cartItem);
    }

    @Override
    @Transactional
    public String createOrUpdateCartWithItems(List<CartItemDTO> cartItems) {

        Cart existingCart = cartRepository.getCartByEmail(authUtil.loggedInEmail());

        if(existingCart == null) {
            existingCart = new Cart();
            existingCart.setTotalPrice(0.0);
            existingCart.setUser(authUtil.loggedInUser());
            cartRepository.save(existingCart);
        } else {
            cartItemRepository.deleteAllByCartId(existingCart.getCartId());
        }

        double totalPrice = 0.00;

        for(CartItemDTO cartItemDTO : cartItems) {
            Long productId = cartItemDTO.getProductId();
            Integer quantity = cartItemDTO.getQuantity();

            Product product = findProductById(productId);
            totalPrice += product.getSpecialPrice() * quantity;

            CartItem cartItem = createCartItem(existingCart, product, quantity);

            cartItemRepository.save(cartItem);
        }
        existingCart.setTotalPrice(totalPrice);
        cartRepository.save(existingCart);

        return "Cart updated successfully";
    }

    @Override
    public CartDTO addProductToCart(Long productId, Integer quantity) {
        Cart cart = createCart();

        Product product = findProductById(productId);

        CartItem cartItem = cartItemRepository.findCartItemByProductIdAndCartId(cart.getCartId(), productId);
        if(cartItem != null) {
            throw new APIException("Product with "+product.getProductName()+" alreadvailable in cart");
        }
        if(product.getQuantity() == 0) {
            throw new APIException(product.getProductName() + " is not available");
        }
        validateStock(product, quantity);
        CartItem newCartItem = createCartItem(cart, product, quantity);

        cartItemRepository.save(newCartItem);
        cart.getCartItems().add(newCartItem);

        product.setQuantity(product.getQuantity());

        cart.setTotalPrice(cart.getTotalPrice() + (product.getSpecialPrice() * quantity));
        cartRepository.save(cart);

        return cartMapper.toDTO(cart);
    }

    public Cart createCart() {
        Cart userCart = cartRepository.getCartByEmail(authUtil.loggedInEmail());
        if(userCart != null) {
            return userCart;
        }
        else {
            Cart cart = new Cart();
            cart.setTotalPrice(0.0);
            cart.setUser(authUtil.loggedInUser());
            Cart newCart = cartRepository.save(cart);
            return newCart;
        }
    }

    @Override
    public List<CartDTO> getAllCarts() {
        List<Cart> carts = cartRepository.findAll();

        if(carts.isEmpty()) {
            throw new APIException("No cart exist");
        }

        return carts.stream().map(cart -> cartMapper.toDTO(cart)).toList();
    }
}