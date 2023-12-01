using Application.Common.Models;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarStolenHistory
{
    public class CarStolenHistoryParameter : PagingParameters
    {
        public string? VinId { get; set; }

        public CarStolenStatus? Status { get; set; }

        public int SortByStatus { get; set; } = 1;

        public int SortByLastModified { get; set; } = 0;

    }
}
