using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Enum;

namespace Domain.Entities
{
    public class Notification : BaseAuditableEntity
    {
        public int Id { get; set; }

        public string? RelatedCarId { get; set; }

        public Car? RelatedCar { get; set; }

        public string? RelatedUserId { get; set; }

        public User? RelatedUser { get; set; }

        public string Title { get; set; }

        public string? Description { get; set; }

        public string? RelatedLink { get; set; }

        public NotificationType Type { get; set; }
    }
}
