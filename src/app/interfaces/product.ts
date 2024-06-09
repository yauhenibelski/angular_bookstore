interface ProductType {
    typeId: string;
    id: string;
}

interface Language {
    en: string;
}

interface Categories {
    typeId: string;
    id: string;
}

interface PriceValue {
    type: string;
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
}

interface Discount {
    typeId: string;
    id: string;
}

interface Price {
    id: string;
    value: PriceValue;
    key: string;
    discounted?: {
        value: PriceValue;
        discount: Discount;
    };
}

interface ImagDimensions {
    w: number;
    h: number;
}

export interface Image {
    url: string;
    label: string;
    dimensions: ImagDimensions;
}

interface Attribute {
    name: string;
    value: string;
}

interface Variant {
    id: number;
    key: string;
    prices: Price[];
    attributes: Attribute[];
    assets: unknown[];
    images: Image[];
}

export interface Product {
    name: Language;
    description: Language;
    categories: Categories[];
    slug: Language;
    categoryOrderHints: unknown;
    variants: unknown[];
    searchKeywords: unknown;
    masterVariant: Variant;
    id: string;
    key: string;
    productId?: string;
    variant?: Variant;
}

interface MasterData {
    published: boolean;
    hasStagedChanges: boolean;
    current: Product;
    staged: Product;
}

export interface ProductDto {
    id: string;
    version: number;
    versionModifiedAt: string;
    lastMessageSequenceNumber: number;
    createdAt: string;
    lastModifiedAt: string;
    lastModifiedBy: unknown;
    createdBy: unknown;
    productType: ProductType;
    masterData: MasterData;
    key: string;
    lastVariantId: number;
}

export interface ProductsDto {
    count: number;
    limit: number;
    total: number;
    offset: number;
    results: Product[];
}
