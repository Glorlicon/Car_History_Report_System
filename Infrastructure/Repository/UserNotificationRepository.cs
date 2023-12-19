using Application.DTO.Notification;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.DBContext;
using Infrastructure.Repository.Extension;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class UserNotificationRepository : BaseRepository<UserNotification>, IUserNotificationRepository
    {
        protected ApplicationDBContext repositoryContext;
        public UserNotificationRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public async Task<int> CountByCondition(Expression<Func<UserNotification, bool>> expression, UserNotificationParameter parameter)
        {
            return await FindByCondition(expression, false)
                            .Filter(parameter)
                            .CountAsync();
        }

        public async Task<IEnumerable<UserNotification>> GetAllUserNotifications(UserNotificationParameter parameter, bool trackChange)
        {
            return await FindAll(trackChange)
                            .Include(x => x.Notification)
                            .OrderBy(x => x.IsRead)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<UserNotification> GetUserNotification(string userId, int notificationId, bool trackChange)
        {
            return await FindByCondition(x => x.UserId == userId && x.NotificationId == notificationId, trackChange)
                            .Include(x => x.Notification)
                            .OrderBy(x => x.IsRead)
                            .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<UserNotification>> GetUserNotificationsByUserId(string userId, UserNotificationParameter parameter, bool trackChange)
        {
            return await FindByCondition(x => x.UserId == userId,trackChange)
                            .Include(x => x.Notification)
                            .Filter(parameter)
                            .OrderBy(x => x.IsRead)
                            .ThenBy(x => x.Notification.CreatedTime)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }
    }
}
