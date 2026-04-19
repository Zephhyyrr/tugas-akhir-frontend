import { BaseService } from './BaseService';
import { endpoints } from '~/infrastructure/http/endpoints';
import type { ILoginPayload, ILoginResponse, IForgotPasswordPayload, IResetPasswordPayload, IVerifyEmailPayload } from '~/domain/models/IAuth';
import type { IApiResponse } from '~/domain/types/IApiResponse';

export class AuthService extends BaseService {
    static async login(payload: ILoginPayload): Promise<IApiResponse<ILoginResponse>> {
        return await this.api<IApiResponse<ILoginResponse>>(endpoints.AUTH.LOGIN, {
            method: 'POST',
            body: payload
        });
    }

    static async logout(): Promise<IApiResponse<null>> {
        return await this.api<IApiResponse<null>>(endpoints.AUTH.LOGOUT, {
            method: 'POST'
        });
    }

    static async forgotPassword(payload: IForgotPasswordPayload): Promise<IApiResponse<null>> {
        return await this.api<IApiResponse<null>>(endpoints.AUTH.FORGOT_PASSWORD, {
            method: 'POST',
            body: payload
        });
    }

    static async resetPassword(payload: IResetPasswordPayload): Promise<IApiResponse<null>> {
        return await this.api<IApiResponse<null>>(endpoints.AUTH.RESET_PASSWORD, {
            method: 'POST',
            body: payload
        });
    }

    static async verifyEmail(payload: IVerifyEmailPayload): Promise<IApiResponse<null>> {
        return await this.api<IApiResponse<null>>(endpoints.AUTH.VERIFY_EMAIL, {
            method: 'POST',
            body: payload
        });
    }

    static async getMe(): Promise<IApiResponse<ILoginResponse>> {
        return await this.api<IApiResponse<ILoginResponse>>(endpoints.AUTH.ME, {
            method: 'GET',
            query: {
                _ts: Date.now(),
            },
        });
    }
}