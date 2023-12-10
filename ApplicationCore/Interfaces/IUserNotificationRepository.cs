using Application.DTO.Notification;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IUserNotificationRepository : IBaseRepository<UserNotification>
    {
        Task<IEnumerable<UserNotification>> GetAllUserNotifications(UserNotificationParameter parameter, bool trackChange);
        Task<IEnumerable<UserNotification>> GetUserNotificationsByUserId(string userId, UserNotificationParameter parameter, bool trackChange);
        Task<UserNotification> GetUserNotification(string userId, int notificationId, bool trackChange);
        Task<int> CountByCondition(Expression<Func<UserNotification, bool>> expression, UserNotificationParameter parameter);
    }
}
