import { useEffect, useState } from 'react';
import Layouts from '../../../components/dashboard/Layouts';
import { toRupiah } from '../../../utils/tools';

const listInput = [
  [{ t: 'Persentase (%)', p: '.....', n: 1 }],
  [{ t: 'Dana Stand (Rp)', p: '.....', n: 1 }, { t: 'Prediksi Dana Stand (Rp)', p: '.....', d: 1 }],
  [{ t: 'Dana Kecamatan (Rp)', p: '.....', n: 1 }, { t: 'Prediksi Dana Kecamatan (Rp)', p: '.....', d: 1 }],
  [{ t: 'Dana Pemda (Rp)', p: '.....', n: 1 }, { t: 'Prediksi Dana Pemda (Rp)', p: '.....', d: 1 }],
  [{ t: 'Dana Sponsor (Rp)', p: '.....', n: 1 }, { t: 'Prediksi Dana Sponsor (Rp)', p: '.....', d: 1 }],
  [{ t: 'Total (Rp)', p: '.....', d: 1 }],
];

const PrediksiPage = () => {
  const [isPredik, setPredik] = useState({});
  const [isPersen, setPersen] = useState();
  const [isTotal, setTotal] = useState('0');
  const [predictions, setPredictions] = useState({});

  useEffect(() => {
    const newPredik = {};
    const inputKey = Object.keys(isPredik).filter(key => key.startsWith('Dana') && isPredik[key]);
    const totalPredik = inputKey.reduce((sum, key) => {
      const inputVal = parseInt(isPredik[key].replace(/\D/g, ''), 10);
      const predikKey = `Prediksi ${key}`;
      const persen = (inputVal / 100) * (isPersen || 100);
      newPredik[predikKey] = toRupiah(persen);
      return sum + parseInt(newPredik[predikKey].replace(/\D/g, ''), 10);
    }, 0);

    setPredictions({ ...isPredik, ...newPredik });
    setTotal(toRupiah(totalPredik));
  }, [isPredik, isPersen]);

  const handlePrediksi = (e) => {
    const { name, value } = e.target;
    if (name === 'Persentase (%)') {
      setPersen(Number(value) || '');
    } else {
      setPredik({ ...isPredik, [name]: value });
    }
  };

  return (
    <div>
      <Layouts title={'Prediksi Anggaran'}>
        <div className='flex flex-col gap-5 rounded-xl bg-gray-50 border-back p-5'>
          {listInput.map((row, rowIndex) => (
            <div key={rowIndex} className='flex flex-col lg:flex-row gap-5'>
              {row.map((input, colIndex) => (
                <div key={colIndex} className='input-body'>
                  <label>{input.t}</label>
                  <input
                    onChange={handlePrediksi}
                    type={input.n ? 'number' : 'text'}
                    value={input.t === 'Persentase (%)' ? isPersen : (input.t === 'Total (Rp)' ? isTotal : (predictions[input.t] || isPredik[input.t] || ''))}
                    id={input.t}
                    name={input.t}
                    disabled={!!input.d}
                    placeholder={input.p}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Layouts>
    </div>
  );
};

export default PrediksiPage;
