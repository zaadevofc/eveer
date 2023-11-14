export const tanggalIndo = (tanggal) => {
    const bulan = [
        '',
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember'
    ]

    const pecahkan = tanggal.split('-');
    return `${pecahkan[2]} ${bulan[parseInt(pecahkan[1])]} ${pecahkan[0]}`;
}