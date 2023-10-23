using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class DataProvider
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string? Address { get; set; }
        public string? WebsiteLink { get; set; }
        public string? Service { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Email { get; set; }

        public string? ImageLink { get; set; }

        public DataProviderType Type { get; set; }

        public ICollection<User> Users { get; set; } = new List<User>();

        public ICollection<WorkingTime> WorkingTimes { get; set; } = new List<WorkingTime>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();

    }
}
