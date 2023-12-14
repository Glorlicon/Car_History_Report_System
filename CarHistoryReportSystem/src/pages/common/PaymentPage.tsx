import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../store/State';
import '../../styles/PaymentPage.css'
import { ReportPackages } from '../../utils/const/ReportPackages';
import { VNP_CONST } from '../../utils/const/VNPay';
import { ReportPackage } from '../../utils/Interfaces';
import logo from '../../VNPAY-Logo-scaled.jpg'
import CryptoJS from 'crypto-js';
import qs from 'qs'
import { useTranslation } from 'react-i18next';

function PaymentPage() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [selectedPackage, setSelectedPackage] = useState<ReportPackage | null>(null)
    const [bank, setBank] = useState<string>('NCB')
    const [amount, setAmount] = useState<number>(0)
    const [language, setLanguage] = useState<string>('vn')
    const [description, setDescription] = useState<string>('')
    type RouteParams = {
        vin: string
    }
    const { vin } = useParams<RouteParams>()

    const formatDate = (date: Date): string => {
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
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

    const handleSelectPackage = (index: number) => {
        setSelectedPackage(ReportPackages[index])
        setDescription(ReportPackages[index].title)
        setAmount(ReportPackages[index].price)
    }

    const handlePayment = () => {

        let vnp_Params: any = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: VNP_CONST.TERMINAL_ID,
            vnp_Amount: amount*100,
            vnp_BankCode: bank,
            vnp_CreateDate: formatDate(new Date()),
            vnp_Locale: language || 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: Date.now(),
            vnp_OrderInfo: description+"-"+vin,
            vnp_OrderType: 'billpayment',
            vnp_ReturnUrl: `${process.env.REACT_APP_PAYMENT_RETURN}`, 
            vnp_IpAddr: '58.186.167.116',
        }
        vnp_Params = sortObject(vnp_Params)
        const data = qs.stringify(vnp_Params, { encode: false })
        const signedData = CryptoJS.HmacSHA512(data, VNP_CONST.SECRET_KEY).toString()
        const queryUrl = VNP_CONST.PAYMENT_URL + "?" + data + `&vnp_SecureHash=${signedData}`
        window.location.href = queryUrl
    }
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    },[])
    return (
      <div className="payment-page">
            <div className="payment-page-header">
                <h1>{t('Order CHRS Reports')}</h1>
            </div>
        <div className="payment-details">
          <div className="report-checks">
              <h3>{t('EACH CHRS REPORT CHECKS FOR')}</h3>
              <ul>
                  <li>{t('Car General Information')}</li>
                  <li>{t('Car Recall History')}</li>
                  <li>{t('Car Ownership History')}</li>
                  <li>{t('Car Service History')}</li>
                  <li>{t('Car Accident History')}</li>
                  <li>{t('Car Inspection History')}</li>
                  <li>{t('Car Insurance History')}</li>
                  <li>{t('Car Stolen Accidents History')}</li>
              </ul>
          </div>
          <div className="payment-forms">
              <div className="package-selection">
                        <h3>{t('Step 1: Select Your Package:')}</h3>
                        {token ? (
                            <>
                                {ReportPackages.map((reportpackage, index) => (
                                    <div className="package-option">
                                        <input type="radio" name="reportOption" id={`package${index}`} onChange={() => { handleSelectPackage(index) }} />
                                        <label htmlFor={`package${index}`}>
                                            <span>{t(reportpackage.title)} - {reportpackage.price}VND ({reportpackage.pricePerReport}VND/{t('report')})</span>
                                            <span className={reportpackage.type.toLowerCase().replace(/ /g, "-")}>$ {t(reportpackage.type)} $</span>
                                        </label>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                    <div className="package-option">
                                        <input type="radio" name="reportOption" id={`package${0}`} onChange={() => { handleSelectPackage(0) }} />
                                        <label htmlFor={`package${0}`}>
                                            <span>{t(ReportPackages[0].title)} - {ReportPackages[0].price}VND ({ReportPackages[0].pricePerReport}VND/{t('report')})</span>
                                            <span className={ReportPackages[0].type.toLowerCase().replace(/ /g, "-")}>$ {t(ReportPackages[0].type)} $</span>
                                        </label>
                                    </div>
                            </>
                        )}
              </div>

              <div className="payment-method">
                  <h3>{t('Step 2: Select Method of Payment:')}</h3>
                  <div className="payment-option">
                        <input type="radio" id="vnpay" name="method" checked/>
                        <img src={logo} alt="Credit Card Logo" /> 
                  </div>
              </div>
              <div className="payment-info">
                        <label>
                            <a>{t('Amount')}</a>
                            <input type="text" name="amount" value={selectedPackage?.price ? selectedPackage?.price : t('Package Price')} disabled  />
                        </label>
                        <label>
                            <a>{t('Description')}</a>
                            <input type="text" name="description" value={selectedPackage?.title? t(`Purchase ${selectedPackage?.title}`) : t('Package Description')} disabled />
                        </label>
                  <label>
                            <a>{t('Language')}</a>
                            <select name="language" onChange={(e) => setLanguage(e.target.value)}>
                                <option value="vn" selected>{t('Vietnamese')}</option>
                                <option value="en">{t('English')}</option>
                            </select>
                  </label>
                        <label>
                            <a>{t('Bank')}</a>
                            <select name="bankcode" onChange={(e) => setBank(e.target.value)}>
                                <option value="NCB" selected> NCB </option>
                                <option value="SACOMBANK"> SacomBank </option>
                                <option value="EXIMBANK"> EximBank </option>
                                <option value="MSBANK"> MSBANK </option>
                                <option value="NAMABANK"> NamABank </option>
                                <option value="VISA"> VISA/MASTER </option>
                                <option value="VNMART"> {t('VnMart')} </option>
                                <option value="VIETINBANK"> Vietinbank </option>
                                <option value="VIETCOMBANK"> VCB </option>
                                <option value="HDBANK"> HDBank </option>
                                <option value="DONGABANK"> {t('Dong A')} </option>
                                <option value="TPBANK"> TPBank </option>
                                <option value="OJB"> OceanBank </option>
                                <option value="BIDV"> BIDV </option>
                                <option value="TECHCOMBANK"> Techcombank </option>
                                <option value="VPBANK"> VPBank </option>
                                <option value="AGRIBANK"> Agribank </option>
                                <option value="MBBANK"> MBBank </option>
                                <option value="ACB"> ACB </option>
                                <option value="OCB"> OCB </option>
                            </select>
                  </label>
              </div>
              <button className="report-buy-button" type="submit" disabled={selectedPackage ? false : true} onClick={handlePayment}>{t('BUY REPORTS')}</button>
          </div>
      </div>
     </div>
  );
}

export default PaymentPage;