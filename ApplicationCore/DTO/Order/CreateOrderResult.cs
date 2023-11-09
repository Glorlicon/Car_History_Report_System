using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Order
{
    public class CreateOrderResult
    {
        public int Id { get; set; }
        public string? Token { get; set; }
    }
}
