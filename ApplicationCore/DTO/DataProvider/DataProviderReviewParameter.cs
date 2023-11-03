using Application.Common.Models;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.DataProvider
{
    public class DataProviderReviewParameter : PagingParameters
    {
        public int Rating { get; set; } = 0;

        public int SortByDate { get; set; } = 0;
    }
}
