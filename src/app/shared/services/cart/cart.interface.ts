interface TotalPrice {
    type: string;
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
}

export interface Cart {
    type: string;
    id: string;
    version: number;
    createdAt: string;
    lastModifiedAt: string;
    lineItems: unknown[];
    cartState: string;
    totalPrice: TotalPrice;
    shippingMode: string;
    shipping: unknown[];
    customLineItems: unknown[];
    discountCodes: unknown[];
    directDiscounts: unknown[];
    inventoryMode: string;
    taxMode: string;
    taxRoundingMode: string;
    taxCalculationMode: string;
    refusedGifts: unknown[];
    origin: string;
    itemShippingAddresses: unknown[];
}
export interface CartResponseDto {
    count: number;
    limit: number;
    offset: number;
    results: Cart[];
    total: number;
}
