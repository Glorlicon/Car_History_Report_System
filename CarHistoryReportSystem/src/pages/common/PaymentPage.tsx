import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../store/State';
import '../../styles/PaymentPage.css'
import { ReportPackages } from '../../utils/const/ReportPackages';
import { VNP_CONST } from '../../utils/const/VNPay';
import { ReportPackage } from '../../utils/Interfaces';
import logo from '../../VNPAY-Logo-scaled.jpg'
import CryptoJS from 'crypto-js';
import qs from 'qs'

function PaymentPage() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
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
            vnp_ReturnUrl: 'http://localhost:3000/payment-return', 
            vnp_IpAddr: '58.186.167.116',
        }
        vnp_Params = sortObject(vnp_Params)
        const data = qs.stringify(vnp_Params, { encode: false })
        const signedData = CryptoJS.HmacSHA512(data, VNP_CONST.SECRET_KEY).toString()
        const queryUrl = VNP_CONST.PAYMENT_URL + "?" + data + `&vnp_SecureHash=${signedData}`
        window.location.href = queryUrl
    }
    return (
      <div className="payment-page">
            <div className="payment-page-header">
                <h1>Order CHRS Reports</h1>
            </div>
        <div className="payment-details">
          <div className="report-checks">
              <h3>EACH CHRS REPORT CHECKS FOR</h3>
              <ul>
                  <li>Car General Information</li>
                  <li>Car Recall History</li>
                  <li>Car Ownership History</li>
                  <li>Car Service History</li>
                  <li>Car Accident History</li>
                  <li>Car Inspection History</li>
                  <li>Car Insurance History</li>
                  <li>Car Stolen Accidents History</li>
              </ul>
          </div>
          <div className="payment-forms">
              <div className="package-selection">
                        <h3>Step 1: Select Your Package:</h3>
                        {token ? (
                            <>
                                {ReportPackages.map((reportpackage, index) => (
                                    <div className="package-option">
                                        <input type="radio" name="reportOption" id={`package${index}`} onChange={() => { handleSelectPackage(index) }} />
                                        <label htmlFor={`package${index}`}>
                                            <span>{reportpackage.title} - {reportpackage.price}VND ({reportpackage.pricePerReport}VND/report)</span>
                                            <span className={reportpackage.type.toLowerCase().replace(/ /g, "-")}>$ {reportpackage.type} $</span>
                                        </label>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                    <div className="package-option">
                                        <input type="radio" name="reportOption" id={`package${0}`} onChange={() => { handleSelectPackage(0) }} />
                                        <label htmlFor={`package${0}`}>
                                            <span>{ReportPackages[0].title} - {ReportPackages[0].price}VND ({ReportPackages[0].pricePerReport}VND/report)</span>
                                            <span className={ReportPackages[0].type.toLowerCase().replace(/ /g, "-")}>$ {ReportPackages[0].type} $</span>
                                        </label>
                                    </div>
                            </>
                        )}
              </div>

              <div className="payment-method">
                  <h3>Step 2: Select Method of Payment:</h3>
                  <div className="payment-option">
                        <input type="radio" id="vnpay" name="method" checked/>
                        <img src={logo} alt="Credit Card Logo" /> 
                  </div>
              </div>
              <div className="payment-info">
                        <label>
                            <a>Amount</a>
                            <input type="text" name="amount" value={selectedPackage?.price ? selectedPackage?.price:"Package Price"} disabled  />
                        </label>
                        <label>
                            <a>Description</a>
                            <input type="text" name="description" value={selectedPackage?.title? `Purchase ${selectedPackage?.title}` : "Package Description"} disabled />
                        </label>
                  <label>
                            <a>Language</a>
                            <select name="language" onChange={(e) => setLanguage(e.target.value)}>
                                <option value="vn" selected>Vietnamese</option>
                                <option value="en">English</option>
                            </select>
                  </label>
                        <label>
                            <a>Bank</a>
                            <select name="bankcode" onChange={(e) => setBank(e.target.value)}>
                                <option value="NCB" selected>Ngan hang NCB</option>
                                <option value="SACOMBANK">Ngan hang SacomBank  </option>
                                <option value="EXIMBANK">Ngan hang EximBank </option>
                                <option value="MSBANK">Ngan hang MSBANK </option>
                                <option value="NAMABANK">Ngan hang NamABank </option>
                                <option value="VISA">Thanh toan qua VISA/MASTER</option>
                                <option value="VNMART">Vi dien tu VnMart</option>
                                <option value="VIETINBANK">Ngan hang Vietinbank  </option>
                                <option value="VIETCOMBANK">Ngan hang VCB </option>
                                <option value="HDBANK">Ngan hang HDBank</option>
                                <option value="DONGABANK">Ngan hang Dong A</option>
                                <option value="TPBANK">Ngan hang TPBank </option>
                                <option value="OJB">Ngan hang OceanBank</option>
                                <option value="BIDV">Ngan hang BIDV </option>
                                <option value="TECHCOMBANK">Ngan hang Techcombank </option>
                                <option value="VPBANK">Ngan hang VPBank </option>
                                <option value="AGRIBANK">Ngan hang Agribank </option>
                                <option value="MBBANK">Ngan hang MBBank </option>
                                <option value="ACB">Ngan hang ACB </option>
                                <option value="OCB">Ngan hang OCB </option>
                            </select>
                  </label>
              </div>
              <button className="report-buy-button" type="submit" disabled={selectedPackage ? false : true} onClick={handlePayment}>BUY REPORTS</button>
          </div>
      </div>
     </div>
  );
}

export default PaymentPage;