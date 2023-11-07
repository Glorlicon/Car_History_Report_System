using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarTracking
    {
        public string CarId { get; set; }
        public Car Car { get; set; } = null!;
        public string UserId { get; set; }
        public User User { get; set; } = null!;
        public bool IsFollowing { get; set; } = true;
        public DateTime CreatedTime { get; set; }
    }
}
