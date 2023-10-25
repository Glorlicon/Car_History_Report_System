using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarRecall
{
    public class CarRecallUpdateRequestDTO
    {
        public string Description { get; set; }
        public DateOnly RecallDate { get; set; }
    }
}
