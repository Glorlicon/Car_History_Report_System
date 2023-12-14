using Application.DTO.CarAccidentHistory;
using Application.DTO.CarInspectionHistory;
using Application.DTO.CarInsurance;
using Application.DTO.CarOwnerHistory;
using Application.DTO.CarRecall;
using Application.DTO.CarReport;
using Application.DTO.CarServiceHistory;
using Application.DTO.CarStolenHistory;
using Application.DTO.Order;
using Application.Interfaces;
using AutoMapper;
using Domain.Common;
using Domain.Enum;
using Domain.Entities;
using Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using Application.DTO.CarRegistrationHistory;

namespace Application.DomainServices
{
    public class CarReportServices : ICarReportServices
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserServices _currentUserServices;
        private readonly IMapper _mapper;

        public CarReportServices(IUnitOfWork unitOfWork, ICurrentUserServices currentUserServices, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _currentUserServices = currentUserServices;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CarReportResponseDTO>> GetAllCarReports()
        {
            var carReports = await _unitOfWork.CarReportRepository.GetAll(trackChange: false);
            var carReportsResponse = _mapper.Map<List<CarReportResponseDTO>>(carReports);
            return carReportsResponse;
        }

        public async Task<CarReportResponseDTO> GetCarReportById(string carId, string userId, DateOnly date)
        {
            var carReport = await _unitOfWork.CarReportRepository.GetById(carId,userId, date, trackChange: false);
            if (carReport is null)
            {
                throw new CarReportNotFoundException(carId, userId);
            }
            var carReportResponse = _mapper.Map<CarReportResponseDTO>(carReport);
            return carReportResponse;
        }

        public async Task<CarReportDataResponseDTO> GetCarReportDataByCarId(string carId, DateOnly date)
        {
            // get car data
            var carReportData = await _unitOfWork.CarRepository.GetCarReportDataById(carId, trackChange: false);
            if(carReportData is null)
            {
                throw new CarNotFoundException(carId);
            }
            // get user that get car report
            var currentUserId = _currentUserServices.GetCurrentUserId();
            // check if user can access the report
            await CheckAccessReport(carId, currentUserId, date, carReportData);

            // turn car data to car history details for report
            var carHistoryDetails = GetCarHistoryDetails(carReportData, date);

            // get response
            var carReportDataResponse = _mapper.Map<CarReportDataResponseDTO>(carReportData);
            carReportDataResponse.CarHistoryDetails = carHistoryDetails;
            return carReportDataResponse;
        }

        public async Task<IEnumerable<CarReportResponseDTO>> GetCarReportsByUserId(string userId)
        {
            var carReports = await _unitOfWork.CarReportRepository.GetByUserId(userId, trackChange: false);
            var carReportsResponse = _mapper.Map<List<CarReportResponseDTO>>(carReports);
            return carReportsResponse;
        }

        public async Task<bool> IsCarReportExist(string carId, string userId)
        {
            return await _unitOfWork.CarReportRepository.IsExist(x => x.CarId == carId && x.UserId == userId);
        }

        public async Task AddCarReportToUserCarReportList(CarReportCreateRequestDTO request)
        {
            var isCarExist = await _unitOfWork.CarRepository.IsExist(x => x.VinId == request.CarId);
            if (!isCarExist)
            {
                throw new CarNotFoundException(request.CarId);
            }
            var user = await _unitOfWork.UserRepository.GetUserByUserId(request.UserId, trackChanges: true);
            if(user is null)
            {
                throw new UserNotFoundException(request.UserId);
            }
            if(user.MaxReportNumber <= 0)
            {
                throw new NotEnoughReportException();
            }
            user.MaxReportNumber--;
            _unitOfWork.CarReportRepository.Create(new CarReport
            {
                CarId = request.CarId,
                UserId = request.UserId,
                CreatedDate = DateOnly.FromDateTime(DateTime.Now)
            });
            await _unitOfWork.SaveAsync();
        }

        private void AddGeneralCarHistories(List<GeneralCarHistoryResponseDTO> generalCarHistories, List<CarHistory> carHistory, string type)
        {
            generalCarHistories.AddRange(carHistory.Select(x => new GeneralCarHistoryResponseDTO
            {
                Note= x.Note,
                Odometer= x.Odometer,
                ReportDate= x.ReportDate,
                HistoryType = type,
                Source = x.CreatedByUser.DataProvider is null ? "System User" : x.CreatedByUser.DataProvider.Name
            }));
        }

        private List<CarReportCarHistoryDetails> GetCarHistoryDetails(Car carReportData, DateOnly date)
        {
            var carHistoryDetails = new List<CarReportCarHistoryDetails>();
            List<(DateOnly StartDate, DateOnly EndDate, CarOwnerHistory CarOwner)> carHistoryTimelines = GetCarHistoryTimeLines(carReportData, date);
            foreach (var timePeriod in carHistoryTimelines)
            {
                var startDate = timePeriod.StartDate;
                var endDate = timePeriod.EndDate;
                var carServiceHistories = carReportData.CarServiceHistories
                                            .Where(x => x.ReportDate >= startDate
                                                    && x.ReportDate <= endDate)
                                            .OrderByDescending(x => x.ReportDate);
                var carAccidentHistories = carReportData.CarAccidentHistories
                                            .Where(x => x.ReportDate >= startDate
                                                    && x.ReportDate <= endDate)
                                            .OrderByDescending(x => x.ReportDate);
                var carInspectionHistories = carReportData.CarInspectionHistories
                                            .Where(x => x.ReportDate >= startDate
                                                    && x.ReportDate <= endDate)
                                            .OrderByDescending(x => x.ReportDate);
                var carInsurances = carReportData.CarInsurances
                                            .Where(x => x.ReportDate >= startDate
                                                    && x.ReportDate <= endDate)
                                            .OrderByDescending(x => x.ReportDate);
                var carStolenHistories = carReportData.CarStolenHistories
                                            .Where(x => x.ReportDate >= startDate
                                                    && x.ReportDate <= endDate)
                                            .OrderByDescending(x => x.ReportDate);
                var carRegistrationHistories = carReportData.CarRegistrationHistories
                                            .Where(x => x.ReportDate >= startDate
                                                    && x.ReportDate <= endDate)
                                            .OrderByDescending(x => x.ReportDate);
                var generalCarHistories = new List<GeneralCarHistoryResponseDTO>();
                AddGeneralCarHistories(generalCarHistories, carServiceHistories.Cast<CarHistory>().ToList(), "Car Service History");
                AddGeneralCarHistories(generalCarHistories, carAccidentHistories.Cast<CarHistory>().ToList(), "Car Accident History");
                AddGeneralCarHistories(generalCarHistories, carInspectionHistories.Cast<CarHistory>().ToList(), "Car Inspection History");
                AddGeneralCarHistories(generalCarHistories, carInsurances.Cast<CarHistory>().ToList(), "Car Insurance History");
                AddGeneralCarHistories(generalCarHistories, carStolenHistories.Cast<CarHistory>().ToList(), "Car Stolen History");
                AddGeneralCarHistories(generalCarHistories, carRegistrationHistories.Cast<CarHistory>().ToList(), "Car Registration History");
                generalCarHistories = generalCarHistories.OrderByDescending(x => x.ReportDate).ToList();

                if (generalCarHistories.Count == 0 && timePeriod.CarOwner == null) continue;

                var carHistoryDetail = new CarReportCarHistoryDetails
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    CarOwner = _mapper.Map<CarOwnerHistoryResponseDTO>(timePeriod.CarOwner),
                    CarServiceHistories = _mapper.Map<List<CarServiceHistoryResponseDTO>>(carServiceHistories),
                    CarAccidentHistories = _mapper.Map<List<CarAccidentHistoryResponseDTO>>(carAccidentHistories),
                    CarInspectionHistories = _mapper.Map<List<CarInspectionHistoryResponseDTO>>(carInspectionHistories),
                    CarInsurances = _mapper.Map<List<CarInsuranceHistoryResponseDTO>>(carInsurances),
                    CarStolenHistories = _mapper.Map<List<CarStolenHistoryResponseDTO>>(carStolenHistories),
                    CarRegistrationHistories = _mapper.Map<List<CarRegistrationHistoryResponseDTO>>(carRegistrationHistories),
                    GeneralCarHistories = generalCarHistories
                };
                carHistoryDetails.Add(carHistoryDetail);
            }
            return carHistoryDetails;
        }

        private List<(DateOnly, DateOnly, CarOwnerHistory)> GetCarHistoryTimeLines(Car carReportData, DateOnly date)
        {
            List<(DateOnly, DateOnly, CarOwnerHistory)> carHistoryTimelines = new List<(DateOnly, DateOnly, CarOwnerHistory)>();
            var beginDate = carReportData.Model.ReleasedDate;
            DateOnly curStartDate = date;
            carReportData.CarOwnerHistories = carReportData.CarOwnerHistories.Where(x => x.StartDate <= date)
                                                                             .OrderByDescending(x => x.StartDate)
                                                                             .ToList();
            foreach (var carOwner in carReportData.CarOwnerHistories)
            {
                var startDate = carOwner.StartDate is null ? beginDate : carOwner.StartDate;
                var endDate = (carOwner.EndDate is null || carOwner.EndDate > date) ? date : carOwner.EndDate;
                var dateBetween = curStartDate.DayNumber - endDate.Value.DayNumber;
                if (dateBetween > 1)
                {
                    if(curStartDate != date)
                        carHistoryTimelines.Add((endDate.Value.AddDays(1), curStartDate.AddDays(-1), null));
                    else
                        carHistoryTimelines.Add((endDate.Value.AddDays(1), curStartDate, null));
                }
                carHistoryTimelines.Add((startDate.Value, endDate.Value, carOwner));
                curStartDate = startDate.Value;
            }
            if (curStartDate != beginDate)
                carHistoryTimelines.Add((beginDate, curStartDate, null));
            return carHistoryTimelines;
        }

        private async Task CheckAccessReport(string carId, string currentUserId, DateOnly date, Car carReportData)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUserId(currentUserId, trackChanges: true);
            // check if user can access the report
            if (currentUserId != null)
            {
                if (user is null)
                {
                    throw new UserNotFoundException(currentUserId);
                }

                switch (user.Role)
                {
                    case Role.Manufacturer:
                        if (carReportData.Model.ManufacturerId != user.DataProviderId)
                        {
                            throw new CarReportAccessUnauthorized(carId);
                        }
                        break;
                    case Role.User:
                        var carReport = await _unitOfWork.CarReportRepository.GetById(carId, currentUserId, date, false);
                        if (carReport is null)
                        {
                            if (user.MaxReportNumber <= 0)
                            {
                                throw new NotEnoughReportException();
                            }
                            else
                            {
                                throw new CarReportNotFoundException(carId, currentUserId);
                            }
                        }
                        break;
                    case Role.InsuranceCompany:
                        if (!carReportData.CarInsurances.Any(x => x.CreatedByUserId == user.Id))
                        {
                            throw new CarReportAccessUnauthorized(carId);
                        }
                        break;
                    case Role.CarDealer:
                    case Role.ServiceShop:
                        throw new CarReportAccessUnauthorized(carId);
                        break;
                    default:
                        break;
                }
            }
        }
    }
}
