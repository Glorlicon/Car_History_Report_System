using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarTracking
{
    public class CarTrackingResponseDTO
    {
        public string CarId { get; set; }
        public string UserId { get; set; }
        public bool IsFollowing { get; set; } = true;
        public DateTime CreatedTime { get; set; }
    }
}
