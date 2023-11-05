import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AddUserReport, CreateOrder } from '../../services/api/Reports';
import { RootState } from '../../store/State';
import { AddReport, APIResponse, Order } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';

function PaymentReturnPage() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const navigate = useNavigate()
    const [paymentParams, setPaymentParams] = useSearchParams()
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
        } else {
            const orderResponse: APIResponse = await CreateOrder(order)
        }
        navigate(`/car-report/${details[1]}`)
    }
    useEffect(() => {
        handleReport();
    }, []);

    return null;
}

export default PaymentReturnPage;