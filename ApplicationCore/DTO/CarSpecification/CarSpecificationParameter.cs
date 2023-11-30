using Application.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarSpecification
{
    public class CarSpecificationParameter : PagingParameters
    {
        public string? ModelID { get; set; }
        public string? ManufacturerName { get; set; }
        public DateOnly? ReleasedDateStart { get; set; }
        public DateOnly? ReleasedDateEnd { get; set; }
    }
}
