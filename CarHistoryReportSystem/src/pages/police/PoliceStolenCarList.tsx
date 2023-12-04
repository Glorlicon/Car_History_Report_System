import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import PoliceCarStolenDetailsForm from '../../components/forms/police/PoliceCarStolenDetailsForm';
import { AddCarStolenHistory, DownloadStolenExcelFile, EditCarStolenHistory, GetStolenExcel, ImportStolenFromExcel, ListCarStolen } from '../../services/api/CarStolen';
import { RootState } from '../../store/State';
import { APIResponse, CarStolen, CarStolenSearchParams, Paging } from '../../utils/Interfaces';
import { isValidVIN } from '../../utils/Validators';
import '../../styles/PoliceStolenCar.css'
import { useTranslation } from 'react-i18next';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { CAR_STOLEN_STATUS } from '../../utils/const/CarStolenStatus';
import { Pagination } from '@mui/material';
function PoliceStolenCarList() {
    const { t, i18n } = useTranslation()
    const [page, setPage] = useState(1)
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const id = JWTDecoder(token).dataprovider
    const [searchVinId, setSearchVinId] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [carStolenList, setcarStolenList] = useState<CarStolen[]>([]);
    const [newCarStolenReport, setNewCarStolenReport] = useState<CarStolen>({
        description: '',
        carId: '',
        odometer: 0,
        status: 0,
        note: '',
        reportDate: ''
    });
    const [editCarStolenReport, setEditCarStolenReport] = useState<CarStolen | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [resetTrigger, setResetTrigger] = useState(0);
    const [data, setData] = useState("")
    const [openImport, setOpenImport] = useState(false)
    const [template, setTemplate] = useState('')
    const [templateTrigger, setTemplateTrigger] = useState(0)
    const [importData, setImportData] = useState<FormData | null>(null)
    const isFirstRender = useRef(true);

    const handleDownloadCsv = () => {
        const element = document.getElementById('excel')
        element?.click()
    }
    const handleDownloadTemplate = async () => {
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const res = await DownloadStolenExcelFile(token, connectAPIError, language)
        if (res.data) {
            setTemplate(res.data)
            setTemplateTrigger(prev => prev + 1)
        }
    }
    const handleDownloadTemplateClick = () => {
        const element = document.getElementById('template')
        element?.click()
    }
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            handleDownloadTemplateClick();
        }
    }, [templateTrigger])

    const handleImportExcel = async () => {
        if (importData) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await ImportStolenFromExcel(token, importData, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setOpenImport(false)
                setImportData(null)
                fetchData();
            }
        }
    }

    const handleImportClick = () => {
        document.getElementById('excel-file')?.click()
    }

    const handleAddDataFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files[0]) {
            const file = files[0]
            const reader = new FileReader()
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target && e.target.result) {
                    const fileContent = e.target.result
                    const formData = new FormData()
                    formData.append('file', file)
                    setImportData(formData)
                }
            }
            reader.readAsText(file);
        }
    }
    const validateCarStolenReport = (stolenReport: CarStolen): boolean => {
        if (!isValidVIN(stolenReport.carId)) {
            setAddError(t('VIN is invalid'));
            return false;
        }
        if (!stolenReport.carId) {
            setAddError(t('VIN must be filled out'));
            return false;
        }
        if (!stolenReport.description) {
            setAddError(t('Description must be filled out'));
            return false;
        }
        if (!stolenReport.odometer) {
            setAddError(t('Odometer must be chosen'));
            return false;
        }
        if (!stolenReport.note) {
            setAddError(t('Note must be filled out'));
            return false;
        }
        if (!stolenReport.reportDate) {
            setAddError(t('Report Date must be chosen'));
            return false;
        }
        return true;
    };
    const handleAddCarStolenReport = async () => {
        if (validateCarStolenReport(newCarStolenReport)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await AddCarStolenHistory(newCarStolenReport, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                fetchData();
            }
        }
    }

    const handleEditCarStolenReport = async () => {
        if (editCarStolenReport && editCarStolenReport.id && validateCarStolenReport(editCarStolenReport)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await EditCarStolenHistory(editCarStolenReport.id, editCarStolenReport, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setEditCarStolenReport(null)
                fetchData();
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (editCarStolenReport) {
            setEditCarStolenReport({
                ...editCarStolenReport,
                [e.target.name]: value
            })
        } else {
            setNewCarStolenReport({
                ...newCarStolenReport,
                [e.target.name]: value,
            });
        }
    };
    const handleResetFilters = () => {
        setSearchStatus('')
        setSearchVinId('')
        setResetTrigger(prev => prev + 1);
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let searchParams: CarStolenSearchParams = {
            vinID: searchVinId,
            status: searchStatus
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const carStolenReportResponse: APIResponse = await ListCarStolen(id, token, page, connectAPIError, language, searchParams)
        if (carStolenReportResponse.error) {
            setError(carStolenReportResponse.error)
        } else {
            setcarStolenList(carStolenReportResponse.data)
            setPaging(carStolenReportResponse.pages)
            const responseCsv: APIResponse = await GetStolenExcel(id, token, page, connectAPIError, language, searchParams)
            setData(responseCsv.data)
        }
        setLoading(false)
    }
    useEffect(() => {
        fetchData();
        i18n.changeLanguage(currentLanguage)
    }, []);
    useEffect(() => {
        fetchData();
        i18n.changeLanguage(currentLanguage)
    }, [page])
    useEffect(() => {
        fetchData();
    }, [resetTrigger]);
  return (
      <div className="pol-stolen-list-page">
          <div className="pol-crash-top-bar">
              <button className="add-pol-crash-btn" onClick={() => setShowModal(true)}>+ {t('Add New Stolen Car Report')}</button>
              <button className="add-pol-crash-btn" onClick={() => { handleDownloadTemplate() }}>&dArr; {t('Excel Template')}</button>
              <a
                  href={`data:text/csv;charset=utf-8,${escape(template)}`}
                  download={`template.csv`}
                  hidden
                  id="template"
              />
              <button className="add-pol-crash-btn" onClick={() => { setOpenImport(true) }}>+ {t('Import From Excel')}</button>
          </div>
          <div className="pol-crash-top-bar">
              <div className="reg-inspec-search-filter-container">
                  <div className="reg-inspec-search-filter-item">
                      <label>{t('Car ID')}</label>
                      <input
                          type="text"
                          className="reg-inspec-search-bar"
                          placeholder={t('Search by Car ID')}
                          value={searchVinId}
                          onChange={(e) => setSearchVinId(e.target.value)}
                      />
                  </div>
                  <div className="reg-inspec-search-filter-item">
                      <label>{t('Status')}</label>
                      <select className="reg-inspec-search-bar" value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
                          <option value=''>{t('All')}</option>
                          <option value={CAR_STOLEN_STATUS.Stolen}>{t('Stolen')}</option>
                          <option value={CAR_STOLEN_STATUS.Found}>{t('Found')}</option>
                      </select>
                  </div>
                  <button
                      className="search-reg-inspec-btn"
                      onClick={fetchData}
                  >
                      {t('Search...')}
                  </button>
                  <button
                      className="reset-reg-inspec-btn"
                      onClick={handleResetFilters}
                  >
                      {t('Reset Filters')}
                  </button>
              </div>
          </div>
          <table className="pol-stolen-table">
              <thead>
                  <tr>
                      <th>{t('Car VIN')}</th>
                      <th>{t('Odometer')}</th>
                      <th>{t('Report Date')}</th>
                      <th>{t('Status')}</th>
                  </tr>
              </thead>
              <tbody>
                  {loading ? (
                      <tr>
                          <td colSpan={4} style={{ textAlign: 'center' }}>
                              <div className="pol-stolen-spinner"></div>
                          </td>
                      </tr>
                  ) : error ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              {error}
                                  <button onClick={fetchData} className="pol-stolen-retry-btn">{t('Retry')}</button>
                          </td>
                      </tr>
                  ) : carStolenList.length > 0 ? (
                      carStolenList.map((model: CarStolen, index: number) => (
                          <tr key={index}>
                              <td onClick={() => { setEditCarStolenReport(model) }}>{model.carId}</td>
                              <td>{model.odometer}</td>
                              <td>{model.reportDate}</td>
                              <td>{model.status === 1 ? t('Found'): t('Stolen')}</td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={5}>{t('No stolen car reports found')}</td>
                      </tr>
                  )}
              </tbody>
          </table>
          {showModal && (
              <div className="pol-stolen-modal">
                  <div className="pol-stolen-modal-content">
                      <span className="pol-stolen-close-btn" onClick={() => { setShowModal(false) }}>&times;</span>
                      <h2>{t('Add Car Stolen Report')}</h2>
                      <PoliceCarStolenDetailsForm
                          action="Add"
                          model={newCarStolenReport}
                          handleInputChange={handleInputChange}
                      />
                      <button onClick={handleAddCarStolenReport} disabled={adding} className="pol-stolen-model-add-btn">
                          {adding ? (<div className="pol-stolen-inline-spinner"></div>) : t('Finish')}
                      </button>
                      {addError && (
                          <p className="pol-stolen-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {editCarStolenReport && (
              <div className="pol-stolen-modal">
                  <div className="pol-stolen-modal-content">
                      <span className="pol-stolen-close-btn" onClick={() => { setShowModal(false); setEditCarStolenReport(null) }}>&times;</span>
                      <h2>{t('Edit Car Stolen Report')}</h2>
                      <PoliceCarStolenDetailsForm
                          action="Edit"
                          model={editCarStolenReport}
                          handleInputChange={handleInputChange}
                      />
                      <button onClick={handleEditCarStolenReport} disabled={adding} className="pol-stolen-model-add-btn">
                          {adding ? (<div className="pol-stolen-inline-spinner"></div>) : t('Finish')}
                      </button>
                      {addError && (
                          <p className="pol-stolen-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {openImport && (
              <div className="reg-reg-modal">
                  <div className="reg-reg-modal-content">
                      <span className="reg-reg-close-btn" onClick={() => { setOpenImport(false); setImportData(null) }}>&times;</span>
                      <h2>{t('Import from csv')}</h2>
                      <div className="reg-reg-form-columns">
                          <div className="reg-reg-form-column-2">
                              <input type="file" id="excel-file" accept=".csv" className="csv-input" onChange={handleAddDataFromFile} />
                              <button onClick={handleImportClick} className="dealer-car-sales-form-image-add-button"> {t('Choose file')}</button>
                          </div>
                          {importData && (
                              <>
                                  <label>{t('Non-empty file is selected')}</label>
                                  <label className="reg-reg-error"> ! {t('Import file must have all data correct to be able to import')} !</label>
                              </>
                          )}
                          <button onClick={handleImportExcel} disabled={adding} className="reg-reg-model-add-btn">
                              {adding ? (<div className="reg-reg-inline-spinner"></div>) : t('Finish')}
                          </button>
                          {addError && (
                              <p className="reg-reg-error">{addError}</p>
                          )}
                      </div>
                  </div>
              </div>
          )}
          {paging && paging.TotalPages > 0 &&
              <>
                  <button className="export-reg-inspec-btn" onClick={handleDownloadCsv}>{t('Export to excel')}</button>
                  <a
                      href={`data:text/csv;charset=utf-8,${escape(data)}`}
                      download={`stolen-${Date.now()}.csv`}
                      hidden
                      id="excel"
                  />
                  <Pagination count={paging.TotalPages} onChange={(e, value) => setPage(value)} />
              </>
          }
      </div>
  );
}

export default PoliceStolenCarList;