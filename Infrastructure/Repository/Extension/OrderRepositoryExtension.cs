using Application.DTO.CarSpecification;
using Application.DTO.Order;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository.Extension
{
    public static class OrderRepositoryExtension
    {
        public static IQueryable<Order> Filter(this IQueryable<Order> query, OrderParameter parameter)
        {
            if (parameter.UserId != null)
                query = query.Where(x => x.UserId.Contains(parameter.UserId));
            if (parameter.TransactionId != null)
                query = query.Where(x => x.TransactionId.Contains(parameter.TransactionId));
            if (parameter.OrderOptionId != null)
                query = query.Where(x => x.OrderOptionId == parameter.OrderOptionId);
            if (parameter.CreatedDateStart != null)
                query = query.Where(x => x.CreatedDate >= parameter.CreatedDateStart);
            if (parameter.CreatedDateEnd != null)
                query = query.Where(x => x.CreatedDate <= parameter.CreatedDateEnd);
            return query;
        }
    }
}
