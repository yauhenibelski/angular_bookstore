interface Name {
    'en-US': string;
}

interface Parent {
    typeId: string;
    id: string;
}

export interface Category {
    ancestors: unknown[];
    assets: unknown[];
    createdAt: string;
    createdBy: unknown;
    id: string;
    key: string;
    lastMessageSequenceNumber: number;
    lastModifiedAt: string;
    lastModifiedBy: unknown;
    name: Name;
    orderHint: string;
    slug: Name;
    version: number;
    versionModifiedAt: string;
    parent?: Parent;
}

export interface CategoryDto {
    count: number;
    limit: number;
    total: number;
    offset: number;
    results: Category[];
}
