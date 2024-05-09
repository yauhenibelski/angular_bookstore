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
    defaultShippingAddress: number;
    defaultBillingAddress: number;
    dateOfBirth: string;
}
// '"2018-10-12T14:00:00.000Z"'
