import qs from 'qs';
import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AddUserReport, CreateOrder } from '../../services/api/Reports';
import { RootState } from '../../store/State';
import { VNP_CONST } from '../../utils/const/VNPay';
import { AddReport, APIResponse, Order } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { setVerifyToken } from '../../store/authSlice';
import { useTranslation } from 'react-i18next';
import MuiAlert from '@mui/material/Alert';

function PaymentReturnPage() {
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [paymentParams, setPaymentParams] = useSearchParams()
    let vnp_Params: any = {
        vnp_Amount: paymentParams.get("vnp_Amount"),
        vnp_BankCode: paymentParams.get("vnp_BankCode"),
        vnp_BankTranNo: paymentParams.get("vnp_BankTranNo"),
        vnp_CardType: paymentParams.get("vnp_CardType"),
        vnp_OrderInfo: paymentParams.get("vnp_OrderInfo"),
        vnp_PayDate: paymentParams.get("vnp_PayDate"),
        vnp_ResponseCode: paymentParams.get("vnp_ResponseCode"),
        vnp_TmnCode: paymentParams.get("vnp_TmnCode"),
        vnp_TransactionNo: paymentParams.get("vnp_TransactionNo"),
        vnp_TransactionStatus: paymentParams.get("vnp_TransactionStatus"),
        vnp_TxnRef: paymentParams.get("vnp_TxnRef")
    }

    const sortObject = (obj: any): any => {
        let sorted: { [key: string]: any } = {};
        let str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }
    let secureHash = paymentParams.get("vnp_SecureHash")
    vnp_Params = sortObject(vnp_Params)
    const data = qs.stringify(vnp_Params, { encode: false })
    const signedData = CryptoJS.HmacSHA512(data, VNP_CONST.SECRET_KEY).toString()
    const transactionSuccess = vnp_Params.vnp_ResponseCode === '00'
    const [successOrder, setSuccessOrder] = useState(false)
    const [loading, setLoading] = useState(true)
    const vnp_OrderInfo = paymentParams.get("vnp_OrderInfo")
    const vnp_TransactionNo = paymentParams.get("vnp_TransactionNo") as string
    const details = vnp_OrderInfo?.split('-') as string[]
    const check = details[1] === 'None'
    var order: any = {
        transactionId: vnp_TransactionNo,
        orderOptionId: 0
    }
    switch (details[0]) {
        case "1 CHRS Reports":
            order.orderOptionId = 1
            break;
        case "3 CHRS Reports":
            order.orderOptionId = 2
            break;
        case "5 CHRS Reports":
            order.orderOptionId = 3
            break;
    }
    const handleReport = async () => {
        setLoading(true)
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        if (signedData !== secureHash) {
            navigate('/unauthorized')
            return
        }
        if (!check) order['carId'] = details[1]
        if (token) {
            let decodedToken = JWTDecoder(token)
            order['userId'] = decodedToken.nameidentifier
            const orderResponse: APIResponse = await CreateOrder(order, connectAPIError, language)
            if (orderResponse.error) {
                console.log('user bad order', orderResponse.error)
                setLoading(false)
                setSuccessOrder(false)
                return
            }
            if (!check) {
                const reportData: AddReport = {
                    userId: decodedToken.nameidentifier,
                    carId: details[1]
                }
                const addReportResponse: APIResponse = await AddUserReport(reportData, token, connectAPIError, language)
                if (!addReportResponse.error) {
                    setLoading(false)
                    setSuccessOrder(true)
                    navigate(`/car-report/${details[1]}`)
                } else {
                    console.log('failed add report', addReportResponse.error)
                    setLoading(false)
                    setSuccessOrder(false)
                    return
                }
            } else {
                setLoading(false)
                setSuccessOrder(true)
                return
            }
        } else {
            const orderResponse: APIResponse = await CreateOrder(order, connectAPIError, language)
            if (!orderResponse.error) {
                console.log(orderResponse.data)
                console.log(orderResponse.data.token)
                const verifyToken = dispatch(setVerifyToken(orderResponse.data.token))
                setLoading(false)
                setSuccessOrder(true)
                navigate(`/car-report/${details[1]}`)
            } else {
                console.log('ano bad order', orderResponse.error)
                setLoading(false)
                setSuccessOrder(false)
                return
            }
        }
    }
    useEffect(() => {
        if (transactionSuccess)
            handleReport();
    }, []);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, [])
    return (
        <div className="pol-alert-page">
            <div className="code-container">
                <div className="verification-success">
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                        <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                    {loading ? (
                        <>
                            <p>{t('Transaction successful! Please wait until we complete remaining operations')}!</p>
                            <div className="loading"></div>
                        </>
                    ) : successOrder ? (
                        <MuiAlert elevation={6} variant="filled" severity="success" sx={{ width: '100%', zIndex: '2000' }}>
                            {t('Everything is completed! Thanks for your support of our system')}!
                        </MuiAlert>
                    ) : (
                        <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '100%', zIndex: '2000' }}>
                            {t('Something went wrong in the process. Please contact admin for support')}! {t('Your transaction ID')}: {vnp_TransactionNo}
                        </MuiAlert>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PaymentReturnPage;