using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarSalesInfo : BaseAuditableEntity
    {
        public int Id { get; set; }

        public string CarId { get; set; }

        public Car Car { get; set; }

        public string Description { get; set; }

        public List<string> Features {  get; set; }

        public decimal Price { get; set; }
    }
}
