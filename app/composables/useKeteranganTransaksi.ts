import { KeteranganTransaksiService } from '~/application/services/KeteranganTransaksiService';
import type { 
    ICreateKeteranganTransaksiPayload, 
    IUpdateKeteranganTransaksiPayload 
} from '~/domain/models/IKeteranganTransaksi';
import type { IPaginationQuery } from '~/domain/types/IPaginationQuery';

export const useKeteranganTransaksi = () => {
    const fetchKeteranganList = (params: Ref<IPaginationQuery>) => {
        return useAsyncData(
            'keterangan-transaksi-list',
            () => KeteranganTransaksiService.getAll(params.value),
            { watch: [params] }
        );
    };

    const fetchKeteranganDetail = (id: number) => {
        return useAsyncData(
            `keterangan-detail-${id}`,
            () => KeteranganTransaksiService.getById(id)
        );
    };

    const createKeterangan = async (payload: ICreateKeteranganTransaksiPayload) => {
        return await KeteranganTransaksiService.create(payload);
    };

    const updateKeterangan = async (id: number, payload: IUpdateKeteranganTransaksiPayload) => {
        return await KeteranganTransaksiService.update(id, payload);
    };

    const deleteKeterangan = async (id: number) => {
        return await KeteranganTransaksiService.delete(id);
    };

    return {
        fetchKeteranganList,
        fetchKeteranganDetail,
        createKeterangan,
        updateKeterangan,
        deleteKeterangan
    };
};