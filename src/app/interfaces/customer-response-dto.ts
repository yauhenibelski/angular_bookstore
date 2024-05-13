export interface Customer {
    addresses: Array<{ id: string; country: string }>;
    email: string;
    firstName: string;
    id: string;
    isEmailVerified: boolean;
    lastName: string;
    password: string;
    version: number;
    createdAt: string;
    lastModifiedAt: string;
    authenticationMode: string;
    stores: unknown[]; //
    billingAddressIds?: unknown[];
    createdBy?: unknown;
    defaultShippingAddressId?: string;
    lastMessageSequenceNumber?: number;
    lastModifiedBy?: unknown;
    shippingAddressIds?: string[];
    versionModifiedAt?: string;
}

export interface CustomerResponseDto {
    customer: Customer;
}
