using Application.DTO.DataProvider;
using Application.DTO.Notification;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository.Extension
{
    public static class UserNotificationRepositoryExtension
    {
        public static IQueryable<UserNotification> Filter(this IQueryable<UserNotification> query, UserNotificationParameter parameter)
        {
            if (parameter.Type != null)
                query = query.Where(x => x.Notification.Type == parameter.Type);
            return query;
        }

        public static IQueryable<UserNotification> Sort(this IQueryable<UserNotification> query, UserNotificationParameter parameter)
        {
            return query;
        }
    }
}
