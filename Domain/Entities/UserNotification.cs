using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class UserNotification
    {
        public string UserId { get; set; }
        public int NotificationId { get; set; }
        public User User { get; set; }
        public Notification Notification { get; set; }

        public bool IsRead { get; set; }
    }
}
