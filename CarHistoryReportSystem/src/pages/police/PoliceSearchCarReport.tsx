import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { RootState } from '../../store/State';
import { isValidPlateNumber, isValidVIN } from '../../utils/Validators';

function PoliceSearchCarReport() {
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
            setVinError('Please enter VIN.');
        } else if (!isValidVIN(vin)) {
            setVinError('The VIN entered is invalid. Please check and try again.');
        } else {
            setVinError(null);
            setIsLoading(true);
            navigate(`/police/car-report/${vin}`)
        }
    };
    return (
        <div className="report-container">
            <h2>Car History Reports</h2>
            <a>View detailed information about the car using CHRS Report</a>
            <div className="report-search-section">
                <label>Search by VIN</label>
                <input type="text" value={vin} onChange={(e) => setVin(e.target.value)} placeholder="Enter VIN" />
                <button onClick={handleVINCheck}>
                    {isLoading ? (
                        <div className="report-loading-spinner"></div>
                    ) : (
                        'Get CHRS Report'
                    )}
                </button>
                {vinError && <div className="report-search-error">{vinError}</div>}
            </div>
        </div>
    );
}

export default PoliceSearchCarReport;