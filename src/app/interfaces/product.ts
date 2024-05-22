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

interface Price {
    id: string;
    value: PriceValue;
    key: string;
}

interface ImagDimensions {
    w: number;
    h: number;
}

interface Image {
    url: string;
    label: string;
    dimensions: ImagDimensions;
}

interface Attribute {
    name: string;
    value: string;
}

interface MasterVariant {
    id: number;
    key: string;
    prices: Price[];
    images: Image[];
    attributes: Attribute[];
    assets: unknown[];
}

interface Product {
    name: Language;
    description: Language;
    categories: Categories[];
    slug: Language;
    categoryOrderHints: unknown;
    variants: unknown[];
    searchKeywords: unknown;
    masterVariant: MasterVariant;
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
