import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { AdminRequest, APIResponse, Paging, RequestSearchParams} from '../../utils/Interfaces';
import '../../styles/AdminCars.css'
import { ResponseRequest, GetAllUserRequest } from '../../services/api/Request';
import RequestAnsweringPage from '../../components/forms/admin/Request/RequestAnsweringPage';
import { Pagination } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

interface Column {
    id: 'type' | 'description' | 'createdTime' | 'createdByUserId' | 'status' | 'response' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

function AdminRequestList() {
    const { t, i18n } = useTranslation()
    const columns: readonly Column[] = [
        { id: 'type', label: t('Type'), minWidth: 10 },
        { id: 'description', label: t('Description'), minWidth: 100 },
        { id: 'createdTime', label: t('Created Date'), minWidth: 100 },
        { id: 'createdByUserId', label: t('Created By User'), minWidth: 100 },
        { id: 'status', label: t('Status'), minWidth: 100 },
        { id: 'response', label: t('Process Note'), minWidth: 100 },
        { id: 'actions', label: t('Actions'), minWidth: 100 }
    ];
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [modalPage, setModalPage] = useState(1);
    const [RequestList, setRequestList] = useState<AdminRequest[]>([]);
    const [editRequest, setEditRequest] = useState<AdminRequest | null>();
    const [page, setPage] = useState(0)
    const [paging, setPaging] = useState<Paging>()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [requestType, setRequestType] = useState(-1)
    const [requestStatus, setRequestStatus] = useState(-1)
    const [sortByDate, setSortByDate] = useState(0)
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [list, setList] = useState<AdminRequest[]>([])


    const handleResponseRequest = async () => {
        if (editRequest != null) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let unknownError = t('Something went wrong. Please try again')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            let updatedRequest = { ...editRequest };
            if (isNaN(+updatedRequest.status)) {
                updatedRequest.status = "1";
            }
            const response: APIResponse = await ResponseRequest(updatedRequest, token, connectAPIError, unknownError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setEditRequest(null);
                setMessage(t('Reponse successfully'))
                setOpenSuccess(true)
                fetchData();
            }

        }
    }

    const handleResetFilters = () => {
        setRequestType(-1)
        setRequestStatus(-1)
        setSortByDate(0)
        setResetTrigger(prev => prev + 1);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (editRequest) {
            setEditRequest({
                ...editRequest,
                [e.target.name]: e.target.value
            })
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let searchParams: RequestSearchParams = {
            requestStatus: requestStatus,
            requestType: requestType,
            sortByDate: sortByDate
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const RequestListResponse: APIResponse = await GetAllUserRequest(token, page+1, connectAPIError, language, searchParams)
        if (RequestListResponse.error) {
            setError(RequestListResponse.error)
        } else {
            setList(RequestListResponse.data)
            setPaging(RequestListResponse.pages)
        }
        setLoading(false)
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const [message, setMessage] = useState('')
    const [openSuccess, setOpenSuccess] = useState(false)
    const [openError, setOpenError] = useState(false)
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
        setOpenError(false);
    };
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
      <div className="ad-car-list-page">
          <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleClose} key={'top' + 'right'} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
              <MuiAlert elevation={6} variant="filled" severity="success" sx={{ width: '100%', zIndex: '2000' }}>
                  {message}
              </MuiAlert>
          </Snackbar>
          <Snackbar open={openError} autoHideDuration={3000} onClose={handleClose} key={'top' + 'right'} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
              <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '100%', zIndex: '2000' }}>
                  {error ? error : addError}
              </MuiAlert>
          </Snackbar>
          <div className="pol-alert-action">
              <Accordion>
                  <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                  >
                      <Typography style={{ fontWeight: 'bold' }}>{t('Search Bars and Filters')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      <div className="reg-inspec-search-filter-container">
                          <div className="reg-inspec-search-filter-item">
                              <label>{t('Type')}</label>
                              <select className="reg-inspec-search-bar"
                                  onChange={(e) => setRequestType(Number(e.target.value))}
                                  value={requestType}
                              >
                                  <option value="-1">{t('Any Type')}</option>
                                  <option value="0">{t('Data Correction')}</option>
                                  <option value="1">{t('Technical Support')}</option>
                                  <option value="2">{t('Report Inaccuracy')}</option>
                                  <option value="3">{t('Feedback')}</option>
                                  <option value="4">{t('General')}</option>
                              </select>
                          </div>
                          <div className="reg-inspec-search-filter-item">
                              <label>{t('Status')}</label>
                              <select className="reg-inspec-search-bar"
                                  onChange={(e) => setRequestStatus(Number(e.target.value))}
                                  value={requestStatus}
                              >
                                  <option value="-1">{t('Any Status')}</option>
                                  <option value="0">{t('Pending')}</option>
                                  <option value="1">{t('Approved')}</option>
                                  <option value="2">{t('Rejected')}</option>
                              </select>
                          </div>
                          {/*<div className="reg-inspec-search-filter-item">*/}
                          {/*    <label>{t('Sort By Date')}</label>*/}
                          {/*    <select className="reg-inspec-search-bar"*/}
                          {/*        onChange={(e) => setSortByDate(Number(e.target.value))}*/}
                          {/*        value={sortByDate}*/}
                          {/*    >*/}
                          {/*        <option value="0">{t('Descending')}</option>*/}
                          {/*        <option value="1">{t('Ascending')}</option>*/}
                          {/*    </select>*/}
                          {/*</div>*/}
                          <button
                              className="search-reg-inspec-btn"
                              onClick={() => { setPage(0); fetchData(); }}
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
                  </AccordionDetails>
              </Accordion>
          </div>
          <div className="plate-search-page-row">
              <div className="plate-alert-page-item">
                  <div className="plate-search-page-item-3">
                      <span style={{ display: 'block', width: '100%', fontWeight: 'bold', fontSize: '30px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#0037CD', color: 'white' }}>
                          {t('Request List')}
                      </span>
                      <TableContainer>
                          <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                  <TableRow>
                                      {columns.map((column, index) => (
                                          <TableCell
                                              key={column.id + '-' + index}
                                              align={column.align}
                                              style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}
                                          >
                                              {column.label}
                                          </TableCell>
                                      ))}
                                  </TableRow>
                              </TableHead>
                              <TableBody>
                                  {loading ? (
                                      <TableRow>
                                          <TableCell colSpan={9}>
                                              <div className="pol-crash-spinner"></div>
                                          </TableCell>
                                      </TableRow>
                                  ) : error ? (
                                      <TableRow>
                                          <TableCell colSpan={9}>
                                              {error}
                                              <button onClick={fetchData} className="pol-crash-retry-btn">{t('Retry')}</button>
                                          </TableCell>
                                      </TableRow>
                                  ) : list.length > 0 ? list
                                      .map((row, index1) => {
                                          return (
                                              <TableRow hover role="checkbox" tabIndex={-1} key={row.id + '-' + index1} style={{ backgroundColor: index1 % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                  {columns.map((column, index) => {
                                                      if (column.id !== 'actions' && column.id !== 'type' && column.id !=="createdTime") {
                                                          let value = row[column.id]
                                                          return (
                                                              <TableCell key={column.id + '-' + index1} align={column.align} style={{ textAlign: 'center' }}>
                                                                  {value}
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'actions') {
                                                          return (
                                                              <TableCell key={column.id + '-' + index1} align={column.align} style={{ textAlign: 'center' }}>
                                                                  <button onClick={() => { setEditRequest(row) }} disabled={adding} className="pol-crash-action-button">
                                                                      {t('Response')} &#x270E;
                                                                  </button>
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'type') {
                                                          let value = row[column.id]
                                                          return (
                                                              <TableCell key={column.id + '-' + index1} align={column.align} style={{ textAlign: 'center' }}>

                                                                  {t(value)}

                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'createdTime') {
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'center' }}>
                                                                  {row.createdTime ? new Date(row.createdTime).toLocaleDateString() : 'Date not available'}
                                                              </TableCell>
                                                          )
                                                      }
                                                  })}
                                              </TableRow>
                                          );
                                      }) :
                                      <TableRow>
                                          <TableCell colSpan={9}>
                                                      {t('No Request Found')}
                                          </TableCell>
                                      </TableRow>
                                  }
                              </TableBody>
                          </Table>
                      </TableContainer>
                      <TablePagination
                          rowsPerPageOptions={[15]}
                          component="div"
                          count={paging ? paging.TotalCount : 0}
                          rowsPerPage={15}
                          page={page}
                          onPageChange={handleChangePage}
                          labelDisplayedRows={
                              ({ from, to, count }) => {
                                  return '' + from + '-' + to + ' ' + t('of') + ' ' + count
                              }
                          }
                      />
                  </div>
              </div>
          </div>
          {editRequest && (
              <div className="pol-crash-modal">
                  <div className="pol-crash-modal-content">
                      <span className="pol-crash-close-btn" onClick={() => { setEditRequest(null); setModalPage(1); setError(''); setAddError('') }}>&times;</span>
                      <h2>{t('Process Request')}</h2>
                      <div className="pol-crash-modal-content-2">
                              <RequestAnsweringPage
                                  action="Edit"
                                  model={editRequest}
                                  handleInputChange={handleInputChange}
                              />
                          {addError && (
                              <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', zIndex: '2000', marginTop: '20px' }}>
                                  {addError}
                              </MuiAlert>
                          )}
                          <button onClick={handleResponseRequest} className="ad-car-prev-btn">
                              {t('Response')}
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );
}

export default AdminRequestList;