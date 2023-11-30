using Application.DTO.CarRecall;
using Application.DTO.CarSpecification;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository.Extension
{
    public static class CarSpecificationRepositoryExtension
    {
        public static IQueryable<CarSpecification> Filter(this IQueryable<CarSpecification> query, CarSpecificationParameter parameter)
        {
            if (parameter.ModelID != null)
                query = query.Where(x => x.ModelID.Contains(parameter.ModelID));
            if (parameter.ManufacturerName != null)
                query = query.Where(x => x.Manufacturer.Name.Contains(parameter.ManufacturerName));
            if (parameter.ReleasedDateStart != null)
                query = query.Where(x => x.ReleasedDate >= parameter.ReleasedDateStart);
            if (parameter.ReleasedDateEnd != null)
                query = query.Where(x => x.ReleasedDate <= parameter.ReleasedDateEnd);

            return query;
        }
    }
}
