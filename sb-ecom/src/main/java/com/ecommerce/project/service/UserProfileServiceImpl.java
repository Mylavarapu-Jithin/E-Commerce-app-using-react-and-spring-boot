package com.ecommerce.project.service;

import com.ecommerce.project.model.Order;
import com.ecommerce.project.model.User;
import com.ecommerce.project.model.UserImage;
import com.ecommerce.project.payload.AdminProfileResponse;
import com.ecommerce.project.payload.SellerProfileResponse;
import com.ecommerce.project.repositories.OrderRepository;
import com.ecommerce.project.repositories.UserImageRepository;
import com.ecommerce.project.security.response.UserProfileResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    @Value("${image.base.url}")
    private String imageBaseUrl;

    @Value("${project.image}")
    private String path;

    @Autowired OrderRepository orderRepository;

    @Autowired UserImageRepository userImageRepository;

    @Autowired FileService fileService;

    public String constructImageUrl(String fileName) {
        if (fileName == null) return null;
        return imageBaseUrl.endsWith("/") ? imageBaseUrl + fileName : imageBaseUrl + "/" + fileName;
    }

    @Override
    public UserProfileResponse getBaseProfile(User user) {
        List<Order> userOrders = orderRepository.findAllByEmail(user.getEmail());

        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getUserId());
        response.setUsername(user.getUserName());
        response.setEmail(user.getEmail());
        response.setRoles(user.getRoles().stream().
                map(role -> role.getRoleName().name()).toList());
        response.setTotalOrders((long) userOrders.size());
        response.setTotalSpent(userOrders.stream().mapToDouble(Order::getTotalAmount).sum());

        if (user.getUserImage() != null) {
            response.setImageUrl(constructImageUrl(user.getUserImage().getFileName()));
        }

        return response;
    }

    @Override
    public AdminProfileResponse getAdminProfile(User user) {
        SellerProfileResponse base = getSellerProfile(user);
        AdminProfileResponse adminResponse = new AdminProfileResponse();
        BeanUtils.copyProperties(base, adminResponse);
        adminResponse.setTotalApplicationOrders(orderRepository.countAllOrders());

        return adminResponse;
    }

    @Override
    public SellerProfileResponse getSellerProfile(User user) {
        UserProfileResponse base = getBaseProfile(user);
        SellerProfileResponse sellerResponse = new SellerProfileResponse();
        BeanUtils.copyProperties(base, sellerResponse);
        sellerResponse.setSellerProductOrdersCount(orderRepository.countOrdersBySellerProducts(user.getUserId()));

        return sellerResponse;
    }

    @Transactional
    public String updateProfilePicture(User user, MultipartFile file) throws IOException {
        if (user.getUserImage() != null) {
            fileService.deleteImage(path, user.getUserImage().getFileName());
        }

        String fileName = fileService.uploadImage(path, file);

        UserImage userImage = user.getUserImage();
        if (userImage == null) {
            userImage = new UserImage();
            userImage.setUser(user);
        }
        userImage.setFileName(fileName);
        userImageRepository.save(userImage);

        return constructImageUrl(fileName);
    }

    @Transactional
    public void deleteProfilePicture(User user) throws IOException {
        if (user.getUserImage() != null) {
            fileService.deleteImage(path, user.getUserImage().getFileName());
            userImageRepository.delete(user.getUserImage());
            user.setUserImage(null);
        }
    }
}