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

        public int UserId { get; set; }

        public User User { get; set; }

        public string Description { get; set; }

        /*public string Features {  get; set; } ?? need a feature list */

        public double Price { get; set; }
    }
}
