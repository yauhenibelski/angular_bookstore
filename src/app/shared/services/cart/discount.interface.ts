interface Id {
    typeId: string;
    id: string;
}

interface Description {
    en?: string;
    'en-US'?: string;
}

interface PlatformClient {
    isPlatformClient: boolean;
    user: Id;
}

export interface DiscountCode {
    id: string;
    version: number;
    versionModifiedAt: string;
    lastMessageSequenceNumber: number;
    createdAt: string;
    lastModifiedAt: string;
    cartDiscounts: Id[];
    description: Description;
    name: Description;
    lastModifiedBy: PlatformClient;
    createdBy: PlatformClient;
    code: string;
    key: string;
    isActive: boolean;
    references: never[];
    validFrom: string;
    validUntil: string;
    groups: never[];
}
export interface DiscountDto {
    limit: number;
    offset: number;
    count: number;
    total: number;
    results: DiscountCode[];
}
