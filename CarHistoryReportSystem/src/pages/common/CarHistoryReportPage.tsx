import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AddUserReport, CheckReportExist, GetReport } from '../../services/api/Reports';
import { Get } from '../../services/api/Users';
import { RootState } from '../../store/State';
import '../../styles/CarHistoryReportPage.css'
import { AddReport, APIResponse } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { isValidPlateNumber, isValidVIN } from '../../utils/Validators';
function CarHistoryReportPage() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const navigate = useNavigate()
    const [vin, setVin] = useState('')
    const [plate, setPlate] = useState('')
    const [vinError, setVinError] = useState<string | null>(null);
    const [plateError, setPlateError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleVINCheck = async () => {
        if (!vin) {
            setVinError('Please enter VIN.');
        } else if (!isValidVIN(vin)) {
            setVinError('The VIN entered is invalid. Please check and try again.');
        } else {
            setVinError(null);
            setIsLoading(true);
            if (!token) navigate(`/payment/${vin}`)
            else {
                const id = JWTDecoder(token).nameidentifier
                const userResponse: APIResponse = await Get(id, token)
                console.log(userResponse.data)
                if (userResponse.data.maxReportNumber > 0) {
                    let decodedToken = JWTDecoder(token)
                    const reportData: AddReport = {
                        userId: decodedToken.nameidentifier,
                        carId: vin
                    }
                    const checkReportExist: APIResponse = await CheckReportExist(reportData, token)
                    if (checkReportExist.error) {
                        setIsLoading(false);
                        setVinError(checkReportExist.error)
                    } else if (checkReportExist.data == "Success") {
                        setIsLoading(false);
                        navigate(`/car-report/${vin}`)
                    } else {
                        const addReportResponse: APIResponse = await AddUserReport(reportData, token)
                        if (addReportResponse.error) {
                            setIsLoading(false);
                            setVinError(addReportResponse.error)
                        }
                        else {
                            setIsLoading(false);
                            navigate(`/car-report/${vin}`)
                        } 
                    }
                }
                else {
                    setIsLoading(false);
                    navigate(`/payment/${vin}`)
                } 
            }
        }
    };

    const handlePlateCheck = () => {
        if (!plate) {
            setPlateError('Please enter License Plate.');
        } else if (!isValidPlateNumber(plate)) {
            setPlateError('The plate number entered is invalid. Please check and try again.');
        } else {
            setPlateError(null);
            // Your code to fetch the CARFAX report or any other operation for Plate
        }
    };

  return (
      <div className="report-container">
          <h2>Car History Reports</h2>
          <a>Avoid bying a car with costly hidden problems by getting a CHRS Report now.</a>

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
          or
          <div className="report-search-section">
              <label>Search by License Plate(WIP)</label>
              <input type="text" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="Enter Plate" />
              <button onClick={handlePlateCheck}>Get CHRS Report</button>
              {plateError && <div className="report-search-error">{plateError}</div>}
          </div>

          <div className="report-links-section">
              {token ? (
                  <>
                      <p>Ran out of reports? <a href="/payment">Get CHRS Reports</a></p>
                      <p>Already bought a report? <a href="/myreports">View your reports</a></p>
                  </>
              ): (
                  <p>Already bought a report? <a href="/login">Sign in to view the reports</a></p>
              )}
          </div>
      </div>
  );
}

export default CarHistoryReportPage;