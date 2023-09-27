using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarPart
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string? Description { get; set; }

        public Guid UserId { get; set; }

        public int ManufacturerId { get; set; }

        public DataProvider Manufacturer { get; set; }

        public User User { get; set; }

        public ICollection<Car> Cars { get; set; } = new List<Car>();
    }
}
