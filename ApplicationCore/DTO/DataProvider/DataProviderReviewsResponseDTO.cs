using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.DataProvider
{
    public class DataProviderReviewsResponseDTO
    {
        public string UserId {  get; set; }
        public string? Description {  get; set; }

        public int Rating { get; set; }

        public DateTime CreatedTime { get; set; }
    }
}
