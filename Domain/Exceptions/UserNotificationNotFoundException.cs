using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class UserNotificationNotFoundException : NotFoundException
    {
        public UserNotificationNotFoundException(string userId, int notificationId)
            : base($"User dont have this notification")
        {

        }
    }
}
