using Application.Common.Models;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.ModelMaintainance
{
    public class ModelMaintainanceParameter : PagingParameters
    {
        public string? MaintainancePart { get; set; }
        public int SortByOdometer {  get; set; } = 0;
        public int SortByTime { get; set; } = 0;
    }
}
