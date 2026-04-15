import { BaseService } from './BaseService';
import { endpoints } from '~/infrastructure/http/endpoints';
import type { 
    IKeteranganTransaksi, 
    ICreateKeteranganTransaksiPayload, 
    IUpdateKeteranganTransaksiPayload 
} from '~/domain/models/IKeteranganTransaksi';
import type { IApiResponse } from '~/domain/types/IApiResponse';
import type { IPaginationQuery } from '~/domain/types/IPaginationQuery';

export class KeteranganTransaksiService extends BaseService {
    static async getAll(params?: IPaginationQuery): Promise<IApiResponse<IKeteranganTransaksi[]>> {
        return await this.api<IApiResponse<IKeteranganTransaksi[]>>(endpoints.KETERANGAN_TRANSAKSI.GET_ALL, {
            method: 'GET',
            query: params,
        });
    }

    static async getById(id: number): Promise<IApiResponse<IKeteranganTransaksi>> {
        return await this.api<IApiResponse<IKeteranganTransaksi>>(endpoints.KETERANGAN_TRANSAKSI.GET_BY_ID(id), {
            method: 'GET',
        });
    }

    static async create(payload: ICreateKeteranganTransaksiPayload): Promise<IApiResponse<IKeteranganTransaksi>> {
        return await this.api<IApiResponse<IKeteranganTransaksi>>(endpoints.KETERANGAN_TRANSAKSI.CREATE, {
            method: 'POST',
            body: payload,
        });
    }

    static async update(id: number, payload: IUpdateKeteranganTransaksiPayload): Promise<IApiResponse<IKeteranganTransaksi>> {
        return await this.api<IApiResponse<IKeteranganTransaksi>>(endpoints.KETERANGAN_TRANSAKSI.UPDATE(id), {
            method: 'PUT',
            body: payload,
        });
    }

    static async delete(id: number): Promise<IApiResponse<null>> {
        return await this.api<IApiResponse<null>>(endpoints.KETERANGAN_TRANSAKSI.DELETE(id), {
            method: 'DELETE',
        });
    }
}