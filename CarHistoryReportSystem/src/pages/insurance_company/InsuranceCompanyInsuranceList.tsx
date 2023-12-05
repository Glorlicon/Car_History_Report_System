import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import InsuranceCompanyInsuranceDetailsForm from '../../components/forms/insurance/InsuranceCompanyInsuranceDetailsForm';
import { AddCarInsurance, DownloadInsuranceExcelFile, EditCarInsurance, GetInsuranceExcel, ImportInsuranceFromExcel, ListCarInsurance } from '../../services/api/CarInsurance';
import { RootState } from '../../store/State';
import { APIResponse, CarInsurance, CarInsuranceSearchParams, Paging } from '../../utils/Interfaces';
import { isValidPlateNumber, isValidVIN } from '../../utils/Validators';
import '../../styles/InsuranceCompanyInsurance.css'
import { useTranslation } from 'react-i18next';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { Pagination } from '@mui/material';
function InsuranceCompanyInsuranceList() {
    const { t, i18n } = useTranslation()
    const [page, setPage] = useState(1)
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const id = JWTDecoder(token).dataprovider
    const [searchVinId, setSearchVinId] = useState('')
    const [searchInsuranceNumber, setSearchInsuranceNumber] = useState('')
    const [searchStartInsuranceDateMin, setSearchStartInsuranceDateMin] = useState('')
    const [searchStartInsuranceDateMax, setSearchStartInsuranceDateMax] = useState('')
    const [searchEndInsuranceDateMin, setSearchEndInsuranceDateMin] = useState('')
    const [searchEndInsuranceDateMax, setSearchEndInsuranceDateMax] = useState('')
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [carInsuranceList, setCarInsuranceList] = useState<CarInsurance[]>([]);
    const [newCarInsurance, setNewCarInsurance] = useState<CarInsurance>({
        insuranceNumber: '',
        carId: '',
        startDate: '',
        endDate: '',
        description: '',
        odometer: 0,
        note: '',
        reportDate: ''
    });
    const [editCarInsurance, setEditCarInsurance] = useState<CarInsurance | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
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
        const res = await DownloadInsuranceExcelFile(token, connectAPIError, language)
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
            const response: APIResponse = await ImportInsuranceFromExcel(token, importData, connectAPIError, language);
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

    const validateCarInsurance = (insurance: CarInsurance): boolean => {
        if (!isValidVIN(insurance.carId)) {
            setAddError(t('VIN is invalid'));
            return false;
        }
        if (!insurance.carId) {
            setAddError(t('VIN must be filled out'));
            return false;
        }
        if (!insurance.insuranceNumber) {
            setAddError(t('Insurance Number must be filled out'));
            return false;
        }
        if (!insurance.odometer) {
            setAddError(t('Odometer must be chosen'));
            return false;
        }
        if (!insurance.startDate) {
            setAddError(t('Start Date must be chosen'));
            return false;
        }
        if (!insurance.endDate) {
            setAddError(t('End Date must be chosen'));
            return false;
        }
        if (!insurance.description) {
            setAddError(t('Description must be filled out'));
            return false;
        }
        if (!insurance.note) {
            setAddError(t('Note must be filled out'));
            return false;
        }
        if (!insurance.reportDate) {
            setAddError(t('Report Date must be chosen'));
            return false;
        }
        return true;
    };
    const handleAddCarInsurance = async () => {
        if (validateCarInsurance(newCarInsurance)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await AddCarInsurance(newCarInsurance, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                fetchData();
            }
        }
    }

    const handleEditCarInsurance = async () => {
        if (editCarInsurance && editCarInsurance.id && validateCarInsurance(editCarInsurance)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await EditCarInsurance(editCarInsurance.id, editCarInsurance, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setEditCarInsurance(null)
                fetchData();
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (editCarInsurance) {
            setEditCarInsurance({
                ...editCarInsurance,
                [e.target.name]: value
            })
        } else {
            setNewCarInsurance({
                ...newCarInsurance,
                [e.target.name]: value,
            });
        }
    };

    const handleResetFilters = () => {
        setSearchEndInsuranceDateMax('')
        setSearchEndInsuranceDateMin('')
        setSearchInsuranceNumber('')
        setSearchStartInsuranceDateMax('')
        setSearchStartInsuranceDateMin('')
        setSearchVinId('')
        setResetTrigger(prev => prev + 1);
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let searchParams: CarInsuranceSearchParams = {
            vinID: searchVinId,
            insuranceNumber: searchInsuranceNumber,
            startInsuranceDateMax: searchStartInsuranceDateMax,
            startInsuranceDateMin: searchStartInsuranceDateMin,
            endInsuranceDateMax: searchEndInsuranceDateMax,
            endInsuranceDateMin: searchEndInsuranceDateMin
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const carInsuranceResponse: APIResponse = await ListCarInsurance(id, token, page, connectAPIError, language, searchParams)
        if (carInsuranceResponse.error) {
            setError(carInsuranceResponse.error)
        } else {
            setCarInsuranceList(carInsuranceResponse.data)
            setPaging(carInsuranceResponse.pages)
            const responseCsv: APIResponse = await GetInsuranceExcel(id, token, page, connectAPIError, language, searchParams)
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
      <div className="ins-ins-list-page">
          <div className="pol-crash-top-bar">
              <button className="add-pol-crash-btn" onClick={() => setShowModal(true)}>+ {t('Add New Car Insurance')}</button>
              <button className="add-pol-crash-btn" onClick={() => { handleDownloadTemplate() }}>&dArr; {t('Excel Template')}</button>
              <a
                  href={`data:text/csv;charset=utf-8,${escape(template)}`}
                  download={`template.csv`}
                  hidden
                  id="template"
              />
              <button className="add-pol-crash-btn" onClick={() => { setOpenImport(true) }}>+ {t('Import From Excel')}</button>
          </div>
          <div className="reg-inspec-top-bar">
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
                      <label>{t('Insurance Number')}</label>
                      <input
                          type="text"
                          className="reg-inspec-search-bar"
                          placeholder={t('Search by Insurance Number')}
                          value={searchInsuranceNumber}
                          onChange={(e) => setSearchInsuranceNumber(e.target.value)}
                      />
                  </div>
                  <div className="reg-inspec-search-filter-item-2">
                      <label>{t('Insurance Start Date')}</label>
                      <div className="reg-inspec-search-filter-item-2-dates">
                          <label>{t('From')}: </label>
                          <input
                              type="date"
                              className="reg-inspec-search-bar"
                              placeholder="Insurance Start Date"
                              value={searchStartInsuranceDateMin}
                              onChange={(e) => setSearchStartInsuranceDateMin(e.target.value)}
                          />
                          <label>{t('To')}: </label>
                          <input
                              type="date"
                              className="reg-inspec-search-bar"
                              placeholder="Insurance Start Date"
                              value={searchStartInsuranceDateMax}
                              onChange={(e) => setSearchStartInsuranceDateMax(e.target.value)}
                          />
                      </div>
                  </div>
                  <div className="reg-inspec-search-filter-item-2">
                      <label>{t('Insurance End Date')}</label>
                      <div className="reg-inspec-search-filter-item-2-dates">
                          <label>{t('From')}: </label>
                          <input
                              type="date"
                              className="reg-inspec-search-bar"
                              placeholder="Insurance End Date"
                              value={searchEndInsuranceDateMin}
                              onChange={(e) => setSearchEndInsuranceDateMin(e.target.value)}
                          />
                          <label>{t('To')}: </label>
                          <input
                              type="date"
                              className="reg-inspec-search-bar"
                              placeholder="Insurance End Date"
                              value={searchEndInsuranceDateMax}
                              onChange={(e) => setSearchEndInsuranceDateMax(e.target.value)}
                          />
                      </div>
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
          <table className="ins-ins-table">
              <thead>
                  <tr>
                      <th>{t('Car VIN')}</th>
                      <th>{t('Insurance Number')}</th>
                      <th>{t('Insurance Start Date')}</th>
                      <th>{t('Insurance End Date')}</th>
                  </tr>
              </thead>
              <tbody>
                  {loading ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              <div className="ins-ins-spinner"></div>
                          </td>
                      </tr>
                  ) : error ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              {error}
                                  <button onClick={fetchData} className="ins-ins-retry-btn">{t('Retry')}</button>
                          </td>
                      </tr>
                  ) : carInsuranceList.length > 0 ? (
                      carInsuranceList.map((model: CarInsurance, index: number) => (
                          <tr key={index}>
                              <td onClick={() => { setEditCarInsurance(model) }}>{model.carId}</td>
                              <td>{model.insuranceNumber}</td>
                              <td>{model.startDate}</td>
                              <td>{model.endDate}</td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={5}>{t('No car insurances found')}</td>
                      </tr>
                  )}
              </tbody>
          </table>
          {showModal && (
              <div className="ins-ins-modal">
                  <div className="ins-ins-modal-content">
                      <span className="ins-ins-close-btn" onClick={() => { setShowModal(false) }}>&times;</span>
                      <h2>{t('Add New Car Insurance')}</h2>
                      <InsuranceCompanyInsuranceDetailsForm
                          action="Add"
                          model={newCarInsurance}
                          handleInputChange={handleInputChange}
                      />
                      <button onClick={handleAddCarInsurance} disabled={adding} className="ins-ins-model-add-btn">
                          {adding ? (<div className="ins-ins-inline-spinner"></div>) : t('Finish')}
                      </button>
                      {addError && (
                          <p className="ins-ins-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {editCarInsurance && (
              <div className="ins-ins-modal">
                  <div className="ins-ins-modal-content">
                      <span className="ins-ins-close-btn" onClick={() => { setShowModal(false); setEditCarInsurance(null) }}>&times;</span>
                      <h2>{t('Edit Car Insurance')}</h2>
                      <InsuranceCompanyInsuranceDetailsForm
                          action="Edit"
                          model={editCarInsurance}
                          handleInputChange={handleInputChange}
                      />
                      <button onClick={handleEditCarInsurance} disabled={adding} className="ins-ins-model-add-btn">
                          {adding ? (<div className="ins-ins-inline-spinner"></div>) : t('Finish')}
                      </button>
                      {addError && (
                          <p className="ins-ins-error">{addError}</p>
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
                      download={`insurance-${Date.now()}.csv`}
                      hidden
                      id="excel"
                  />
                  <Pagination count={paging.TotalPages} onChange={(e, value) => setPage(value)} />
              </>
          }
      </div>
  );
}

export default InsuranceCompanyInsuranceList;