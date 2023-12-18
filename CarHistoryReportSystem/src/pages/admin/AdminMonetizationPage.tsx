import { Pagination } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ListOrdersForGraph, ListOrders, ListOrdersExcel } from '../../services/api/Order';
import { RootState } from '../../store/State';
import { APIResponse, OrderResponse, OrderSearchParams, Paging } from '../../utils/Interfaces';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { ReportPackages } from '../../utils/const/ReportPackages';
import '../../styles/AdminMonetization.css'
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
    id: 'id' | 'orderOptionId' | 'userId' | 'transactionId' | 'createdDate';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
function AdminMonetizationPage() {
    const { t, i18n } = useTranslation()
    const columns: readonly Column[] = [
        { id: 'id', label: 'ID', minWidth: 10 },
        { id: 'orderOptionId', label: t('Order Option'), minWidth: 100 },
        { id: 'userId', label: t('User ID'), minWidth: 100 },
        { id: 'transactionId', label: t('Transaction ID'), minWidth: 100 },
        { id: 'createdDate', label: t('Transaction Date'), minWidth: 100 }
    ];
    const [page, setPage] = useState(0)
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [searchUserId, setSearchUserId] = useState('')
    const [searchOption, setSearchOption] = useState('')
    const [searchTransactionId, setSearchTransactionId] = useState('')
    const [searchCreatedDateStart, setSearchCreatedDateStart] = useState('')
    const [searchCreatedDateEnd, setSearchCreatedDateEnd] = useState('')
    const [resetTrigger, setResetTrigger] = useState(0);
    const [data, setData] = useState("")
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [orderList, setOrderList] = useState<OrderResponse[]>([])
    const [showOrderDetails, setShowOrderDetails] = useState<OrderResponse | null>(null)
    const [months, setMonths] = useState<string[]>([])
    const [periodIncomes, setPeriodIncomes] = useState<number[]>([])
    const [periodPackageCount, setPeriodPackageCount] = useState<number[]>([])
    const [days, setDays] = useState<number[]>([])
    const [dailyTransactions, setDailyTransactions] = useState<number[]>([])
    const [dailyIncome, setDailyIncome] = useState<number[]>([])
    const [monthlyPackageCounts, setMonthlyPackageCounts] = useState<number[]>([])
    const handleDownloadCsv = () => {
        const element = document.getElementById('excel')
        element?.click()
    }


    const handleResetFilters = () => {
        setSearchCreatedDateEnd('')
        setSearchCreatedDateStart('')
        setSearchOption('')
        setSearchTransactionId('')
        setSearchUserId('')
        setResetTrigger(prev => prev + 1);
    }

    const getMonthlyIncomeAndPackageCounts = (orders: OrderResponse[]): { months: string[], periodIncomes: number[], periodPackageCount: number[] } => {
        let months: string[] = [];
        let periodIncomes: number[] = new Array(6).fill(0);
        let periodPackageCount: number[] = new Array(ReportPackages.length).fill(0);

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        for (let i = 0; i < 6; i++) {
            let month = new Date(currentYear, currentMonth - i, 1);
            months.unshift(month.toISOString().slice(0, 7));
        }

        orders.forEach(order => {
            const orderDate = new Date(order.createdDate);
            const orderYear = orderDate.getFullYear();
            const orderMonth = orderDate.getMonth() + 1;

            if (orderYear === currentYear && orderMonth >= currentMonth - 6 && orderMonth <= currentMonth) {
                const monthKey = new Date(orderYear, orderMonth, 1).toISOString().slice(0, 7);
                const monthIndex = months.indexOf(monthKey);

                if (monthIndex !== -1) {
                    const price = ReportPackages[order.orderOptionId - 1].price;
                    periodIncomes[monthIndex] += price / 1000;

                    // Increment the total package count for the specific package type
                    periodPackageCount[order.orderOptionId - 1]++;
                }
            }
        });

        return { months, periodIncomes, periodPackageCount };
    };

    const getDetailedMonthlyStatistics = (orderResponses: OrderResponse[]): { days: number[], dailyTransactions: number[], dailyIncome: number[], monthlyPackageCounts: number[]} => {
        // Current date for reference
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() ;

        // Get the number of days in the current month and the number of report packages
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const numOfPackages = ReportPackages.length;

        // Initialize the arrays
        let days: number[] = [];
        let dailyTransactions: number[] = new Array(daysInMonth).fill(0);
        let dailyIncome: number[] = new Array(daysInMonth).fill(0);
        let monthlyPackageCounts: number[] = new Array(numOfPackages).fill(0);

        // Populate the days array
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        orderResponses.forEach(order => {
            const orderDate = new Date(order.createdDate);

            // Check if the order is in the current month and year
            if (orderDate.getFullYear() === currentYear && orderDate.getMonth() === currentMonth) {
                const dayIndex = orderDate.getDate() - 1;

                // Increment the count for the specific day
                dailyTransactions[dayIndex]++;

                // Add the price for the specific day
                const price = ReportPackages[order.orderOptionId - 1].price;
                dailyIncome[dayIndex] += price/1000;

                // Increment the package count
                if (order.orderOptionId >= 1 && order.orderOptionId <= numOfPackages) {
                    monthlyPackageCounts[order.orderOptionId - 1]++;
                }
            }
        });

        return { days, dailyTransactions, dailyIncome, monthlyPackageCounts };
    }

    const formatDate = (dateTimeString: string): string => {
        const date = new Date(dateTimeString);

        // Format the date as dd-mm-yyyy
        const formattedDate = date.getDate().toString().padStart(2, '0') + '-' +
            (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
            date.getFullYear();

        // Format the time as HH:MM (without seconds and milliseconds)
        const formattedTime = date.getHours().toString().padStart(2, '0') + ':' +
            date.getMinutes().toString().padStart(2, '0');

        return formattedTime + ' ' + formattedDate;
    }
    const getOrderOption = (type: number): string => {
        return ReportPackages[type-1].type
    }
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let searchParams: OrderSearchParams = {
            createdDateEnd: searchCreatedDateEnd,
            createdDateStart: searchCreatedDateStart,
            orderOption: searchOption,
            transactionId: searchTransactionId,
            usedId: searchUserId
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const response: APIResponse = await ListOrders(token, page+1, connectAPIError, language, searchParams)
        if (response.error) {
            setError(response.error)
        } else {
            setOrderList(response.data)
            const fullOrdersResponse: APIResponse = await ListOrdersForGraph(token, connectAPIError, language)
            if (fullOrdersResponse.error) {
                setError(fullOrdersResponse.error)
            } else {
                let { months, periodIncomes, periodPackageCount } = getMonthlyIncomeAndPackageCounts(fullOrdersResponse.data)
                setMonths(months)
                setPeriodIncomes(periodIncomes)
                setPeriodPackageCount(periodPackageCount)
                let { days, dailyTransactions, dailyIncome, monthlyPackageCounts } = getDetailedMonthlyStatistics(fullOrdersResponse.data)
                setDays(days)
                setDailyTransactions(dailyTransactions)
                setDailyIncome(dailyIncome)
                setMonthlyPackageCounts(monthlyPackageCounts)
                setPaging(response.pages)
                const responseCsv: APIResponse = await ListOrdersExcel(token, page+1, connectAPIError, language, searchParams)
                setData(responseCsv.data)
            }
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
      <div className="pol-crash-list-page">
          <div className="pol-alert-action">
              <Accordion
                defaultExpanded
              >
                  <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                  >
                      <Typography style={{ fontWeight: 'bold' }}>{t('Income and Transactions')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      <div className="monetization-graphs">
                          <div className="monetization-items-2">
                              <div className="monetization-items">
                                  <label>{t('Number of transactions this month')}</label>
                                  <LineChart
                                      width={600}
                                      height={150}
                                      series={[
                                          { data: dailyTransactions, showMark: false }
                                      ]}
                                      xAxis={[{ scaleType: 'linear', data: days }]}
                                  />
                              </div>
                              <div className="monetization-items">
                                  <label>{t('Daily income this month')}</label>
                                  <LineChart
                                      width={600}
                                      height={150}
                                      series={[
                                          { data: dailyIncome, label: t('nghin VND'), showMark: false }
                                      ]}
                                      xAxis={[{ scaleType: 'linear', data: days }]}
                                  />
                              </div>
                          </div>
                          <div className="monetization-items">
                              <label>{t('Monthly Income')}</label>
                              <LineChart
                                  width={750}
                                  height={300}
                                  series={[
                                      { data: periodIncomes, label: t('nghin VND') }
                                  ]}
                                  xAxis={[{ scaleType: 'point', data: months }]}
                              />
                          </div>
                      </div>
                  </AccordionDetails>
              </Accordion>
          </div>
          <div className="pol-alert-action">
              <Accordion defaultExpanded>
                  <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                  >
                      <Typography style={{ fontWeight: 'bold' }}>{t('Packages Popularity')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      <div className="monetization-graphs">
                          <div className="monetization-items">
                              <label>{t('Package Popularity This Month')}</label>
                              <PieChart
                                  series={[
                                      {
                                          data: [
                                              { id: 0, value: monthlyPackageCounts[0], label: t('STANDARD') },
                                              { id: 1, value: monthlyPackageCounts[1], label: t('GOOD DEAL') },
                                              { id: 2, value: monthlyPackageCounts[2], label: t('BEST DEAL') }
                                          ]
                                      }
                                  ]}
                                  width={300}
                                  height={100}
                                  margin={{
                                      left: -30
                                  }}
                              />
                          </div>
                          <div className="monetization-items">
                              <label>{t('Packages Income This Month')}</label>
                              <PieChart
                                  series={[
                                      {
                                          data: [
                                              { id: 0, value: monthlyPackageCounts[0] * ReportPackages[0].price, label: t('STANDARD') },
                                              { id: 1, value: monthlyPackageCounts[1] * ReportPackages[1].price, label: t('GOOD DEAL') },
                                              { id: 2, value: monthlyPackageCounts[2] * ReportPackages[2].price, label: t('BEST DEAL') }
                                          ]
                                      }
                                  ]}
                                  width={300}
                                  height={100}
                                  margin={{
                                      left: -30
                                  }}
                              />
                          </div>
                          <div className="monetization-items">
                              <label>{t('Package Popularity Over Past 6 Months')}</label>
                              <PieChart
                                  series={[
                                      {
                                          data: [
                                              { id: 0, value: periodPackageCount[0], label: t('STANDARD') },
                                              { id: 1, value: periodPackageCount[1], label: t('GOOD DEAL') },
                                              { id: 2, value: periodPackageCount[2], label: t('BEST DEAL') }
                                          ]
                                      }
                                  ]}
                                  width={300}
                                  height={100}
                                  margin={{
                                      left: -30
                                  }}
                              />
                          </div>
                          <div className="monetization-items">
                              <label>{t('Packages Income Over 6 Months')}</label>
                              <PieChart
                                  series={[
                                      {
                                          data: [
                                              { id: 0, value: periodPackageCount[0] * ReportPackages[0].price, label: t('STANDARD') },
                                              { id: 1, value: periodPackageCount[1] * ReportPackages[1].price, label: t('GOOD DEAL') },
                                              { id: 2, value: periodPackageCount[2] * ReportPackages[2].price, label: t('BEST DEAL') }
                                          ]
                                      }
                                  ]}
                                  width={300}
                                  height={100}
                                  margin={{
                                      left: -30
                                  }}
                              />
                          </div>
                      </div>
                  </AccordionDetails>
              </Accordion>
          </div>
          <div className="pol-alert-action">
              <Accordion defaultExpanded>
                  <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                  >
                      <Typography style={{ fontWeight: 'bold' }}>{t('Packages Details')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      <div className="monetization-graphs">
                          {ReportPackages.map((item, index) => (
                              <div className="monetization-items">
                                  <label>{t(item.type)}</label>
                                  <p>
                                      <strong>{t('Title')}:</strong> {t(item.type)}
                                  </p>
                                  <p>
                                      <strong>{t('Package Price')}:</strong> {item.price} {t('VND')}
                                  </p>
                                  <p>
                                      <strong>{t('Price Per Report')}:</strong> {item.pricePerReport} {t('VND')}
                                  </p>
                              </div>
                          ))}
                      </div>
                  </AccordionDetails>
              </Accordion>
          </div>
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
                              <label>{t('User ID')}</label>
                              <input
                                  type="text"
                                  className="reg-inspec-search-bar"
                                  placeholder={t('Search by User ID')}
                                  value={searchUserId}
                                  onChange={(e) => setSearchUserId(e.target.value)}
                              />
                          </div>
                          <div className="reg-inspec-search-filter-item">
                              <label>{t('Transaction ID')}</label>
                              <input
                                  type="text"
                                  className="reg-inspec-search-bar"
                                  placeholder={t('Search by Transaction ID')}
                                  value={searchTransactionId}
                                  onChange={(e) => setSearchTransactionId(e.target.value)}
                              />
                          </div>
                          <div className="reg-inspec-search-filter-item">
                              <label>{t('Order Option')}</label>
                              <select className="reg-inspec-search-bar" value={searchOption} onChange={(e) => setSearchOption(e.target.value)}>
                                  <option value=''>{t('All')}</option>
                                  <option value='1'>{t('STANDARD')}</option>
                                  <option value='2'>{t('GOOD DEAL')}</option>
                                  <option value='3'>{t('BEST DEAL')}</option>
                              </select>
                          </div>
                          <div className="reg-inspec-search-filter-item-2">
                              <label>{t('Transaction Date')}</label>
                              <div className="reg-inspec-search-filter-item-2-dates">
                                  <label>{t('From')}: </label>
                                  <input
                                      type="date"
                                      className="reg-inspec-search-bar"
                                      placeholder="Inspection Start Date"
                                      value={searchCreatedDateStart}
                                      onChange={(e) => setSearchCreatedDateStart(e.target.value)}
                                  />
                                  <label>{t('To')}: </label>
                                  <input
                                      type="date"
                                      className="reg-inspec-search-bar"
                                      placeholder="Inspection End Date"
                                      value={searchCreatedDateEnd}
                                      onChange={(e) => setSearchCreatedDateEnd(e.target.value)}
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
                  </AccordionDetails>
              </Accordion>
          </div>
          <div className="plate-search-page-row">
              <div className="plate-alert-page-item">
                  <div className="plate-search-page-item-3">
                      <span style={{ display: 'block', width: '100%', fontWeight: 'bold', fontSize: '30px', textAlign: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', backgroundColor: '#3876BF', color: 'white', paddingBottom:'15px',paddingTop:'15px' }}>
                          {t('Orders List')}
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
                                          <TableCell colSpan={5}>
                                              <div className="pol-crash-spinner"></div>
                                          </TableCell>
                                      </TableRow>
                                  ) : error ? (
                                      <TableRow>
                                          <TableCell colSpan={5}>
                                              {error}
                                              <button onClick={fetchData} className="pol-crash-retry-btn">{t('Retry')}</button>
                                          </TableCell>
                                      </TableRow>
                                  ) : orderList.length > 0 ? orderList
                                      .map((row, index) => {
                                          return (
                                              <TableRow hover role="checkbox" tabIndex={-1} key={row.id + '-' + index} style={{ backgroundColor: index % 2 === 1 ? 'white' : '#E1E1E1' }}>
                                                  {columns.map((column, index) => {
                                                      if (column.id !== 'orderOptionId' && column.id !== 'createdDate' && column.id !== 'userId') {
                                                          let value = row[column.id]
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                  {value}
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'userId') {
                                                          let value = row[column.id];
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                  {value ? value : t('Guest')}
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'orderOptionId') {
                                                          let value = row[column.id];
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                  {getOrderOption(value)}
                                                              </TableCell>
                                                          )
                                                      } else if (column.id === 'createdDate') {
                                                          let value = row[column.id];
                                                          return (
                                                              <TableCell key={column.id + '-' + index} align={column.align} style={{ textAlign: 'left' }}>
                                                                  {formatDate(value)}
                                                              </TableCell>
                                                          )
                                                      }
                                                  })}
                                              </TableRow>
                                          );
                                      }) :
                                      <TableRow>
                                          <TableCell colSpan={5}>
                                                      {t('No Order Found')}
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
          {paging && paging.TotalPages > 0 &&
              <div className="plate-search-page-row">
                  <button className="export-pol-crash-btn" onClick={handleDownloadCsv}>{t('Export to excel')}</button>
                  <a
                      href={`data:text/csv;charset=utf-8,${escape(data)}`}
                      download={`orders-${Date.now()}.csv`}
                      hidden
                      id="excel"
                  />
              </div>
          }
      </div>
  );
}

export default AdminMonetizationPage;