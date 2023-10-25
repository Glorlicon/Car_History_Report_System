using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarRecall
{
    public class CarRecallCreateRequestDTO
    {
        public string ModelId { get; set; }
        public string Description { get; set; }
        public DateOnly RecallDate { get; set; }
    }
}
