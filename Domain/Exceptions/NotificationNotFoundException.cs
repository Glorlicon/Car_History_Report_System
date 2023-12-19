using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class NotificationNotFoundException : NotFoundException
    {
        public NotificationNotFoundException(int notificationId)
            : base($"Notification Not Found")
        {

        }
    }
}
