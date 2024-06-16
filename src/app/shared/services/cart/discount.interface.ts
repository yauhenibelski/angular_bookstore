interface Id {
    typeId: string;
    id: string;
}

export interface Description {
    q: string;
}

interface DiscountCode {
    id: string;
    version: number;
    versionModifiedAt: string;
    lastMessageSequenceNumber: number;
    createdAt: string;
    lastModifiedAt: string;
}

export interface DiscountDto {
    limit: number;
    offset: number;
    count: number;
    total: number;
    results: DiscountCode[];
    cartDiscounts: Id[];
}

export const q = {
    lastModifiedBy: {
        isPlatformClient: true,
        user: { typeId: 'user', id: 'ba7b84a6-bf22-4c7f-aa12-e3c2fee7b4f4' },
    },
    createdBy: {
        isPlatformClient: true,
        user: { typeId: 'user', id: '24f363c4-9c2a-4b79-9dff-cdce2d8de17c' },
    },
    code: 'BOOKLOVER20',
    name: { en: '', 'en-US': 'BOOKLOVER20' },
    key: 'BOOKLOVER20',
    description: { en: '', 'en-US': '20% discount on the entire order for new customers.' },
    isActive: true,
    references: [],
    validFrom: '2024-06-10T22:00:00.000Z',
    validUntil: '2024-07-10T22:00:00.000Z',
    groups: [],
};
