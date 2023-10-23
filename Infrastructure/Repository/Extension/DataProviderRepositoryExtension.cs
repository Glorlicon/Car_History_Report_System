using Application.DTO.DataProvider;
using Application.DTO.Request;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository.Extension
{
    public static class DataProviderRepositoryExtension
    {
        public static IQueryable<DataProvider> Filter(this IQueryable<DataProvider> query, DataProviderParameter parameter)
        {
            if (parameter.Type != null)
                query = query.Where(x => x.Type == parameter.Type);
            return query;
        }

        //public static IQueryable<DataProvider> Sort(this IQueryable<Request> query, DataProviderParameter parameter)
        //{
        //    query = parameter.SortByDate switch
        //    {
        //        1 => query.OrderBy(r => r.CreatedTime),
        //        -1 => query.OrderByDescending(r => r.CreatedTime),
        //        _ => query
        //    };
        //    return query;
        //}
    }
}
