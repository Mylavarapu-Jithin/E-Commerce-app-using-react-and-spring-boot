package com.ecommerce.project.util;

import com.ecommerce.project.model.Product;
import com.ecommerce.project.payload.PagedResponse;
import com.ecommerce.project.payload.ProductDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Supplier;

@Component
public class PagedResponseBuilder {

    @Autowired
    ModelMapper modelMapper;

    @Value("${image.base.url}")
    private String imageBaseUrl;

    public <T, D, R extends PagedResponse<D>> R build(
            Page<T> page,
            Class<D> dtoClass,
            Supplier<R> responseSupplier,
            boolean includeImage
    ) {

        List<D> content = page.getContent()
                .stream()
                .map(entity -> {
                    D dto = modelMapper.map(entity, dtoClass);

                    if (includeImage && dto instanceof ProductDTO productDTO) {
                        Product product = (Product) entity;
                        productDTO.setImage(constructImageUrl(product.getImage()));
                    }

                    return dto;
                })
                .toList();

        R response = responseSupplier.get();
        response.setContent(content);
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setLastPage(page.isLast());

        return response;
    }

    private String constructImageUrl(String imageName) {
        return imageBaseUrl.endsWith("/") ? imageBaseUrl+imageName : imageBaseUrl+'/'+imageName;
    }
}
