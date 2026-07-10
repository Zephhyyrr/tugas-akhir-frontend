import * as XLSX from 'xlsx';
import type { ITransaksi } from '../../domain/models/ITransaksi';

const formatMonthName = (month: number) => {
  const monthOptions = [
    { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' }, { value: 3, label: 'Maret' },
    { value: 4, label: 'April' }, { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' }, { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' }, { value: 11, label: 'November' }, { value: 12, label: 'Desember' }
  ];
  return monthOptions.find((m) => m.value === month)?.label || `Bulan-${month}`;
};

const formatDate = (value: string) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const getDebit = (tx: ITransaksi) => {
  return Number(tx.debit) || (tx.tipe === 'uang_masuk' ? Number(tx.nominal || 0) : 0);
};

const getKredit = (tx: ITransaksi) => {
  return Number(tx.kredit) || (tx.tipe === 'uang_keluar' ? Number(tx.nominal || 0) : 0);
};

const sortRows = (rows: ITransaksi[]) => {
  return [...rows].sort((a, b) => {
    const aTime = new Date(a.tanggal).getTime();
    const bTime = new Date(b.tanggal).getTime();
    if (aTime !== bTime) return aTime - bTime;
    return a.id - b.id;
  });
};

const buildSheet = (workbook: XLSX.WorkBook, year: number, month: number, rows: ITransaksi[], allFilteredRows: ITransaksi[]) => {
  const previousTransactions = allFilteredRows.filter((tx: any) => {
    const txDate = new Date(tx.tanggal);
    if (txDate.getFullYear() < year) return true;
    if (txDate.getFullYear() === year && txDate.getMonth() + 1 < month) return true;
    return false;
  });

  const saldoAwal = previousTransactions.reduce((sum, tx) => {
    return sum + getDebit(tx) - getKredit(tx);
  }, 0);

  const sortedRows = sortRows(rows);
  let runningSaldo = saldoAwal;

  const detailRows = sortedRows.map((item, index) => {
    const debit = getDebit(item);
    const kredit = getKredit(item);
    runningSaldo += debit - kredit;
    return [
      index + 2,
      formatDate(item.tanggal),
      item.uraian || '-',
      debit || '',
      kredit || '',
      runningSaldo,
      debit > 0 ? 'Uang Masuk' : 'Uang Keluar'
    ];
  });

  const totalDebitMonth = sortedRows.reduce((sum, tx) => sum + getDebit(tx), 0);
  const totalKreditMonth = sortedRows.reduce((sum, tx) => sum + getKredit(tx), 0);

  const sheetData: (string | number)[][] = [
    ['LAPORAN KEUANGAN KAS'],
    ['SURAU ZAMZAM'],
    ['JL. MUTIARA I RT.003 RW. 008'],
    [''],
    [`BULAN: ${formatMonthName(month).toUpperCase()} ${year}`],
    ['NO', 'TANGGAL', 'URAIAN', 'DEBET', 'KREDIT', 'SALDO', 'KETERANGAN'],
    [1, '', 'Saldo Pindahan', '', '', saldoAwal, 'Saldo Awal']
  ];

  sheetData.push(...detailRows);
  sheetData.push(['', '', 'Jumlah', totalDebitMonth, totalKreditMonth, runningSaldo, 'Saldo Akhir']);

  sheetData.push(['']);
  sheetData.push(['', '', '', '', 'Bendahara Surau Zam Zam']);
  sheetData.push(['']);
  sheetData.push(['']);
  sheetData.push(['', '', '', '', 'Yudi Iskandar, S.Kom']);

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  worksheet['!merges'] = [
    XLSX.utils.decode_range('A1:G1'),
    XLSX.utils.decode_range('A2:G2'),
    XLSX.utils.decode_range('A3:G3'),
    XLSX.utils.decode_range('A5:G5')
  ];
  worksheet['!cols'] = [
    { wch: 5 }, { wch: 15 }, { wch: 45 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, formatMonthName(month).slice(0, 3));
};

export const exportLaporanKasToExcel = (
  exportMode: 'monthly' | 'yearly',
  exportYear: number,
  exportMonth: number,
  allFilteredRows: ITransaksi[]
) => {
  const workbook = XLSX.utils.book_new();

  if (exportMode === 'monthly') {
    const monthRows = allFilteredRows.filter((tx: any) => {
      const txDate = new Date(tx.tanggal);
      return txDate.getFullYear() === exportYear && txDate.getMonth() + 1 === exportMonth;
    });

    buildSheet(workbook, exportYear, exportMonth, monthRows, allFilteredRows);
    XLSX.writeFile(workbook, `Laporan_Kas_${formatMonthName(exportMonth)}_${exportYear}.xlsx`);
    return;
  }

  for (let month = 1; month <= 12; month += 1) {
    const monthRows = allFilteredRows.filter((tx: any) => {
      const txDate = new Date(tx.tanggal);
      return txDate.getFullYear() === exportYear && txDate.getMonth() + 1 === month;
    });
    buildSheet(workbook, exportYear, month, monthRows, allFilteredRows);
  }

  XLSX.writeFile(workbook, `Laporan_Kas_Tahunan_${exportYear}.xlsx`);
};
