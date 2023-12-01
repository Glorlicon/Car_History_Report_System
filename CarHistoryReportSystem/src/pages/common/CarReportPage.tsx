import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GetReport, GetReportExcel } from '../../services/api/Reports';
import { APIResponse, CarCrash, CarHistoryDetail, CarInspectionDetail, CarInspectionHistory, CarInsurance, CarRecallStatus, CarRegistration, CarReport, CarServiceHistory, CarStolen } from '../../utils/Interfaces';
import '../../styles/CarReportPage.css'
import generatePDF, { Resolution, Margin, Options} from 'react-to-pdf';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { clearVerifyToken } from '../../store/authSlice';
import car from '../../car.jpg'
import { CAR_SIDES } from '../../utils/const/CarSides';
function CarReportPage() {
    type RouteParams = {
        vin: string
    }
    const verifyToken = useSelector((state: RootState) => state.auth.verifyToken) as unknown as string
    const token = useSelector((state: RootState) => state.auth.token)
    const dispatch = useDispatch()
    const { vin } = useParams<RouteParams>()
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [report, setReport] = useState<CarReport|null>(null)
    const getReport = () => document.getElementById('report')
    const [data, setData] = useState("")
    const handleDownloadPdf = () => {
        generatePDF(getReport, options)
    }
    const handleDownloadCsv = () => {
        const element = document.getElementById('excel')
        element?.click()
    }

    const options: Options = {
        filename: "report.pdf",
        method: "save",
        resolution: Resolution.EXTREME,
        page: {
            margin: Margin.LARGE,
            format: "letter",
            orientation: "landscape"
        },
        canvas: {
            mimeType: "image/jpeg",
            qualityRatio: 1
        },
        overrides: {
            pdf: {
                compress: true
            },
            canvas: {
                useCORS: true
            }
        }
    };
    const isSideColored = (model: CarCrash, sideValue: number): boolean => {
        return (model.damageLocation & sideValue) === sideValue;
    };
    const isHistoryEmpty = (carReport: CarReport, historyName: keyof CarHistoryDetail): boolean => {
        return carReport.carHistoryDetails.every(detail => {
            const history = detail[historyName]
            return Array.isArray(history) && history.length === 0
        })
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let response: APIResponse
        if (token) {
            response = await GetReport(vin as string, token)
        } else {
            response = await GetReport(vin as string, verifyToken)
            dispatch(clearVerifyToken())
        }
        const responseCsv: APIResponse = await GetReportExcel(vin as string)
        setData(responseCsv.data)
        setLoading(false);
        if (response.error) {
            setError(response.error);
        } else {
            setReport(response.data)
            console.log(response.data)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

  return (
      <div className="car-report-details-page">
          <button onClick={handleDownloadPdf}>Export PDF</button>
          <button onClick={handleDownloadCsv}>Export Excel</button>
          <a
              href={`data:text/csv;charset=utf-8,${escape(data)}`}
              download="filename.csv"
              hidden
              id="excel"
          >
          </a>
          <div className="car-report-details-container" id="report">
              {loading ? (
                  <div className="car-report-details-spinner"></div>
              ) : (
                  <>
                      <h3>Car General Information</h3>
                      <div className="car-report-general-information">
                          <div className="car-report-general-information-details">
                              <h4>Vehicle information:</h4>
                              <p>VIN ID: {report?.vinId}</p>
                              <p>License Plate Number: {report?.licensePlateNumber}</p>
                              <p>Car Color: {report?.colorName}</p>
                              <p>Car Current Odometer: {report?.currentOdometer}</p>
                              <p>Car Engine Number: {report?.engineNumber}</p>
                              <p>{report?.isCommercialUse ? 'Used commercially' : 'Not used commercially'}</p>
                              <p>{report?.isModified ? "Was modified" : "Wasn't modified"}</p>
                              <p>Car Model: {report?.modelId}</p>
                          </div>
                          <div className="car-report-general-information-history">
                              <a>{report?.numberOfAccidentRecords === 0 ? "No accident recorded" : `${report?.numberOfAccidentRecords} accidents recorded`}</a>
                              <a>{report?.numberOfOpenRecalls === 0 ? "No recalls recorded" : `${report?.numberOfOpenRecalls} recalls recorded`}</a>
                              <a>{report?.numberOfOwners === 0 ? "No ownership changes recorded" : `${report?.numberOfOwners} ownership changes recorded`}</a>
                              <a>{report?.numberOfServiceHistoryRecords === 0 ? "No services performed recorded" : `${report?.numberOfServiceHistoryRecords} services performed recorded`}</a>
                              <a>{report?.numberOfStolenRecords === 0 ? "No stolen recorded" : `${report?.numberOfStolenRecords} stolen recorded`}</a>
                          </div>
                      </div>

                      <div className="car-report-service-history">
                          <h3>Car Recall History</h3>
                          <table className="car-report-service-history-table">
                              <thead>
                                  <tr>
                                      <th>Recall Description</th>
                                      <th>Recall Date</th>
                                      <th>Recall Status</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {report?.carRecallStatuses && report?.carRecallStatuses.length > 0 ? (
                                      report?.carRecallStatuses.map((recall: CarRecallStatus, index: number) => (
                                          <tr key={index}>
                                              <td>{recall.description}</td>
                                              <td>{recall.recallDate}</td>
                                              <td>{recall.status}</td>
                                          </tr>
                                      ))
                                  ) : (
                                      <tr>
                                          <td colSpan={3}>No recalls recorded</td>
                                      </tr>
                                  )}
                              </tbody>
                          </table>
                          </div>

                      <div className="car-report-service-history">
                          <h3>Car Service History</h3>
                          <table className="car-report-service-history-table">
                              <thead>
                                  <tr>
                                      <th>Owner</th>
                                      <th>Date</th>
                                      <th>Mileage</th>
                                      <th>Source</th>
                                      <th>Service</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {report?.carHistoryDetails && report?.carHistoryDetails.length > 0 && !isHistoryEmpty(report,'carServiceHistories') ? (
                                      report?.carHistoryDetails.map((history: CarHistoryDetail, index: number) => {
                                          const serviceCount = history.carServiceHistories?.length || 1;
                                          return (
                                              <>
                                                  <tr key={`${index}-0`}>
                                                      {history.carServiceHistories && history.carServiceHistories.length > 0 ? (
                                                          <>
                                                      <td className="car-report-service-history-table-ownership-data" rowSpan={serviceCount}>
                                                          <a>Owner name: {history.carOwner ? history.carOwner.name : 'Unknown'}</a>
                                                          <a>Owner address: {history.carOwner ? history.carOwner.address : 'Unknown'}</a>
                                                          <a>Estimated length owned: {history.carOwner ? `${history.carOwner.startDate} to ${history.carOwner.endDate}` : 'Unknown'}</a>
                                                      </td>
                                                              <td>{history.carServiceHistories[0].serviceTime}</td>
                                                              <td>{history.carServiceHistories[0].odometer}</td>
                                                              <td>{history.carServiceHistories[0].source}</td>
                                                              <td>{history.carServiceHistories[0].servicesName}</td>
                                                          </>
                                                      ) : null}
                                                  </tr>
                                                  {history.carServiceHistories && history.carServiceHistories.length > 1 ? (
                                                      history.carServiceHistories.slice(1).map((service: CarServiceHistory, index2: number) => (
                                                          <tr key={`${index}-${index2 + 1}`}>
                                                              <td></td>
                                                              <td>{service.serviceTime}</td>
                                                              <td>{service.odometer}</td>
                                                              <td>{service.source}</td>
                                                              <td>{service.servicesName}</td>
                                                          </tr>
                                                      ))
                                                  ) : null}
                                              </>
                                          );
                                      })
                                  ) : (
                                      <tr>
                                          <td colSpan={5}>No performed services recorded</td>
                                      </tr>
                                  )}
                              </tbody>
                          </table>
                      </div>


                          <div className="car-report-service-history">
                              <h3>Car Accident History</h3>
                              <table className="car-report-service-history-table">
                                  <thead>
                                      <tr>
                                          <th>Owner</th>
                                          <th>Date</th>
                                          <th>Mileage</th>
                                          <th>Source</th>
                                          <th>Severity</th>
                                          <th>Visualization</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {report?.carHistoryDetails && report?.carHistoryDetails.length > 0 ? (
                                          report?.carHistoryDetails.map((history: CarHistoryDetail, index: number) => {
                                              const accidentCount = history.carAccidentHistories?.length || 1;
                                              return (
                                                  <>
                                                      <tr key={`${index}-0`}>
                                                          {history.carAccidentHistories && history.carAccidentHistories.length > 0 && !isHistoryEmpty(report, 'carAccidentHistories') ? (
                                                              <>
                                                          <td className="car-report-service-history-table-ownership-data" rowSpan={accidentCount}>
                                                              <a>Owner name: {history.carOwner ? history.carOwner.name : 'Unknown'}</a>
                                                              <a>Owner address: {history.carOwner ? history.carOwner.address : 'Unknown'}</a>
                                                              <a>Estimated length owned: {history.carOwner ? `${history.carOwner.startDate} to ${history.carOwner.endDate}` : 'Unknown'}</a>
                                                          </td>
                                                                  <td>{history.carAccidentHistories[0].accidentDate}</td>
                                                                  <td>{history.carAccidentHistories[0].odometer}</td>
                                                                  <td>{history.carAccidentHistories[0].source}</td>
                                                                  <td>{history.carAccidentHistories[0].serverity}</td>
                                                                  <td>
                                                                      <div className="pol-crash-car-container">
                                                                          <img src={car} alt="Car" className="report-crash-car-image" style={{
                                                                              borderTop: `5px solid ${isSideColored(history.carAccidentHistories[0], CAR_SIDES.Front) ? 'red' : 'black'}`,
                                                                              borderBottom: `5px solid ${isSideColored(history.carAccidentHistories[0], CAR_SIDES.Rear) ? 'red' : 'black'}`,
                                                                              borderLeft: `5px solid ${isSideColored(history.carAccidentHistories[0], CAR_SIDES.Left) ? 'red' : 'black'}`,
                                                                              borderRight: `5px solid ${isSideColored(history.carAccidentHistories[0], CAR_SIDES.Right) ? 'red' : 'black'}`,
                                                                          }} />
                                                                      </div>
                                                                  </td>
                                                              </>
                                                          ) : null}
                                                      </tr>
                                                      {history.carAccidentHistories && history.carAccidentHistories.length > 1 ? (
                                                          history.carAccidentHistories.slice(1).map((accident: CarCrash, index2: number) => (
                                                              <tr key={`${index}-${index2 + 1}`}>
                                                                  <td></td>
                                                                  <td>{accident.accidentDate}</td>
                                                                  <td>{accident.odometer}</td>
                                                                  <td>{accident.source}</td>
                                                                  <td>{accident.serverity}</td>
                                                                  <td>
                                                                      <div className="pol-crash-car-container">
                                                                          <img src={car} alt="Car" className="report-crash-car-image" style={{
                                                                              borderTop: `5px solid ${isSideColored(accident, CAR_SIDES.Front) ? 'red' : 'black'}`,
                                                                              borderBottom: `5px solid ${isSideColored(accident, CAR_SIDES.Rear) ? 'red' : 'black'}`,
                                                                              borderLeft: `5px solid ${isSideColored(accident, CAR_SIDES.Left) ? 'red' : 'black'}`,
                                                                              borderRight: `5px solid ${isSideColored(accident, CAR_SIDES.Right) ? 'red' : 'black'}`,
                                                                          }} />
                                                                      </div>
                                                                  </td>
                                                              </tr>
                                                          ))
                                                      ) : null}
                                                  </>
                                              );
                                          })
                                      ) : (
                                          <tr>
                                              <td colSpan={6}>No crashes recorded</td>
                                          </tr>
                                      )}
                                  </tbody>
                              </table>
                          </div>


                          <div className="car-report-service-history">
                              <h3>Car Inspection History</h3>
                              <table className="car-report-service-history-table">
                                  <thead>
                                      <tr>
                                          <th>Owner</th>
                                          <th>Date</th>
                                          <th>Mileage</th>
                                          <th>Source</th>
                                          <th>Details</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {report?.carHistoryDetails && report?.carHistoryDetails.length > 0 && !isHistoryEmpty(report, 'carInspectionHistories') ? (
                                          report?.carHistoryDetails.map((history: CarHistoryDetail, index: number) => {
                                              const inspectionCount = history.carInspectionHistories?.length || 1;
                                              return (
                                                  <>
                                                      <tr key={`${index}-0`}>
                                                          {history.carInspectionHistories && history.carInspectionHistories.length > 0 ? (
                                                              <>
                                                          <td className="car-report-service-history-table-ownership-data" rowSpan={inspectionCount}>
                                                              <a>Owner name: {history.carOwner ? history.carOwner.name : 'Unknown'}</a>
                                                              <a>Owner address: {history.carOwner ? history.carOwner.address : 'Unknown'}</a>
                                                              <a>Estimated length owned: {history.carOwner ? `${history.carOwner.startDate} to ${history.carOwner.endDate}` : 'Unknown'}</a>
                                                          </td>
                                                                  <td>{history.carInspectionHistories[0].inspectDate}</td>
                                                                  <td>{history.carInspectionHistories[0].odometer}</td>
                                                                  <td>{history.carInspectionHistories[0].source}</td>
                                                                  <td>{history.carInspectionHistories[0].carInspectionHistoryDetail.map((detail: CarInspectionDetail,index: number) => (
                                                                    <a>
                                                                          +{detail.inspectionCategory}: {detail.isPassed }
                                                                    </a>
                                                                  ))}
                                                                  </td>
                                                              </>
                                                          ) : null}
                                                      </tr>
                                                      {history.carInspectionHistories && history.carInspectionHistories.length > 1 ? (
                                                          history.carInspectionHistories.slice(1).map((inspection: CarInspectionHistory, index2: number) => (
                                                              <tr key={`${index}-${index2 + 1}`}>
                                                                  <td></td>
                                                                  <td>{inspection.inspectDate}</td>
                                                                  <td>{inspection.odometer}</td>
                                                                  <td>{inspection.source}</td>
                                                                  <td>{inspection.carInspectionHistoryDetail.map((detail: CarInspectionDetail, index: number) => (
                                                                      <a>
                                                                          +{detail.inspectionCategory}: {detail.isPassed}
                                                                      </a>
                                                                  ))}
                                                                  </td>
                                                              </tr>
                                                          ))
                                                      ) : null}
                                                  </>
                                              );
                                          })
                                      ) : (
                                          <tr>
                                              <td colSpan={5}>No performed inspections recorded</td>
                                          </tr>
                                      )}
                                  </tbody>
                              </table>
                          </div>



                          <div className="car-report-service-history">
                              <h3>Car Insurance History</h3>
                              <table className="car-report-service-history-table">
                                  <thead>
                                      <tr>
                                          <th>Owner</th>
                                          <th>Mileage</th>
                                          <th>Source</th>
                                          <th>Start Date</th>
                                          <th>End Date</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {report?.carHistoryDetails && report?.carHistoryDetails.length > 0 && !isHistoryEmpty(report, 'carInsurances') ? (
                                          report?.carHistoryDetails.map((history: CarHistoryDetail, index: number) => {
                                              const insuranceCount = history.carInsurances?.length || 1;
                                              return (
                                                  <>
                                                      <tr key={`${index}-0`}>
                                                          {history.carInsurances && history.carInsurances.length > 0 ? (
                                                              <>
                                                          <td className="car-report-service-history-table-ownership-data" rowSpan={insuranceCount}>
                                                              <a>Owner name: {history.carOwner ? history.carOwner.name : 'Unknown'}</a>
                                                              <a>Owner address: {history.carOwner ? history.carOwner.address : 'Unknown'}</a>
                                                              <a>Estimated length owned: {history.carOwner ? `${history.carOwner.startDate} to ${history.carOwner.endDate}` : 'Unknown'}</a>
                                                          </td>
                                                                  <td>{history.carInsurances[0].odometer}</td>
                                                                  <td>{history.carInsurances[0].source}</td>
                                                                  <td>{history.carInsurances[0].startDate}</td>
                                                                  <td>{history.carInsurances[0].endDate}</td>
                                                              </>
                                                          ) : null}
                                                      </tr>
                                                      {history.carInsurances && history.carInsurances.length > 1 ? (
                                                          history.carInsurances.slice(1).map((insurance: CarInsurance, index2: number) => (
                                                              <tr key={`${index}-${index2 + 1}`}>
                                                                  <td></td>
                                                                  <td>{insurance.odometer}</td>
                                                                  <td>{insurance.source}</td>
                                                                  <td>{insurance.startDate}</td>
                                                                  <td>{insurance.endDate}</td>
                                                              </tr>
                                                          ))
                                                      ) : null}
                                                  </>
                                              );
                                          })
                                      ) : (
                                          <tr>
                                              <td colSpan={5}>No registered isnurances recorded</td>
                                          </tr>
                                      )}
                                  </tbody>
                              </table>
                          </div>

                          <div className="car-report-service-history">
                              <h3>Car Stolen History</h3>
                              <table className="car-report-service-history-table">
                                  <thead>
                                      <tr>
                                          <th>Owner</th>
                                          <th>Date</th>
                                          <th>Mileage</th>
                                          <th>Source</th>
                                          <th>Status</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {report?.carHistoryDetails && report?.carHistoryDetails.length > 0 && !isHistoryEmpty(report, 'carStolenHistories') ? (
                                          report?.carHistoryDetails.map((history: CarHistoryDetail, index: number) => {
                                              const stolenCount = history.carStolenHistories?.length || 1;
                                              return (
                                                  <>
                                                      <tr key={`${index}-0`}>
                                                          {history.carStolenHistories && history.carStolenHistories.length > 0 ? (
                                                              <>
                                                          <td className="car-report-service-history-table-ownership-data" rowSpan={stolenCount}>
                                                              <a>Owner name: {history.carOwner ? history.carOwner.name : 'Unknown'}</a>
                                                              <a>Owner address: {history.carOwner ? history.carOwner.address : 'Unknown'}</a>
                                                              <a>Estimated length owned: {history.carOwner ? `${history.carOwner.startDate} to ${history.carOwner.endDate}` : 'Unknown'}</a>
                                                          </td>
                                                                  <td>{history.carStolenHistories[0].reportDate}</td>
                                                                  <td>{history.carStolenHistories[0].odometer}</td>
                                                                  <td>{history.carStolenHistories[0].source}</td>
                                                                  <td>{history.carStolenHistories[0].status === 1 ? 'Found' : 'Not found'}</td>
                                                              </>
                                                          ) : null}
                                                      </tr>
                                                      {history.carStolenHistories && history.carStolenHistories.length > 1 ? (
                                                          history.carStolenHistories.slice(1).map((stolen: CarStolen, index2: number) => (
                                                              <tr key={`${index}-${index2 + 1}`}>
                                                                  <td></td>
                                                                  <td>{stolen.reportDate}</td>
                                                                  <td>{stolen.odometer}</td>
                                                                  <td>{stolen.source}</td>
                                                                  <td>{stolen.status === 1 ? 'Found' : 'Not found'}</td>
                                                              </tr>
                                                          ))
                                                      ) : null}
                                                  </>
                                              );
                                          })
                                      ) : (
                                          <tr>
                                              <td colSpan={5}>No stolen recorded</td>
                                          </tr>
                                      )}
                                  </tbody>
                              </table>
                          </div>

                          <div className="car-report-service-history">
                              <h3>Car Registration History</h3>
                              <table className="car-report-service-history-table">
                                  <thead>
                                      <tr>
                                          <th>Owner</th>
                                          <th>Date</th>
                                          <th>Mileage</th>
                                          <th>Source</th>
                                          <th>License Plate Number</th>
                                          <th>Expire Date</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {report?.carHistoryDetails && report?.carHistoryDetails.length > 0 && !isHistoryEmpty(report, 'carRegistrationHistories') ? (
                                          report?.carHistoryDetails.map((history: CarHistoryDetail, index: number) => {
                                              const registrationCount = history.carRegistrationHistories?.length || 1;
                                              return (
                                                  <>
                                                      <tr key={`${index}-0`}>
                                                          {history.carRegistrationHistories && history.carRegistrationHistories.length > 0 ? (
                                                              <>
                                                          <td className="car-report-service-history-table-ownership-data" rowSpan={registrationCount}>
                                                              <a>Owner name: {history.carOwner ? history.carOwner.name : 'Unknown'}</a>
                                                              <a>Owner address: {history.carOwner ? history.carOwner.address : 'Unknown'}</a>
                                                              <a>Estimated length owned: {history.carOwner ? `${history.carOwner.startDate} to ${history.carOwner.endDate}` : 'Unknown'}</a>
                                                          </td>
                                                                  <td>{history.carRegistrationHistories[0].reportDate}</td>
                                                                  <td>{history.carRegistrationHistories[0].odometer}</td>
                                                                  <td>{history.carRegistrationHistories[0].source}</td>
                                                                  <td>{history.carRegistrationHistories[0].licensePlateNumber}</td>
                                                                  <td>{history.carRegistrationHistories[0].expireDate}</td>
                                                              </>
                                                          ) : null}
                                                      </tr>
                                                      {history.carRegistrationHistories && history.carRegistrationHistories.length > 1 ? (
                                                          history.carRegistrationHistories.slice(1).map((registration: CarRegistration, index2: number) => (
                                                              <tr key={`${index}-${index2 + 1}`}>
                                                                  <td></td>
                                                                  <td>{registration.reportDate}</td>
                                                                  <td>{registration.odometer}</td>
                                                                  <td>{registration.source}</td>
                                                                  <td>{registration.licensePlateNumber}</td>
                                                                  <td>{registration.expireDate}</td>
                                                              </tr>
                                                          ))
                                                      ) : null}
                                                  </>
                                              );
                                          })
                                      ) : (
                                          <tr>
                                              <td colSpan={5}>No stolen recorded</td>
                                          </tr>
                                      )}
                                  </tbody>
                              </table>
                          </div>
                  </>
              )}
          </div>
      </div>
  );
}

export default CarReportPage;