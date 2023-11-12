using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Notification
{
    public class UserNotificationCreateRequestDTO
    {
        public string UserId { get; set; }
        public int NotificationId { get; set; }
        public bool IsRead { get; set; } = false;
    }
}
