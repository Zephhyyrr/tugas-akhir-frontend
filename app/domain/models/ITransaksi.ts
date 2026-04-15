import type { IUser } from './IUser';
import type { IKeteranganTransaksi } from './IKeteranganTransaksi';

export interface ITransaksi {
    id: number;
    saldo: number;
    kredit: number;
    debet: number;
    uraian: string;
    tanggal: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    userId: number;
    keteranganTransaksiId: number;
    user?: IUser;
    keteranganTransaksi?: IKeteranganTransaksi;
}

export interface ICreateTransaksiPayload extends Omit<ITransaksi, 'id' | 'saldo' | 'isDeleted' | 'createdAt' | 'updatedAt' | 'user' | 'userId' | 'keteranganTransaksi'> {}

export interface IUpdateTransaksiPayload extends Partial<ICreateTransaksiPayload> {}