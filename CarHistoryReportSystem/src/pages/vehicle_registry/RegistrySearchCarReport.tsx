import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { RootState } from '../../store/State';
import { isValidPlateNumber, isValidVIN } from '../../utils/Validators';
import MuiAlert from '@mui/material/Alert';
import { APIResponse } from '../../utils/Interfaces';
import { CheckCar } from '../../services/api/Car';

function RegistrySearchCarReport() {
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const navigate = useNavigate()
    const [vin, setVin] = useState('')
    const [plate, setPlate] = useState('')
    const [vinError, setVinError] = useState<string | null>(null);
    const [plateError, setPlateError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleVINCheck = async () => {
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let unknownError = t('Something went wrong. Please try again')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        if (!vin) {
            setVinError(t('Please enter VIN'));
        } else if (!isValidVIN(vin)) {
            setVinError(t('The VIN entered is invalid. Please check and try again'));
        } else {
            const checkCar: APIResponse = await CheckCar(vin, connectAPIError, language)
            if (checkCar.error) {
                setVinError(checkCar.error)
                return
            }
            setVinError(null);
            setIsLoading(true);
            navigate(`/registry/car-report/${vin}`)
        }
    };
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
    return (
        <div className="report-container">
            <h2>{t('Car History Reports')}</h2>
            <a>{t('View detailed information about the car using CHRS Report')}</a>
            <div className="report-search-section">
                <label>{t('Search by VIN')}</label>
                <input type="text" value={vin} onChange={(e) => setVin(e.target.value)} placeholder={t('Enter VIN')} />
                <button onClick={handleVINCheck}>
                    {isLoading ? (
                        <div className="report-loading-spinner"></div>
                    ) : (
                        t('Get CHRS Report')
                    )}
                </button>
                {vinError &&
                    <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '100%', zIndex: '2000', marginTop: '5px' }}>
                        {vinError}
                    </MuiAlert>}
            </div>
        </div>
    );
}

export default RegistrySearchCarReport;