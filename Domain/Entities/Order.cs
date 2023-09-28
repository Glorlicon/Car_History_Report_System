using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Order
    {

        [Key]
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public OrderOption OrderOption { get; set; }
        public User User { get; set; }
        public DateOnly PurchaseDate { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
