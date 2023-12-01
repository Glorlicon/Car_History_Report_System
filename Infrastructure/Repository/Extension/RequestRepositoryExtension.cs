using Application.DTO.Car;
using Application.DTO.Request;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository.Extension
{
    public static class RequestRepositoryExtension
    {
        public static IQueryable<Request> Filter(this IQueryable<Request> query, RequestParameter parameter)
        {
            if (parameter.RequestType != null)
                query = query.Where(x => x.Type == parameter.RequestType);
            if (parameter.RequestStatus != null)
                query = query.Where(x => x.Status == parameter.RequestStatus);
            return query;
        }

        public static IQueryable<Request> Sort(this IQueryable<Request> query, RequestParameter parameter)
        {
            query = parameter.SortByDate switch
            {
                1 => query.OrderBy(r => r.LastModified),
                -1 => query.OrderByDescending(r => r.LastModified),
                _ => query
            };
            return query;
        }
    }
}
