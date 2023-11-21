import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GetReport, GetReportExcel } from '../../services/api/Reports';
import { APIResponse, CarHistoryDetail, CarRecallStatus, CarReport, CarServiceHistory } from '../../utils/Interfaces';
import '../../styles/CarReportPage.css'
import generatePDF, { Resolution, Margin, Options} from 'react-to-pdf';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { clearVerifyToken } from '../../store/authSlice';
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
        // default is Resolution.MEDIUM = 3, which should be enough, higher values
        // increases the image quality but also the size of the PDF, so be careful
        // using values higher than 10 when having multiple pages generated, it
        // might cause the page to crash or hang.
        resolution: Resolution.EXTREME,
        page: {
            // margin is in MM, default is Margin.NONE = 0
            margin: Margin.LARGE,
            // default is 'A4'
            format: "letter",
            // default is 'portrait'
            orientation: "landscape"
        },
        canvas: {
            // default is 'image/jpeg' for better size performance
            mimeType: "image/jpeg",
            qualityRatio: 1
        },
        // Customize any value passed to the jsPDF instance and html2canvas
        // function. You probably will not need this and things can break,
        // so use with caution.
        overrides: {
            // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
            pdf: {
                compress: true
            },
            // see https://html2canvas.hertzen.com/configuration for more options
            canvas: {
                useCORS: true
            }
        }
    };
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


                      <h3>Car Recall History</h3>
                      <div className="car-report-recall-history">
                          <table className="car-report-recall-history-table">
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
                                      <th>Source (temp is user id)</th>
                                      <th>Service</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {report?.carHistoryDetails && report?.carHistoryDetails.length > 0 ? (
                                      report?.carHistoryDetails.map((history: CarHistoryDetail, index: number) => {
                                          const serviceCount = history.carServiceHistories?.length || 1;
                                          console.log(serviceCount)
                                          return (
                                              <>
                                                  <tr key={`${index}-0`}>
                                                      <td className="car-report-service-history-table-ownership-data" rowSpan={serviceCount}>
                                                          <a>Owner name: {history.carOwner ? history.carOwner.name : 'Unknown'}</a>
                                                          <a>Owner address: {history.carOwner ? history.carOwner.address : 'Unknown'}</a>
                                                          <a>Estimated length owned: {history.carOwner ? `${history.carOwner.startDate} to ${history.carOwner.endDate}` : 'Unknown'}</a>
                                                      </td>
                                                      {history.carServiceHistories && history.carServiceHistories.length > 0 ? (
                                                          <>
                                                              <td>{history.carServiceHistories[0].reportDate}</td>
                                                              <td>{history.carServiceHistories[0].odometer}</td>
                                                              <td>{history.carServiceHistories[0].createdByUserId}</td>
                                                              <td>{history.carServiceHistories[0].servicesName}</td>
                                                          </>
                                                      ) : null}
                                                  </tr>
                                                  {history.carServiceHistories && history.carServiceHistories.length > 1 ? (
                                                      history.carServiceHistories.slice(1).map((service: CarServiceHistory, index2: number) => (
                                                          <tr key={`${index}-${index2 + 1}`}>
                                                              <td></td>
                                                              <td>{service.reportDate}</td>
                                                              <td>{service.odometer}</td>
                                                              <td>{service.createdByUserId}</td>
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
                  </>
              )}
          </div>
      </div>
  );
}

export default CarReportPage;