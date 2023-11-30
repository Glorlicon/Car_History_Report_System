using Application.DTO.Car;
using Application.DTO.CarRecall;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository.Extension
{
    public static class CarRecallRepositoryExtension
    {
        public static IQueryable<CarRecall> Filter(this IQueryable<CarRecall> query, CarRecallParameter parameter)
        {
            if (parameter.ModelId != null)
                query = query.Where(x => x.ModelId.Contains(parameter.ModelId));
            if (parameter.RecallDateStart != null)
                query = query.Where(x => x.RecallDate >= parameter.RecallDateStart);
            if (parameter.RecallDateEnd != null)
                query = query.Where(x => x.RecallDate <= parameter.RecallDateEnd);
            return query;
        }
    }
}
