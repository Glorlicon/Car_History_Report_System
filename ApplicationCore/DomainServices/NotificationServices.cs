using Application.Common.Models;
using Application.DTO.Car;
using Application.DTO.CarTracking;
using Application.DTO.Notification;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enum;
using Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace Application.DomainServices
{
    public class NotificationServices : INotificationServices
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public NotificationServices(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedList<NotificationResponseDTO>> GetAllNotifications(NotificationParameter parameter)
        {
            var notifications = await _unitOfWork.NotificationRepository.GetAllNotifications(parameter, false);
            var notificationsResponse = _mapper.Map<List<NotificationResponseDTO>>(notifications);
            var count = await _unitOfWork.NotificationRepository.CountAll();
            return new PagedList<NotificationResponseDTO>(notificationsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<NotificationResponseDTO> GetNotification(int id)
        {
            var notification = await _unitOfWork.NotificationRepository.GetNotification(id, trackChange: false);
            if (notification is null)
            {
                throw new NotificationNotFoundException(id);
            }
            var notificationResponse = _mapper.Map<NotificationResponseDTO>(notification);
            return notificationResponse;
        }

        public async Task CreateNotification(NotificationCreateRequestDTO request)
        {
            var userIdsList = await GetUserListToSendNotification(request);
            if(userIdsList is null || !userIdsList.Any())
            {
                return;
            }
            var notification = _mapper.Map<Notification>(request);
            _unitOfWork.NotificationRepository.Create(notification);
            foreach(var userId in userIdsList)
            {
                _unitOfWork.UserNotificationRepository.Create(new UserNotification
                {
                    UserId = userId,
                    Notification = notification
                });
            }
            await _unitOfWork.SaveAsync();
        }

        private async Task<IEnumerable<string>> GetUserListToSendNotification(NotificationCreateRequestDTO request)
        {
            IEnumerable<string> userIdsList = request.Type switch
            {
                NotificationType.CarRecall => await _unitOfWork.CarMaintainanceRepository.GetUserIdsTrackingModelId(request.ModelId, trackChange: false),
                NotificationType.RequestInfoUpdate => new List<string> { request.RelatedUserId },
                NotificationType.Request => await _unitOfWork.UserRepository.GetAdminUserIds(),
                NotificationType.PoliceAlert => await _unitOfWork.CarTrackingRepository.GetUserIdsTrackingCarId(request.RelatedCarId, trackChange: false),
                NotificationType.SystemInformation => (await _unitOfWork.UserRepository.GetAll(false)).Select(x => x.Id).ToList(),
                NotificationType.InsuranceAlert => await _unitOfWork.CarInsuranceRepository.GetCarInsuranceUserIdsByCarId(request.RelatedCarId),
                _ => new List<string> { request.RelatedUserId }
            };
            return userIdsList;
        }

        public async Task DeleteNotification(int id)
        {
            var notification = await _unitOfWork.NotificationRepository.GetNotification(id, trackChange: false);
            if (notification is null)
            {
                throw new NotificationNotFoundException(id);
            }
            _unitOfWork.NotificationRepository.Delete(notification);
            await _unitOfWork.SaveAsync();
        }

        public async Task<UserNotificationResponseDTO> GetUserNotification(string userId, int notificationId)
        {
            var notification = await _unitOfWork.UserNotificationRepository.GetUserNotification(userId, notificationId, false);
            if(notification is null)
            {
                throw new UserNotificationNotFoundException(userId, notificationId);
            }
            var notificationResponse = _mapper.Map<UserNotificationResponseDTO>(notification);
            return notificationResponse;
        }

        public async Task<PagedList<UserNotificationResponseDTO>> GetUserNotifications(string userId, UserNotificationParameter parameter)
        {
            var notifications = await _unitOfWork.UserNotificationRepository.GetUserNotificationsByUserId(userId, parameter, false);
            var notificationsResponse = _mapper.Map<List<UserNotificationResponseDTO>>(notifications);
            var count = await _unitOfWork.UserNotificationRepository.CountByCondition(x => x.UserId == userId , parameter);
            return new PagedList<UserNotificationResponseDTO>(notificationsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task ReadUserNotification(string userId, int notificationId)
        {
            var notification = await _unitOfWork.UserNotificationRepository.GetUserNotification(userId, notificationId, trackChange: true);
            if (notification is null)
            {
                throw new UserNotificationNotFoundException(userId, notificationId);
            }
            notification.IsRead = true;
            await _unitOfWork.SaveAsync();
        }

        public async Task<PagedList<CarTrackingResponseDTO>> GetCarTrackedList(string userId, CarTrackingParameter parameter)
        {
            var carTrackingList = await _unitOfWork.CarTrackingRepository.GetCarTrackingsByUserId(userId, parameter, false);
            var carTrackingListResponse = _mapper.Map<List<CarTrackingResponseDTO>>(carTrackingList);
            var count = await _unitOfWork.CarTrackingRepository.CountByCondition(x => x.UserId == userId);
            return new PagedList<CarTrackingResponseDTO>(carTrackingListResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task StopTrackingCar(string userId, string carId)
        {
            var carTracking = await _unitOfWork.CarTrackingRepository.GetCarTracking(userId, carId, trackChange: true);
            if (carTracking is null)
            {
                throw new CarTrackingNotFoundException(userId, carId);
            }
            carTracking.IsFollowing = false;
            await _unitOfWork.SaveAsync();
        }

        public async Task TrackCar(string userId, string carId)
        {
            var carTracking = await _unitOfWork.CarTrackingRepository.GetCarTracking(userId, carId, trackChange: true);
            if(carTracking is not null)
            {
                if (carTracking.IsFollowing)
                {
                    throw new CarAlreadyTrackedException(userId, carId);
                }
                carTracking.IsFollowing = true;
            }
            else
            {
                _unitOfWork.CarTrackingRepository.Create(new CarTracking
                {
                    CarId = carId,
                    UserId = userId,
                    CreatedTime = DateTime.Now,
                    IsFollowing = true
                });
            }
            await _unitOfWork.SaveAsync();
        }
    }
}
