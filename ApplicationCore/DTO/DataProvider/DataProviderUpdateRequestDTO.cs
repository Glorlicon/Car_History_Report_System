using Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.DataProvider
{
    public class DataProviderUpdateRequestDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string? Address { get; set; }
        public string? WebsiteLink { get; set; }
        public string? Service { get; set; }
        [Phone(ErrorMessage = "Invalid Phone Number")]
        public string? PhoneNumber { get; set; }
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string? Email { get; set; }
        public DataProviderType Type { get; set; }
        public string? ImageLink { get; set; }
        public List<DataProviderWorkingTimesUpdateRequestDTO>? WorkingTimes { get; set; }

    }
}
