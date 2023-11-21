using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarAccidentHistory
{
    public class CarAccidentHistoryUpdateRequestDTO
    {
        public string? Description { get; set; }

        public string? Location { get; set; }

        public float Serverity { get; set; }

        public AccidentDamageLocation DamageLocation { get; set; }

        public DateOnly AccidentDate { get; set; }

        public string? Note { get; set; }

        public int? Odometer { get; set; }

        public DateOnly? ReportDate { get; set; }
    }
}
