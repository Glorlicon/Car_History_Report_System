using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarRecall
    {
        [Key]
        public int ID { get; set; }

        public string ModelId { get; set; }

        public int ManufacturerId { get; set; }

        public CarSpecification Model { get; set; }

        public DataProvider Manufacturer { get; set; }

        public string? Description { get; set; }

        public DateOnly? RecallDate { get; set; }

        public DateTime CreatedTime { get; set; }
   
        public ICollection<CarRecallStatus> CarRecallStatuses { get; set; }
    }
}
