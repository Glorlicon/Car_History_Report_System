using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Order
{
    public class OrderResponseDTO
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public int OrderOptionId { get; set; }
        public string? TransactionId { get; set; }
        public DateOnly PurchaseDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastModified { get; set; }
        public OrderOptionResponseDTO OrderOption { get; set; }
    }
}
