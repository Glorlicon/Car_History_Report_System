using Application.Common.Models;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.DataProvider
{
    public class DataProviderParameter : PagingParameters
    {
        public string? Name { get; set; }
        public DataProviderType? Type { get; set; }
        public string? Email { get; set; }
        public int SortByName { get; set; } = 0;
        public int SortByType { get; set; } = 0;
    }
}
