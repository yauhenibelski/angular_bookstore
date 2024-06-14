import { Product } from 'src/app/interfaces/product';

interface TotalPrice {
    type: string;
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
}

interface DiscountedAmount {
    type: string;
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
}

interface IncludedDiscount {
    discount: {
        typeId: string;
        id: string;
    };

    discountedAmount: {
        type: string;
        currencyCode: string;
        centAmount: number;
        fractionDigits: number;
    };
}

interface DiscountOnTotalPrice {
    discountedAmount: DiscountedAmount;
    includedDiscounts: IncludedDiscount[];
}

interface DiscountCode {
    discountCode: {
        typeId: string;
        id: string;
    };
    state: string;
}

export interface Cart {
    type: string;
    id: string;
    version: number;
    createdAt: string;
    lastModifiedAt: string;
    lineItems: Product[];
    cartState: string;
    totalPrice: TotalPrice;
    shippingMode: string;
    shipping: unknown[];
    customLineItems: unknown[];
    discountCodes: DiscountCode[];
    directDiscounts: unknown[];
    inventoryMode: string;
    taxMode: string;
    taxRoundingMode: string;
    taxCalculationMode: string;
    refusedGifts: unknown[];
    origin: string;
    itemShippingAddresses: unknown[];
    discountOnTotalPrice?: DiscountOnTotalPrice;
}
export interface CartResponseDto {
    count: number;
    limit: number;
    offset: number;
    results: Cart[];
    total: number;
}

export interface UpdatePayload {
    removeAll?: boolean;
    productId?: string;
    quantity?: number;
    code?: string;
}

interface DiscountCode {
    discountCode: {
        typeId: string;
        id: string;
    };
    state: string;
}
