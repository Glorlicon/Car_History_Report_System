using Application.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Order
{
    public class OrderParameter : PagingParameters
    {
        public string? UserId { get; set; }
        public int? OrderOptionId { get; set; }
        public string? TransactionId { get; set; }
        public DateTime? CreatedDateStart { get; set; }
        public DateTime? CreatedDateEnd { get; set; }
    }
}
