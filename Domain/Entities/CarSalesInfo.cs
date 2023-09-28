using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarSalesInfo
    {
        public int Id { get; set; }

        public int CarId { get; set; }

        public Car Car { get; set; }

        public Guid UserId { get; set; }

        public User User { get; set; }

        public string Description { get; set; }

        public ICollection<CarSalesFeature> Features {  get; set; }

        public decimal Price { get; set; }
    }
}
