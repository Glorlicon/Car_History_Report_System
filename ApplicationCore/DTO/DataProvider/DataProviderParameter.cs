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
        public string? Service { get; set; }

        public DataProviderType? Type { get; set; }
    }
}
