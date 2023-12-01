using Application.Common.Models;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarAccidentHistory
{
    public class CarAccidentHistoryParameter : PagingParameters
    {
        public string? VinId { get; set; }

        public float? Serverity { get; set; }

        public AccidentDamageLocation? DamageLocation { get; set; }

        public DateOnly? AccidentStartDate { get; set; }
        public DateOnly? AccidentEndDate { get; set; }

        public int SortByServerity { get; set; } = 0;

        public int SortByAccidentDate { get; set; } = 0;

        public int SortByLastModified { get; set; } = 0;
    }
}
