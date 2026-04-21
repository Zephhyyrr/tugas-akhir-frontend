import type { IUser } from './IUser';

export interface IContent {
    id: number;
    isDeleted: boolean;
    judul: string;
    isi: string;
    gambarUrl: string | null;
    videoUrl: string | null;
    status: 'draft' | 'published' | string;
    createdAt: string;
    updatedAt: string;
    userId: number;
    user?: IUser;
}

// Create Payload
export interface ICreateContentPayload extends Omit<IContent, 'id' | 'isDeleted' | 'createdAt' | 'updatedAt' | 'user' | 'userId' | 'status' | 'gambarUrl' | 'videoUrl'> {
    gambarUrl?: File | File[] | null;
    videoUrl?: File | File[] | null;
}

// Update Payload
export interface IUpdateContentPayload extends Partial<Omit<IContent, 'id' | 'isDeleted' | 'createdAt' | 'updatedAt' | 'user' | 'userId' | 'gambarUrl' | 'videoUrl'>> {
    gambarUrl?: File | File[] | null;
    videoUrl?: File | File[] | null;
}

// Published Payload
export interface IPublishedPayload {
    status: 'published' | 'draft';
}