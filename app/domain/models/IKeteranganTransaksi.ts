import type { ITransaksi } from './ITransaksi';

export interface IKeteranganTransaksi {
    id: number;
    nama: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    transactions: ITransaksi[];
}

export interface ICreateKeteranganTransaksiPayload extends Omit<IKeteranganTransaksi, 'id' | 'isDeleted' | 'createdAt' | 'updatedAt' | 'transactions'> {}

export interface IUpdateKeteranganTransaksiPayload extends Partial<Omit<IKeteranganTransaksi, 'id' | 'isDeleted' | 'createdAt' | 'updatedAt' | 'transactions'>> {}