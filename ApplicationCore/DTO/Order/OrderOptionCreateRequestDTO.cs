using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Order
{
    public class OrderOptionCreateRequestDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public decimal Discount { get; set; }
        public DateOnly? DiscountStart { get; set; }
        public DateOnly? DiscountEnd { get; set; }
        public int ReportNumber { get; set; }
    }
}
