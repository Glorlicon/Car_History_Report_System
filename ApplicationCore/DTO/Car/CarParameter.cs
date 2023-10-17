using Application.Common.Models;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Car
{
    public class CarParameter : PagingParameters
    {
        public string? Make { get; set; }
        public string? Model { get; set; }
        public int YearStart { get; set; } = 0;

        public int YearEnd { get; set; } = 3000;

        public decimal PriceMin { get; set; } = 0;
        public decimal PriceMax { get; set; } = 99999999999;

        public int MileageMin { get; set; } = 0;
        public int MileageMax { get; set; } = int.MaxValue;
        public BodyType? BodyType { get; set; }

        public int SortByPrice { get; set; } = 0;
        public int SortByDate { get; set; } = 0;
        public int SortByMileage { get; set; } = 0;

    }
}
