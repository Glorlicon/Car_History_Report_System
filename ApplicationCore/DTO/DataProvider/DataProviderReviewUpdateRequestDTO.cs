using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.DataProvider
{
    public class DataProviderReviewUpdateRequestDTO
    {
        public string? Description { get; set; }

        public int Rating { get; set; }
    }
}
