import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import RegistryInspectionDetailsForm from '../../components/forms/registry/RegistryInspectionDetailsForm';
import RegistryInspectionInspectedCategoriesForm from '../../components/forms/registry/RegistryInspectionInspectedCategoriesForm';
import { AddCarInspection, EditCarInspection, ListCarInspection } from '../../services/api/CarInspection';
import { RootState } from '../../store/State';
import { APIResponse, CarInspectionDetail, CarInspectionHistory, Paging } from '../../utils/Interfaces';
import { isValidVIN } from '../../utils/Validators';
import '../../styles/RegistryCarInspection.css'
import PagingComponent from '../../components/paging/PagingComponent';
function RegistryInspectionList() {
    const { t, i18n } = useTranslation();
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
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
    const [searchQuery, setSearchQuery] = useState('');
    const validateCarInspection = (inspection: CarInspectionHistory): boolean => {
        if (!isValidVIN(inspection.carId)) {
            setAddError("VIN is invalid");
            return false;
        }
        if (!inspection.carId) {
            setAddError("VIN must be filled out");
            return false;
        }
        if (inspection.odometer <= 0 ) {
            setAddError("Odometer must be higher than 0");
            return false;
        }
        if (!inspection.reportDate) {
            setAddError("Report Date must be chosen");
            return false;
        }
        if (!inspection.description) {
            setAddError("Description must be filled out");
            return false;
        }
        if (!inspection.inspectionNumber) {
            setAddError("Inspection Number must be filled out");
            return false;
        }
        if (!inspection.inspectDate) {
            setAddError("Inspect Date must be chosen");
            return false;
        }
        if (inspection.carInspectionHistoryDetail.length === 0 ) {
            setAddError("Inspection must have details");
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
            setAddError("Inspection Category must be filled out");
            return false;
        }

        return true
    }
    const handleAddCarInspection = async () => {
        if (validateCarInspection(newInspection)) {
            setAdding(true);
            setAddError(null);
            const response: APIResponse = await AddCarInspection(newInspection, token);
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
            const response: APIResponse = await EditCarInspection(editInspection.id, editInspection, token);
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
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const carInspectionResponse: APIResponse = await ListCarInspection(token, page)
        if (carInspectionResponse.error) {
            setError(carInspectionResponse.error)
        } else {
            setInspectionList(carInspectionResponse.data)
            console.log(carInspectionResponse.pages)
            setPaging(carInspectionResponse.pages)
        }
        setLoading(false)
    }
    useEffect(() => {
        fetchData();
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <div className="reg-inspec-list-page">
          <div className="reg-inspec-top-bar">
              <button className="add-reg-inspec-btn" onClick={() => setShowModal(true)}>+ Add Car Inspection</button>
              <div className="reg-inspec-search-filter-container">
                  <input
                      type="text"
                      className="reg-inspec-search-bar"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                  />
              </div>
          </div>
          <table className="reg-inspec-table">
              <thead>
                  <tr>
                      <th>VIN</th>
                      <th>Inspection Number</th>
                      <th>Inspect Date</th>
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
                              <button onClick={fetchData} className="reg-inspec-retry-btn">Retry</button>
                          </td>
                      </tr>
                  ) : inspectionList.length > 0 ? (
                      inspectionList.map((model: any, index: number) => (
                          <tr key={index}>
                              <td onClick={() => { setEditInspection(model) }}>{model.carId}</td>
                              <td>{model.inspectionNumber}</td>
                              <td>{model.inspectDate}</td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={3}>No car inspections found</td>
                      </tr>
                  )}
              </tbody>
          </table>
          {paging &&
              <PagingComponent
                  CurrentPage={paging.CurrentPage}
                  TotalCount={paging.TotalCount}
                  PageSize={paging.PageSize}
                  TotalPages={paging.TotalPages}
                  HasPrevious={paging.HasPrevious}
                  HasNext={paging.HasNext}
              />}
          {showModal && (
              <div className="reg-inspec-modal">
                  <div className="reg-inspec-modal-content">
                      <span className="reg-inspec-close-btn" onClick={() => { setShowModal(false); setModalPage(1) }}>&times;</span>
                      <h2>Add Car</h2>
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
                          Previous
                      </button>
                      <button onClick={handleNextPage} disabled={adding} className="reg-inspec-next-btn">
                          {modalPage < 2 ? 'Next' : (adding ? (<div className="reg-inspec-inline-spinner"></div>) : 'Add')}
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
                      <h2>Edit Car</h2>
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
                          Previous
                      </button>
                      <button onClick={handleNextPage} disabled={adding} className="reg-inspec-next-btn">
                          {modalPage < 2 ? 'Next' : (adding ? (<div className="reg-inspec-model-inline-spinner"></div>) : 'Update')}
                      </button>
                      {addError && (
                          <p className="reg-inspec-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
      </div>
  );
}

export default RegistryInspectionList;