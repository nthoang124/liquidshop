export interface IParentCategory {
  _id: string;
  name: string;
}

export interface ICategory {
  _id: string;
  name: string;
  imageUrl: string;
  description: string;
  parentCategory: IParentCategory | null;
  __v?: number;
}

export interface ICategoryListRespose {
  success: boolean;
  count: number;
  data: ICategory[];
}

export interface ICategoryCreate {
  name: string;
  imageUrl: string;
  description: string;
  parentCategory: string | null;
}
