using Application.DTO.CarAccidentHistory;
using Application.DTO.CarInsurance;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository.Extension
{
    public static class CarInsuranceRepositoryExtension
    {
        public static IQueryable<CarInsurance> Filter(this IQueryable<CarInsurance> query, CarInsuranceHistoryParameter parameter)
        {
            if (parameter.VinId != null)
            {
                query = query.Where(x => x.CarId.ToLower().Contains(parameter.VinId.ToLower()));
            }
            if (parameter.InsuranceNumber != null)
            {
                query = query.Where(x => x.InsuranceNumber.ToLower().Contains(parameter.InsuranceNumber.ToLower()));
            }
            if (parameter.StartStartDate != null)
            {
                query = query.Where(x => x.StartDate >= parameter.StartStartDate);
            }
            if (parameter.StartEndDate != null)
            {
                query = query.Where(x => x.StartDate <= parameter.StartEndDate);
            }           
            
            if (parameter.EndStartDate != null)
            {
                query = query.Where(x => x.EndDate >= parameter.EndStartDate);
            }
            if (parameter.EndEndDate != null)
            {
                query = query.Where(x => x.EndDate <= parameter.EndEndDate);
            }
            return query;
        }

        public static IQueryable<CarInsurance> Sort(this IQueryable<CarInsurance> query, CarInsuranceHistoryParameter parameter)
        {
            query = parameter.SortByLastModified switch
            {
                1 => query.OrderBy(x => x.LastModified),
                -1 => query.OrderByDescending(x => x.LastModified),
                _ => query
            };
            return query;
        }
    }
}
