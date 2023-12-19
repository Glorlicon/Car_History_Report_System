import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckCar, GetCar } from '../../services/api/Car';
import { AddUserReport, CheckReportExist, GetReport } from '../../services/api/Reports';
import { Get } from '../../services/api/Users';
import { RootState } from '../../store/State';
import '../../styles/CarHistoryReportPage.css'
import { AddReport, APIResponse } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { isValidPlateNumber, isValidVIN } from '../../utils/Validators';
function CarHistoryReportPage() {
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
            if (!token) navigate(`/payment/${vin}`)
            else {
                const id = JWTDecoder(token).nameidentifier
                const reportData: AddReport = {
                    userId: id,
                    carId: vin
                }
                const checkReportExist: APIResponse = await CheckReportExist(reportData, token, connectAPIError, language)
                if (checkReportExist.error) {
                    const userResponse: APIResponse = await Get(id, token, connectAPIError, unknownError, language)
                    if (userResponse.data.maxReportNumber > 0) {
                        const addReportResponse: APIResponse = await AddUserReport(reportData, token, connectAPIError, language)
                        if (addReportResponse.error) {
                            setIsLoading(false);
                            setVinError(addReportResponse.error)
                        } else {
                            setIsLoading(false);
                            navigate(`/car-report/${vin}`)
                        }
                    } else {
                        setIsLoading(false);
                        navigate(`/payment/${vin}`)
                    }
                } else {
                    setIsLoading(false);
                    navigate(`/car-report/${vin}`)
                }
            }
        }
    };

    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, [])
    return (
        <div className="report-container">
            <h2>{t('Car History Reports')}</h2>
            <a>{t('Avoid bying a car with costly hidden problems by getting a CHRS Report now')}.</a>

            <div className="report-search-section">
                <label>{t('Search by VIN')}</label>
                <input type="text" value={vin} onChange={(e) => setVin(e.target.value)} placeholder={t('Enter VIN')} />
                <button onClick={handleVINCheck}>
                    {isLoading ? (
                        <div className="report-loading-spinner"></div>
                    ) : t('Get CHRS Report')}
                </button>
                {vinError && <div className="report-search-error">{vinError}</div>}
            </div>
            <div className="report-links-section">
                {token ? (
                    <>
                        <p>{t('Ran out of reports')}? <a href="/payment">{t('Get CHRS Reports')}</a></p>
                        <p>{t('Already bought a report')}? <a href="/profile">{t('Go to profile to view your reports')}</a></p>
                    </>
                ) : (
                    <p>{t('Already bought a report')}? <a href="/login">{t('Sign in to view the reports')}</a></p>
                )}
            </div>
        </div>
    );
}

export default CarHistoryReportPage;