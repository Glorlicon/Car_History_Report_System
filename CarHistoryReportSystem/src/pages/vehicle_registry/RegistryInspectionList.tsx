import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import RegistryInspectionDetailsForm from '../../components/forms/registry/RegistryInspectionDetailsForm';
import RegistryInspectionInspectedCategoriesForm from '../../components/forms/registry/RegistryInspectionInspectedCategoriesForm';
import { AddCarInspection, EditCarInspection, GetInspectionExcel, ListCarInspection } from '../../services/api/CarInspection';
import { RootState } from '../../store/State';
import { APIResponse, CarInspectionDetail, CarInspectionHistory, CarInspectionSearchParams, Paging } from '../../utils/Interfaces';
import { isValidVIN } from '../../utils/Validators';
import '../../styles/RegistryCarInspection.css'
import { Pagination } from '@mui/material';
import { JWTDecoder } from '../../utils/JWTDecoder';
function RegistryInspectionList() {
    const { t, i18n } = useTranslation();
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const id = JWTDecoder(token).dataprovider
    const [page, setPage] = useState(1)
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [modalPage, setModalPage] = useState(1);
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [inspectionList, setInspectionList] = useState<CarInspectionHistory[]>([]);
    const [paging, setPaging] = useState<Paging>()
    const [newInspection, setNewInspection] = useState<CarInspectionHistory>({
        carId: '',
        odometer: 0,
        note: '',
        reportDate: '',
        description: '',
        inspectionNumber: '',
        inspectDate: '',
        carInspectionHistoryDetail: []
    })
    const [editInspection, setEditInspection] = useState<CarInspectionHistory | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [searchCarID, setSearchCarId] = useState('')
    const [searchInspectionNumber, setSearchInspectionNumber] = useState('')
    const [searchInspectionStartDate, setSearchInspectionStartDate] = useState('')
    const [searchInspectionEndDate, setSearchInspectionEndDate] = useState('')
    const [resetTrigger, setResetTrigger] = useState(0);
    const [data, setData] = useState("")
    const handleDownloadCsv = () => {
        const element = document.getElementById('excel')
        element?.click()
    }
    const validateCarInspection = (inspection: CarInspectionHistory): boolean => {
        if (!isValidVIN(inspection.carId)) {
            setAddError(t('VIN is invalid'));
            return false;
        }
        if (!inspection.carId) {
            setAddError(t('VIN must be filled out'));
            return false;
        }
        if (inspection.odometer <= 0 ) {
            setAddError(t('Odometer must be higher than 0'));
            return false;
        }
        if (!inspection.reportDate) {
            setAddError(t('Report Date must be chosen'));
            return false;
        }
        if (!inspection.description) {
            setAddError(t('Description must be filled out'));
            return false;
        }
        if (!inspection.inspectionNumber) {
            setAddError(t('Inspection Number must be filled out'));
            return false;
        }
        if (!inspection.inspectDate) {
            setAddError(t('Inspect Date must be chosen'));
            return false;
        }
        if (inspection.carInspectionHistoryDetail.length === 0 ) {
            setAddError(t('Inspection must have details'));
            return false;
        }
        for (let i = 0; i < inspection.carInspectionHistoryDetail.length; i++) {
            const check = validateCarInsectionDetails(inspection.carInspectionHistoryDetail[i])
            if (!check) return false
        }
        return true;
    };

    const validateCarInsectionDetails = (detail: CarInspectionDetail): boolean => {
        if (!detail.inspectionCategory) {
            setAddError(t('Inspection Category must be filled out'));
            return false;
        }

        return true
    }
    const handleAddCarInspection = async () => {
        if (validateCarInspection(newInspection)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await AddCarInspection(newInspection, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setModalPage(1);
                fetchData();
            }
        }
    }
    const handleEditCarInspection = async () => {
        if (editInspection != null && editInspection.id != null && validateCarInspection(editInspection)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await EditCarInspection(editInspection.id, editInspection, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setEditInspection(null);
                setModalPage(1);
                fetchData();
            }
        }
    }
    const handlePreviousPage = () => {
        if (modalPage > 1) {
            setModalPage(prevPage => prevPage - 1);
        }
    };
    const handleNextPage = () => {
        if (modalPage < 2) {
            setModalPage(prevPage => prevPage + 1);
        } else {
            if (editInspection) handleEditCarInspection();
            else handleAddCarInspection();
        }
    };
    const handleAddInspectionCategory = () => {
        if (editInspection) {
            setEditInspection({
                ...editInspection,
                carInspectionHistoryDetail: [
                    ...editInspection.carInspectionHistoryDetail,
                    {
                        inspectionCategory: '',
                        isPassed: false,
                        note: ''
                    }
                ]
            })
        } else {
            setNewInspection({
                ...newInspection,
                carInspectionHistoryDetail: [
                    ...newInspection.carInspectionHistoryDetail,
                    {
                        inspectionCategory: '',
                        isPassed: false,
                        note:''
                    }
                ]
            })
        }
    }

    const handleResetFilters = () => {
        setSearchCarId('')
        setSearchInspectionEndDate('')
        setSearchInspectionNumber('')
        setSearchInspectionStartDate('')
        setResetTrigger(prev => prev + 1);
    }

    const handleRemoveInspectionCategory = (index: number) => {
        if (editInspection) {
            let carInspectionHistoryDetails = [...editInspection.carInspectionHistoryDetail];
            carInspectionHistoryDetails.splice(index, 1);
            setEditInspection({
                ...editInspection,
                carInspectionHistoryDetail: carInspectionHistoryDetails,
            });
        } else {
            let carInspectionHistoryDetails = [...newInspection.carInspectionHistoryDetail];
            carInspectionHistoryDetails.splice(index, 1);
            setNewInspection({
                ...newInspection,
                carInspectionHistoryDetail: carInspectionHistoryDetails,
            });
        }
    }

    const handleInspectionCategoryStatus = (index: number) => {
        if (editInspection) {
            setEditInspection({
                ...editInspection,
                carInspectionHistoryDetail: editInspection.carInspectionHistoryDetail
                    .map((detail: CarInspectionDetail, i) => i === index ? { ...detail, isPassed: !detail.isPassed } : detail)
            })
        } else {
            setNewInspection({
                ...newInspection,
                carInspectionHistoryDetail: newInspection.carInspectionHistoryDetail
                    .map((detail: CarInspectionDetail, i) => i === index ? { ...detail, isPassed: !detail.isPassed } : detail)
            })
        }
    }

    const handleChangeInspectionCategory = (index: number, name: string) => {
        if (editInspection) {
            setEditInspection({
                ...editInspection,
                carInspectionHistoryDetail: editInspection.carInspectionHistoryDetail
                    .map((detail: CarInspectionDetail, i) => i === index ? { ...detail, inspectionCategory: name } : detail)
            })
        } else {
            setNewInspection({
                ...newInspection,
                carInspectionHistoryDetail: newInspection.carInspectionHistoryDetail
                    .map((detail: CarInspectionDetail, i) => i === index ? { ...detail, inspectionCategory: name } : detail)
            })
        }
    }

    const handleChangeInspectionNote = (index: number, name: string) => {
        if (editInspection) {
            setEditInspection({
                ...editInspection,
                carInspectionHistoryDetail: editInspection.carInspectionHistoryDetail
                    .map((detail: CarInspectionDetail, i) => i === index ? { ...detail, note: name } : detail)
            })
        } else {
            setNewInspection({
                ...newInspection,
                carInspectionHistoryDetail: newInspection.carInspectionHistoryDetail
                    .map((detail: CarInspectionDetail, i) => i === index ? { ...detail, note: name } : detail)
            })
        }
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (editInspection) {
            setEditInspection({
                ...editInspection,
                [e.target.name]: value
            })
        } else {
            setNewInspection({
                ...newInspection,
                [e.target.name]: value,
            });
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let searchParams: CarInspectionSearchParams = {
            carId: searchCarID,
            endDate: searchInspectionEndDate,
            inspectionNumber: searchInspectionNumber,
            startDate: searchInspectionStartDate
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const carInspectionResponse: APIResponse = await ListCarInspection(id, token, page, connectAPIError, language, searchParams)
        if (carInspectionResponse.error) {
            setError(carInspectionResponse.error)
        } else {
            setInspectionList(carInspectionResponse.data)
            setPaging(carInspectionResponse.pages)
            const responseCsv: APIResponse = await GetInspectionExcel(id, token, page, connectAPIError, language, searchParams)
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
      <div className="reg-inspec-list-page">
          <div className="reg-inspec-top-bar">
              <button className="add-reg-inspec-btn" onClick={() => setShowModal(true)}>{t('+ Add Car Inspection')}</button>
          </div>
          <div className="reg-inspec-top-bar">
              <div className="reg-inspec-search-filter-container">
                  <div className="reg-inspec-search-filter-item">
                      <label>{t('Car ID')}</label>
                      <input
                          type="text"
                          className="reg-inspec-search-bar"
                          placeholder={t('Search by Car ID')}
                          value={searchCarID}
                          onChange={(e) => setSearchCarId(e.target.value)}
                      />
                  </div>
                  <div className="reg-inspec-search-filter-item">
                      <label>{t('Inspection Number')}</label>
                      <input
                          type="text"
                          className="reg-inspec-search-bar"
                          placeholder={t('Search by Inspection Number')}
                          value={searchInspectionNumber}
                          onChange={(e) => setSearchInspectionNumber(e.target.value)}
                      />
                  </div>
                  <div className="reg-inspec-search-filter-item-2">
                      <label>{t('Inspection Date')}</label>
                      <div className="reg-inspec-search-filter-item-2-dates">
                          <label>{t('From')}: </label>
                          <input
                              type="date"
                              className="reg-inspec-search-bar"
                              placeholder="Inspection Start Date"
                              value={searchInspectionStartDate}
                              onChange={(e) => setSearchInspectionStartDate(e.target.value)}
                          />
                          <label>{t('To')}: </label>
                          <input
                              type="date"
                              className="reg-inspec-search-bar"
                              placeholder="Inspection End Date"
                              value={searchInspectionEndDate}
                              onChange={(e) => setSearchInspectionEndDate(e.target.value)}
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
          <table className="reg-inspec-table">
              <thead>
                  <tr>
                      <th>{t('VIN')}</th>
                      <th>{t('Inspection Number')}</th>
                      <th>{t('Inspect Date')}</th>
                  </tr>
              </thead>
              <tbody>
                  {loading ? (
                      <tr>
                          <td colSpan={3} style={{ textAlign: 'center' }}>
                              <div className="reg-inspec-spinner"></div>
                          </td>
                      </tr>
                  ) : error ? (
                      <tr>
                          <td colSpan={3} style={{ textAlign: 'center' }}>
                              {error}
                              <button onClick={fetchData} className="reg-inspec-retry-btn">{t('Retry')}</button>
                          </td>
                      </tr>
                  ) : inspectionList.length > 0 ? (
                      inspectionList.map((model: any, index: number) => (
                          <tr key={index}>
                              <td onClick={() => { setEditInspection(model) }}>{model.carId} &#x270E;</td>
                              <td>{model.inspectionNumber}</td>
                              <td>{model.inspectDate}</td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={3}>{t('No car inspections found')}</td>
                      </tr>
                  )}
              </tbody>
          </table>
          {showModal && (
              <div className="reg-inspec-modal">
                  <div className="reg-inspec-modal-content">
                      <span className="reg-inspec-close-btn" onClick={() => { setShowModal(false); setModalPage(1) }}>&times;</span>
                      <h2>{t('Add Car Inspection')}</h2>
                      {modalPage === 1 && (
                          <RegistryInspectionDetailsForm
                              action="Add"
                              handleInputChange={handleInputChange}
                              model={newInspection}
                          />
                      )}
                      {modalPage === 2 && (
                          <RegistryInspectionInspectedCategoriesForm
                              action="Add"
                              model={newInspection}
                              handleAddInspectionCategory={handleAddInspectionCategory}
                              handleChangeInspectionCategory={handleChangeInspectionCategory}
                              handleRemoveInspectionCategory={handleRemoveInspectionCategory}
                              handleInspectionCategoryStatus={handleInspectionCategoryStatus}
                              handleChangeInspectionNote={handleChangeInspectionNote}
                          />
                      )}
                      <button onClick={handlePreviousPage} disabled={modalPage === 1} className="reg-inspec-prev-btn">
                          {t('Previous')}
                      </button>
                      <button onClick={handleNextPage} disabled={adding} className="reg-inspec-next-btn">
                          {modalPage < 2 ? t('Next') : (adding ? (<div className="reg-inspec-inline-spinner"></div>) : t('Finish'))}
                      </button>
                      {addError && (
                          <p className="reg-inspec-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {editInspection && (
              <div className="reg-inspec-modal">
                  <div className="reg-inspec-modal-content">
                      <span className="reg-inspec-close-btn" onClick={() => { setEditInspection(null); setModalPage(1) }}>&times;</span>
                      <h2>{t('Edit Car Inspection')}</h2>
                      {modalPage === 1 && (
                          <RegistryInspectionDetailsForm
                              action="Edit"
                              handleInputChange={handleInputChange}
                              model={editInspection}
                          />
                      )}
                      {modalPage === 2 && (
                          <RegistryInspectionInspectedCategoriesForm
                              action="Edit"
                              model={editInspection}
                              handleAddInspectionCategory={handleAddInspectionCategory}
                              handleChangeInspectionCategory={handleChangeInspectionCategory}
                              handleRemoveInspectionCategory={handleRemoveInspectionCategory}
                              handleInspectionCategoryStatus={handleInspectionCategoryStatus}
                              handleChangeInspectionNote={handleChangeInspectionNote}
                          />
                      )}
                      <button onClick={handlePreviousPage} disabled={modalPage === 1} className="reg-inspec-prev-btn">
                          {t('Previous')}
                      </button>
                      <button onClick={handleNextPage} disabled={adding} className="reg-inspec-next-btn">
                          {modalPage < 2 ? t('Next') : (adding ? (<div className="reg-inspec-model-inline-spinner"></div>) : t('Finish'))}
                      </button>
                      {addError && (
                          <p className="reg-inspec-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {paging && paging.TotalPages > 0 &&
              <>
              <button className="export-reg-inspec-btn" onClick={handleDownloadCsv}>{t('Export to excel')}</button>
              <a
                  href={`data:text/csv;charset=utf-8,${escape(data)}`}
                  download={`inpection-${Date.now()}.csv`}
                  hidden
                  id="excel"
              />
                  <Pagination count={paging.TotalPages} onChange={(e, value) => setPage(value)} />
              </>
          }
      </div>
  );
}

export default RegistryInspectionList;