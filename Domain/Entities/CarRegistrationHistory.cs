using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarRegistrationHistory : CarHistory
    {
        public string OwnerName { get; set; }
        public string RegistrationNumber { get; set; }

        public DateOnly ExpireDate { get; set; }

        public string LicensePlateNumber { get; set; }
    }
}
