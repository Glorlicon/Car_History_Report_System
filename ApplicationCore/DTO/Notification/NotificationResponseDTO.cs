using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Notification
{
    public class NotificationResponseDTO
    {
        public int Id { get; set; }

        public string? RelatedCarId { get; set; }

        public string? RelatedUserId { get; set; }

        public string Title { get; set; }

        public string? Description { get; set; }

        public string? RelatedLink { get; set; }

        public NotificationType Type { get; set; }

        public string? CreatedByUserId { get; set; }
        public string? ModifiedByUserId { get; set; }

        public DateTime CreatedTime { get; set; }

        public DateTime LastModified { get; set; }
    }
}
