import qs from 'qs';
import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AddUserReport, CreateOrder } from '../../services/api/Reports';
import { RootState } from '../../store/State';
import { VNP_CONST } from '../../utils/const/VNPay';
import { AddReport, APIResponse, Order } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';

function PaymentReturnPage() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const navigate = useNavigate()
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

    if (signedData != secureHash) navigate('/unauthorized')

    const vnp_OrderInfo = paymentParams.get("vnp_OrderInfo")
    const vnp_TransactionNo = paymentParams.get("vnp_TransactionNo") as string
    const details = vnp_OrderInfo?.split('-') as string[]
    var order: Order = {
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
        console.log("I'm here")
        if (token) {
            let decodedToken = JWTDecoder(token)
            order.userId = decodedToken.nameidentifier
            const orderResponse: APIResponse = await CreateOrder(order)
            if (orderResponse.error) {
                return
            }
            const reportData: AddReport = {
                userId: decodedToken.nameidentifier,
                carId: details[1]
            }
            const addReportResponse: APIResponse = await AddUserReport(reportData, token)
            if (addReportResponse.data) {
                navigate(`/car-report/${details[1]}`)
            }
        } else {
            const orderResponse: APIResponse = await CreateOrder(order)
            if (orderResponse.data) {
                navigate(`/car-report/${details[1]}`)
            }
        }
    }
    useEffect(() => {
        handleReport();
    }, []);

    return null;
}

export default PaymentReturnPage;