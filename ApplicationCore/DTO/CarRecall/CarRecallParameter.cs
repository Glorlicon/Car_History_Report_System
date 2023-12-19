using Application.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarRecall
{
    public class CarRecallParameter : PagingParameters
    {
        public string? ModelId { get; set; }
        public DateOnly? RecallDateStart { get; set; }
        public DateOnly? RecallDateEnd { get; set; }
    }
}
