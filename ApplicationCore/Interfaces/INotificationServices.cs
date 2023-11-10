using Application.Common.Models;
using Application.DTO.Car;
using Application.DTO.CarOwnerHistory;
using Application.DTO.CarTracking;
using Application.DTO.Notification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface INotificationServices
    {
        Task<PagedList<NotificationResponseDTO>> GetAllNotifications(NotificationParameter parameter);

        Task<NotificationResponseDTO> GetNotification(int id);

        Task CreateNotification(NotificationCreateRequestDTO request);

        Task DeleteNotification(int id);

        Task<PagedList<UserNotificationResponseDTO>> GetUserNotifications(string userId, UserNotificationParameter parameter);

        Task<UserNotificationResponseDTO> GetUserNotification(string userId, int notificationId);

        Task ReadUserNotification(string userId, int notificationId);

        Task<PagedList<CarTrackingResponseDTO>> GetCarTrackedList(string userId,CarTrackingParameter parameter);

        Task TrackCar(string userId, string carId);

        Task StopTrackingCar(string userId, string carId);
    }
}
