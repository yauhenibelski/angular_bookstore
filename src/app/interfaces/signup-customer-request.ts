interface Addresses {
    country: string;
    city: string;
    streetName: string;
    postalCode: string;
}

export interface SignupCustomer {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    addresses: Addresses[];
    shippingAddresses: number[];
    billingAddresses: number[];
    defaultShippingAddress?: number;
    defaultBillingAddress?: number;
    dateOfBirth: string;
}
