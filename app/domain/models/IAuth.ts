import type { IUser } from './IUser';

export interface ILoginResponse {
    token: string;
    user: IUser;
}

export interface ILoginPayload {
    email: string;
    password: string;
}

export interface IVerifyEmailPayload {
    token: string;
}

export interface IForgotPasswordPayload {
    email: string;
}

export interface IResetPasswordPayload {
    token: string;
    newPassword: string;
}