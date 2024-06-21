import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { IS_FILTER_DISABLED } from 'src/app/shared/services/api/http-context-token';
import { SortProductService } from 'src/app/shared/services/sort-product/sort-product.service';

export const setFilterValueInterceptor: HttpInterceptorFn = (req, next) => {
    const sortProductService = inject(SortProductService);
    const isFilterRequest = req.url.startsWith('/product-projections/search');
    const hasFilterDisabledContext = req.context.has(IS_FILTER_DISABLED);

    if (isFilterRequest && !hasFilterDisabledContext) {
        const params: { [key: string]: string } = {
            limit: '15',
            offset: `${sortProductService.offset}`,
        };

        if (sortProductService.params.sort) {
            params['sort'] = sortProductService.params.sort;
        }

        if (sortProductService.params.filter) {
            params['filter'] = sortProductService.params.filter;
        }

        const newReq = req.clone({
            url: sortProductService.categoryID
                ? `${
                      req.url
                  }?filter=${encodeURIComponent(`categories.id:"${sortProductService.categoryID}"`)}`
                : req.url,
            setParams: params,
        });

        return next(newReq);
    }

    return next(req);
};
