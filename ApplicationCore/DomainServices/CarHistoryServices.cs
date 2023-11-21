using Application.Common.Models;
using Application.DTO.CarOwnerHistory;
using Application.DTO.CarStolenHistory;
using Application.DTO.Notification;
using Application.Interfaces;
using Application.Utility;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Enum;
using Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;

namespace Application.DomainServices
{
    public class CarHistoryServices<T, R, P, C, U> : ICarHistoryServices<R,P,C,U> where T: CarHistory
                                                                                  where P : PagingParameters
    {
        private readonly ICarHistoryRepository<T,P> _carHistoryRepository;
        private readonly ICarRepository _carRepository;
        private readonly INotificationServices _notificationServices;
        private readonly IMapper _mapper;
        private readonly IAuthenticationServices _authenticationServices;
        private readonly IUnitOfWork _unitOfWork;

        public CarHistoryServices(ICarHistoryRepository<T,P> carHistoryRepository, IMapper mapper, ICarRepository carRepository, INotificationServices notificationServices, IAuthenticationServices authenticationServices, IUnitOfWork unitOfWork)
        {
            _carHistoryRepository = carHistoryRepository;
            _mapper = mapper;
            _carRepository = carRepository;
            _notificationServices = notificationServices;
            _authenticationServices = authenticationServices;
            _unitOfWork = unitOfWork;
        }

        public async Task<PagedList<R>> GetAllCarHistorys(P parameter)
        {
            var carHistorys = await _carHistoryRepository.GetAllCarHistorys(parameter, false);
            var carHistorysResponse = _mapper.Map<List<R>>(carHistorys);
            var count = await _carHistoryRepository.CountAllCarHistory(parameter);
            return new PagedList<R>(carHistorysResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<R> GetCarHistory(int id)
        {
            var carHistory = await _carHistoryRepository.GetCarHistoryById(id, trackChange: false);
            if (carHistory is null)
            {
                throw new CarHistoryRecordNotFoundException(id, typeof(T).Name);
            }
            var carHistoryResponse = _mapper.Map<R>(carHistory);
            return carHistoryResponse;
        }

        public async Task<PagedList<R>> GetCarHistoryByCarId(string vinId, P parameter)
        {
            var carHistorys = await _carHistoryRepository.GetCarHistorysByCarId(vinId, parameter, false);
            var carHistorysResponse = _mapper.Map<List<R>>(carHistorys);
            var count = await _carHistoryRepository.CountCarHistoryByCondition(x => x.CarId == vinId,parameter);
            return new PagedList<R>(carHistorysResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<PagedList<R>> GetCarHistoryByUserId(string userId, P parameter)
        {
            var carHistorys = await _carHistoryRepository.GetCarHistorysByUserId(userId, parameter, false);
            var carHistorysResponse = _mapper.Map<List<R>>(carHistorys);
            var count = await _carHistoryRepository.CountCarHistoryByCondition(x => x.CreatedByUserId == userId, parameter);
            return new PagedList<R>(carHistorysResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public virtual async Task<int> CreateCarHistory(C request)
        {
            var carHistory = _mapper.Map<T>(request);
            carHistory.ReportDate ??= DateOnly.FromDateTime(DateTime.Now);
            var car = await _carRepository.GetCarById(carHistory.CarId, trackChange: true);
            if(car is null)
            {
                throw new CarNotFoundException(carHistory.CarId);
            }
            if(carHistory.Odometer is not null)
            {
                if (car.CurrentOdometer < carHistory.Odometer.Value)
                    car.CurrentOdometer = carHistory.Odometer.Value;
            }
            _carHistoryRepository.Create(carHistory);
            await _carHistoryRepository.SaveAsync();
            // Send Notification to police
            var policeAlertNotification = new NotificationCreateRequestDTO
            {
                Title = $"New Car History of car {carHistory.CarId} has beed added",
                RelatedCarId = carHistory.CarId,
                Description = $"Car {carHistory.CarId} have beed added new {typeof(T).Name}",
                RelatedLink = $"/{carHistory.CarId}",
                Type = NotificationType.PoliceAlert
            };
            await _notificationServices.CreateNotification(policeAlertNotification);
            //
            return carHistory.Id;
        }

        public virtual async Task DeleteCarHistory(int id)
        {
            var carHistory = await _carHistoryRepository.GetCarHistoryById(id, trackChange: true);
            if (carHistory is null)
            {
                throw new CarHistoryRecordNotFoundException(id, typeof(T).Name);
            }
            _carHistoryRepository.Delete(carHistory);
            await _carHistoryRepository.SaveAsync();
        }

        public virtual async Task UpdateCarHistory(int id, U request)
        {
            var carHistory = await _carHistoryRepository.GetCarHistoryById(id, trackChange: true);
            if (carHistory is null)
            {
                throw new CarHistoryRecordNotFoundException(id, typeof(T).Name);
            }
            var odometerBefore = carHistory.Odometer;
            _mapper.Map(request, carHistory);
            await _carHistoryRepository.SaveAsync();
            if (carHistory.Odometer is not null && odometerBefore != carHistory.Odometer)
            {
                var car = await _carRepository.GetCarWithHistoriesById(carHistory.CarId, trackChange: true);
                car.CurrentOdometer = Math.Max(carHistory.Odometer.Value, CarUtility.GetMaxCarOdometer(car));
                await _carRepository.SaveAsync();
            }
        }

        public virtual async Task<IEnumerable<int>> CreateCarHistoryCollection(IEnumerable<C> requests)
        {
            if(requests is null)
            {
                throw new NullCollectionException();
            }
            var carHistorys = _mapper.Map<IEnumerable<T>>(requests);
            foreach(var carHistory in carHistorys)
            {
                var car = await _carRepository.GetCarById(carHistory.CarId, trackChange: true);
                if (car is null)
                {
                    throw new CarNotFoundException(carHistory.CarId);
                }
                if (carHistory.Odometer is not null)
                {
                    if (car.CurrentOdometer < carHistory.Odometer.Value)
                        car.CurrentOdometer = carHistory.Odometer.Value;
                }
                _carHistoryRepository.Create(carHistory);
            }
            await _carHistoryRepository.SaveAsync();
            return carHistorys.Select(x => x.Id).ToList();
        }

        public async Task<PagedList<R>> InsuranceCompanyGetOwnCarHistories(P parameter)
        {
            var user = await _authenticationServices.GetCurrentUserAsync();
            if (user.DataProviderId == null)
            {
                throw new UnauthorizedAccessException();
            }
            var carIds = await _unitOfWork.CarInsuranceRepository.InsuranceCompanyGetOwnCarIds(user.DataProviderId, false);
            if (carIds == null)
            {
                throw new CarNotFoundException();
            }
            var carHistorys = await _carHistoryRepository.GetCarHistorysByOwnCompany(carIds, parameter, false);
            var carHistorysResponse = _mapper.Map<List<R>>(carHistorys);
            var count = await _unitOfWork.CarStolenHistoryRepository.CountAll();
            return new PagedList<R>(carHistorysResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }
    }
}
