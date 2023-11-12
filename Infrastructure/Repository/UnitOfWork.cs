using Application.DTO.CarServiceHistory;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.DBContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private ApplicationDBContext _repositoryContext;
        private ICarRepository _carRepository;
        private ICarSpecificationRepository _carSpecificationRepository;
        private IUserRepository _userRepository;
        private IDataProviderRepository _dataProviderRepository;
        private ICarSalesInfoRepository _carSalesInfoRepository;
        private ICarPartRepository _carPartRepository;
        private ICarOwnerHistoryRepository _carOwnerHistoryRepository;
        private ICarMaintainanceRepository _carMaintainanceRepository;
        private ICarRecallRepository _carRecallRepository;
        private ICarRecallStatusRepository _carRecallStatusRepository;
        private IOrderRepository _orderRepository;
        private IOrderOptionRepository _orderOptionRepository;
        private ICarReportRepository _carReportRepository;
        private IModelMaintainanceRepository _modelMaintainanceRepository;
        private ICarServiceHistoryRepository _carServiceHistoryRepository;
        private INotificationRepository _notificationRepository;
        private IUserNotificationRepository _userNotificationRepository;
        private ICarTrackingRepository _carTrackingRepository;

        public UnitOfWork(
            ApplicationDBContext repositoryContext,
            ICarRepository carRepository,
            ICarSpecificationRepository carSpecificationRepository,
            IUserRepository userRepository,
            IDataProviderRepository dataProviderRepository,
            ICarSalesInfoRepository carSalesInfoRepository,
            ICarPartRepository carPartRepository,
            ICarOwnerHistoryRepository carOwnerHistoryRepository,
            ICarMaintainanceRepository carMaintainanceRepository,
            ICarRecallRepository carRecallRepository,
            ICarRecallStatusRepository carRecallStatusRepository,
            IOrderRepository orderRepository,
            IOrderOptionRepository orderOptionRepository,
            ICarReportRepository carReportRepository,
            ICarServiceHistoryRepository carServiceHistoryRepository,
            IModelMaintainanceRepository modelMaintainanceRepository,
            INotificationRepository notificationRepository,
            IUserNotificationRepository userNotificationRepository,
            ICarTrackingRepository carTrackingRepository)
        {
            _repositoryContext = repositoryContext;
            _carRepository = carRepository;
            _carSpecificationRepository = carSpecificationRepository;
            _userRepository = userRepository;
            _dataProviderRepository = dataProviderRepository;
            _carSalesInfoRepository = carSalesInfoRepository;
            _carPartRepository = carPartRepository;
            _carOwnerHistoryRepository = carOwnerHistoryRepository;
            _carMaintainanceRepository = carMaintainanceRepository;
            _carRecallRepository = carRecallRepository;
            _carRecallStatusRepository = carRecallStatusRepository;
            _orderRepository = orderRepository;
            _orderOptionRepository = orderOptionRepository;
            _carReportRepository = carReportRepository;
            _carServiceHistoryRepository = carServiceHistoryRepository;
            _modelMaintainanceRepository = modelMaintainanceRepository;
            _notificationRepository = notificationRepository;
            _userNotificationRepository = userNotificationRepository;
            _carTrackingRepository = carTrackingRepository;
        }

        public ICarRepository CarRepository
        {
            get { return _carRepository; }
        }

        public ICarSpecificationRepository CarSpecificationRepository
        {
            get { return _carSpecificationRepository; }
        }

        public IUserRepository UserRepository
        {
            get { return _userRepository; }
        }

        public IDataProviderRepository DataProviderRepository
        {
            get { return _dataProviderRepository; }
        }

        public ICarSalesInfoRepository CarSalesInfoRepository
        {
            get { return _carSalesInfoRepository; }
        }

        public ICarPartRepository CarPartRepository
        {
            get { return _carPartRepository; }
        }

        public ICarOwnerHistoryRepository CarOwnerHistoryRepository
        {
            get { return _carOwnerHistoryRepository; }
        }

        public ICarMaintainanceRepository CarMaintainanceRepository
        {
            get { return _carMaintainanceRepository; }
        }

        public ICarRecallRepository CarRecallRepository
        {
            get { return _carRecallRepository; }
        }

        public ICarRecallStatusRepository CarRecallStatusRepository
        {
            get { return _carRecallStatusRepository; }
        }

        public IOrderRepository OrderRepository
        {
            get { return _orderRepository; }
        }

        public IOrderOptionRepository OrderOptionRepository
        {
            get { return _orderOptionRepository; }
        }

        public ICarReportRepository CarReportRepository
        {
            get { return _carReportRepository; }
        }

        public IModelMaintainanceRepository ModelMaintainanceRepository
        {
            get { return _modelMaintainanceRepository; }
        }

        public ICarServiceHistoryRepository CarServiceHistoryRepository
        {
            get { return _carServiceHistoryRepository; }
        }

        public INotificationRepository NotificationRepository
        {
            get { return _notificationRepository; }
        }

        public IUserNotificationRepository UserNotificationRepository
        {
            get { return _userNotificationRepository; }
        }

        public ICarTrackingRepository CarTrackingRepository
        {
            get { return _carTrackingRepository; }
        }

        public async Task SaveAsync()
        {
            await _repositoryContext.SaveChangesAsync();
        }
    }
}
