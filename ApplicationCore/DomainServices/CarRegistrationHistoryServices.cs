using Application.DTO.CarRegistrationHistory;
using Application.DTO.Notification;
using Application.Interfaces;
using Application.Utility;
using AutoMapper;
using Domain.Entities;
using Domain.Enum;
using Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DomainServices
{
    public class CarRegistrationHistoryServices : CarHistoryServices<Domain.Entities.CarRegistrationHistory,
                                                                            CarRegistrationHistoryResponseDTO,
                                                                            CarRegistrationHistoryParameter,
                                                                            CarRegistrationHistoryCreateRequestDTO,
                                                                            CarRegistrationHistoryUpdateRequestDTO>
    {
        private readonly ICarHistoryRepository<Domain.Entities.CarRegistrationHistory, CarRegistrationHistoryParameter> _carHistoryRepository;
        private readonly ICarRepository _carRepository;
        private readonly INotificationServices _notificationServices;
        private readonly IMapper _mapper;
        private readonly IAuthenticationServices _authenticationServices;
        private readonly IUnitOfWork _unitOfWork;

        public CarRegistrationHistoryServices(ICarHistoryRepository<Domain.Entities.CarRegistrationHistory, CarRegistrationHistoryParameter> carHistoryRepository, IMapper mapper, ICarRepository carRepository, INotificationServices notificationServices, IAuthenticationServices authenticationServices, IUnitOfWork unitOfWork)
            : base(carHistoryRepository, mapper, carRepository, notificationServices, authenticationServices, unitOfWork)
        {
            _carHistoryRepository = carHistoryRepository;
            _mapper = mapper;
            _carRepository = carRepository;
            _notificationServices = notificationServices;
            _authenticationServices = authenticationServices;
            _unitOfWork = unitOfWork;
        }

        public override async Task<int> CreateCarHistory(CarRegistrationHistoryCreateRequestDTO request)
        {
            request.LicensePlateNumber = request.LicensePlateNumber.Replace(".",string.Empty); 
            var carHistory = _mapper.Map<CarRegistrationHistory>(request);
            carHistory.ReportDate ??= DateOnly.FromDateTime(DateTime.Now);
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
            if (request.ExpireDate > DateOnly.FromDateTime(DateTime.Today))
                car.LicensePlateNumber = request.LicensePlateNumber;
            _carHistoryRepository.Create(carHistory);
            await _carHistoryRepository.SaveAsync();
            // Send Notification to police
            var policeAlertNotification = new NotificationCreateRequestDTO
            {
                Title = $"New Car History of car {carHistory.CarId} has beed added",
                RelatedCarId = carHistory.CarId,
                Description = $"Car {carHistory.CarId} have beed added new {typeof(CarRegistrationHistory).Name}",
                RelatedLink = $"/{carHistory.CarId}",
                Type = NotificationType.PoliceAlert
            };
            await _notificationServices.CreateNotification(policeAlertNotification);
            //
            return carHistory.Id;
        }

        public override async Task UpdateCarHistory(int id, CarRegistrationHistoryUpdateRequestDTO request)
        {
            request.LicensePlateNumber = request.LicensePlateNumber.Replace(".", string.Empty);
            var carHistory = await _carHistoryRepository.GetCarHistoryById(id, trackChange: true);
            if (carHistory is null)
            {
                throw new CarHistoryRecordNotFoundException(id, typeof(CarRegistrationHistory).Name);
            }
            var odometerBefore = carHistory.Odometer;
            _mapper.Map(request, carHistory);
            var car = await _carRepository.GetCarWithHistoriesById(carHistory.CarId, trackChange: true);
            if(request.ExpireDate > DateOnly.FromDateTime(DateTime.Today))
                car.LicensePlateNumber = request.LicensePlateNumber;
            await _carHistoryRepository.SaveAsync();
            if (carHistory.Odometer is not null && odometerBefore != carHistory.Odometer)
            {
                car.CurrentOdometer = Math.Max(carHistory.Odometer.Value, CarUtility.GetMaxCarOdometer(car));
                await _carRepository.SaveAsync();
            }
        }

        public override async Task<IEnumerable<int>> CreateCarHistoryCollection(IEnumerable<CarRegistrationHistoryCreateRequestDTO> requests)
        {
            if (requests is null)
            {
                throw new NullCollectionException();
            }
            var carHistorys = _mapper.Map<IEnumerable<CarRegistrationHistory>>(requests);
            foreach (var carHistory in carHistorys)
            {
                carHistory.LicensePlateNumber = carHistory.LicensePlateNumber.Replace(".", string.Empty);
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
                if (carHistory.ExpireDate > DateOnly.FromDateTime(DateTime.Today))
                    car.LicensePlateNumber = carHistory.LicensePlateNumber;
                _carHistoryRepository.Create(carHistory);
            }
            await _carHistoryRepository.SaveAsync();
            return carHistorys.Select(x => x.Id).ToList();
        }
    }
}
