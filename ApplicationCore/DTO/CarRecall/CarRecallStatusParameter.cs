using Application.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarRecall
{
    public class CarRecallStatusParameter : PagingParameters
    {
        public string? Status { get; set; } 
    }
}
