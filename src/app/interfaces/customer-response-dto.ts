export interface Address {
    id?: string;
    country: string;
    postalCode: string;
    streetName: string;
    city: string;
}

export interface Addresses {
    shipping: Address[];
    billing: Address[];
}

export interface Customer {
    addresses: Address[];
    email: string;
    firstName: string;
    id: string;
    isEmailVerified: boolean;
    dateOfBirth: string;
    lastName: string;
    password: string;
    version: number;
    createdAt: string;
    lastModifiedAt: string;
    authenticationMode: string;
    stores: unknown[];
    billingAddressIds: string[];
    createdBy?: unknown;
    defaultShippingAddressId?: string;
    lastMessageSequenceNumber?: number;
    lastModifiedBy?: unknown;
    shippingAddressIds: string[];
    versionModifiedAt?: string;
}
export interface CustomerResponseDto {
    customer: Customer;
}
