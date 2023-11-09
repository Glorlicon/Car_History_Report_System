using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Order
{
    public class OrderCreateRequestDTO
    {
        public string? UserId { get; set; }
        public string TransactionId { get; set; }
        public int OrderOptionId { get; set; }
        public string? CarId { get; set; }
    }
}
