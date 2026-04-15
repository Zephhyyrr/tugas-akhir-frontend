
export interface IPaginationMeta {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface IApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: IPaginationMeta;
}