using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Notification
{
    public class UserNotificationResponseDTO
    {
        public string UserId { get; set; }
        public int NotificationId { get; set; }
        public NotificationResponseDTO Notification { get; set; }
        public bool IsRead { get; set; }
    }
}
