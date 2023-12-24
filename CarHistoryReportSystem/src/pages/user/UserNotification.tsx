import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import {APIResponse, Paging, UserNotification } from '../../utils/Interfaces';
import '../../styles/Reqeuest.css'
import { JWTDecoder } from '../../utils/JWTDecoder';
import { t } from 'i18next';
import { EditUserNotificationStatus, GetUserNotification } from '../../services/api/Notification';
import { Pagination } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import NotificationDetailPage from '../../components/forms/user/NotificationDetailPage';
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
    id: 'notificationId' | 'title' | 'description' | "isRead";
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

function UserNotificationPage() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const { t, i18n } = useTranslation()
    const columns: readonly Column[] = [
        { id: 'notificationId', label: t('Notification ID'), minWidth: 10 },
        { id: 'title', label: t('Title'), minWidth: 100 },
        { id: 'description', label: t('Description'), minWidth: 100 }
    ];
    const [list, setList] = useState<UserNotification[]>([])
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [notificationList, setNotificationList] = useState<UserNotification[]>([]);
    const [addError, setAddError] = useState<string | null>(null);
    const filterNotification = notificationList.filter((request: any) => {
        const matchingQuery = notificationList
        return matchingQuery
    })
    const [resetTrigger, setResetTrigger] = useState(0);
    const [page, setPage] = useState(0)
    const [paging, setPaging] = useState<Paging>()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const id = JWTDecoder(token).nameidentifier
    const [notificationDetail, setNotificationDetail] = useState<UserNotification | null>(null)
    const userNotificationRead = {
        notificationId: '',
        userId: id
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const NotificationListResponse: APIResponse = await GetUserNotification(id, page+1, connectAPIError, language)
        if (NotificationListResponse.error) {
            setError(NotificationListResponse.error)
        } else {
            setNotificationList(NotificationListResponse.data)
            setList(NotificationListResponse.data)
            setPaging(NotificationListResponse.pages)
        }
        setLoading(false)
    }

    const handleNotificationClick = async (notification: UserNotification) => {
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const response: APIResponse = await EditUserNotificationStatus({
            ...userNotificationRead,
            notificationId: notification.notificationId
        }, token, connectAPIError, language);
        if (response.error) {
            setAddError(response.error);
        } else {
            fetchData();
        }
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
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
        <div className="pol-crash-list-page">
            <div className="plate-search-page-row">
                <div className="plate-alert-page-item">
                    <div className="plate-search-page-item-3">
                        <span style={{ display: 'block', width: '100%', fontWeight: 'bold', fontSize: '30px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#3876BF', color: 'white', paddingBottom: '15px', paddingTop: '15px' }}>
                            {t('Notification List')}
                        </span>
                        <TableContainer>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column, index) => (
                                            <TableCell
                                                key={column.id + '-' + index}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '20px', textAlign: 'left' }}
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
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    tabIndex={-1}
                                                    key={row.notificationId}
                                                    style={{
                                                        backgroundColor: row.isRead ? '#D3D3D3' : (index1 % 2 === 1 ? 'white' : '#E1E1E1'),
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => {
                                                        setNotificationDetail(row);
                                                        handleNotificationClick(row);
                                                    }}
                                                >
                                                    {columns.map((column, index) => {
                                                        const value = column.id === 'title' || column.id === 'description'
                                                            ? row.notification[column.id]
                                                            : row[column.id];
                                                        const cellContent = column.id === 'notificationId' ? (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <InfoIcon
                                                                    style={{ verticalAlign: 'middle'}}
                                                                />
                                                                {value}
                                                            </div>
                                                        ) : value;

                                                        return (
                                                            <TableCell
                                                                key={`${column.id}-${index1}`}
                                                                align={column.align}
                                                                style={{
                                                                    textAlign: column.align === 'right' ? 'right' : 'left',
                                                                    color: row.isRead ? '#A9A9A9' : 'inherit',
                                                                }}
                                                            >
                                                                {cellContent}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        }) :
                                        <TableRow>
                                            <TableCell colSpan={9}>
                                                {t('No Notification Found')}
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
            {notificationDetail && (
                <div className="pol-crash-modal">
                    <div className="pol-crash-modal-content">
                        <span className="pol-crash-close-btn" onClick={() => { setNotificationDetail(null) }}>&times;</span>
                        <h2>{t('Notification Detail')}</h2>
                        {(
                            <NotificationDetailPage
                                model={notificationDetail}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserNotificationPage;