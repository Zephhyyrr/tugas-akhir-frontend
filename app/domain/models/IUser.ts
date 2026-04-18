export interface IUser {
    id: number;
    email: string;
    nama: string;
    role: 'superadmin' | 'admin' | string; 
    fotoProfile: string | null;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Create Payload
export interface ICreateUserPayload extends Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'isVerified' | 'fotoProfile'> {
    password: string;
}

// Update Payload
export interface IUpdateUserPayload extends Partial<Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'isVerified' | 'fotoProfile'>> {
    password?: string;
}

// Foto Profil Payload
export interface IUpdateUserFotoPayload {
    fotoProfile: File;
}

export interface IActivateUserPayload {
    isActive: boolean;
}