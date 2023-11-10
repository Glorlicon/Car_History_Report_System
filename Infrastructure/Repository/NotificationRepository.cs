using Application.DTO.Notification;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class NotificationRepository : BaseRepository<Notification>, INotificationRepository
    {
        protected ApplicationDBContext repositoryContext;
        public NotificationRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public async Task<IEnumerable<Notification>> GetAllNotifications(NotificationParameter parameter, bool trackChange)
        {
            return await FindAll(trackChange)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<Notification> GetNotification(int id, bool trackChange)
        {
            return await FindByCondition(c => c.Id == id, trackChange)
                            .SingleOrDefaultAsync();
        }
    }
}
