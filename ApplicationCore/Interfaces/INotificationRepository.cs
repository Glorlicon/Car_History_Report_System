using Application.Common.Models;
using Application.DTO.Notification;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface INotificationRepository : IBaseRepository<Notification>
    {
        Task<IEnumerable<Notification>> GetAllNotifications(NotificationParameter parameter, bool trackChange);

        Task<Notification> GetNotification(int id, bool trackChange);
    }
}
