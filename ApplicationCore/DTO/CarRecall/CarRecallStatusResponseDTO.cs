using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarRecall
{
    public class CarRecallStatusResponseDTO
    {
        public string CarId { get; set; }
        public int CarRecallId { get; set; }

        public string ModelId { get; set; }

        public string Description { get; set; }

        public DateOnly? RecallDate { get; set; }

        public string Status { get; set; }
    }
}
