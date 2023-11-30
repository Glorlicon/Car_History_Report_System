using Application.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarServiceHistory
{
    public class CarServiceHistoryParameter : PagingParameters
    {
        public string? CarId { get; set; }
        public DateTime? ServiceTimeStart { get; set; }
        public DateTime? ServiceTimeEnd { get; set; }
    }
}
