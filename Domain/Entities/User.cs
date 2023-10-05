using Domain.Enum;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? Address { get; set; }

        public int? DataProviderId { get; set; }

        public DataProvider? DataProvider { get; set; }

        public int MaxReportNumber { get; set; } = 0;

        public Role Role { get; set; }

        public ICollection<CarMaintainance> CarMaintainances { get; set; } = new List<CarMaintainance>();

        public ICollection<CarReport> CarReports { get; set; } = new List<CarReport>();

    }
}
