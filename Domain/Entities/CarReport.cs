using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarReport
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public int Discount { get; set; }
        public DateOnly DiscountStart { get; set; }
        public DateOnly DiscountEnd { get; set; }
        public int ReportNumber { get; set; }
        public int TotalAmount { get; set; }
    }
}
