using Application.Common.Models;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Notification
{
    public class UserNotificationParameter : PagingParameters
    {
        public NotificationType? Type { get; set; }
        public int? SortByTime { get; set; }
        public int? SortByRead { get; set; }
    }
}
