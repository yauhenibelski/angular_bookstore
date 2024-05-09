interface Customer {
    addresses: Array<{ id: string; country: string }>;
    authenticationMode: string;
    billingAddressIds: unknown[];
    createdAt: string;
    createdBy: unknown;
    defaultShippingAddressId: string;
    email: string;
    firstName: string;
    id: string;
    isEmailVerified: boolean;
    lastMessageSequenceNumber: number;
    lastModifiedAt: string;
    lastModifiedBy: unknown;
    lastName: string;
    password: string;
    shippingAddressIds: string[];
    stores: unknown[];
    version: number;
    versionModifiedAt: string;
}

export interface CustomerResponseDto {
    customer: Customer;
}
