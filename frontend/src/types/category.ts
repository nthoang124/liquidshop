export interface IParentCayegory {
    id: string;
    name: string;
}


export interface ICategory {
    id: string;
    name: string;
    imageUrl: string;
    parentCategory: IParentCayegory | null;
    _v?: number;
}

export interface ICategoryListRespose {
    success: boolean;
    count: number;
    data: ICategory[];
}