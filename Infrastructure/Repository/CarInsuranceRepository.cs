using Application.DTO.CarInspectionHistory;
using Application.DTO.CarInsurance;
using Domain.Entities;
using Infrastructure.DBContext;
using Infrastructure.Repository.Extension;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class CarInsuranceRepository : CarHistoryRepository<CarInsurance, CarInsuranceHistoryParameter>, ICarInsuranceRepository
    {
        protected ApplicationDBContext repositoryContext;
        public CarInsuranceRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public override async Task<IEnumerable<CarInsurance>> GetAllCarHistorys(CarInsuranceHistoryParameter parameter, bool trackChange)
        {
            var query = FindAll(trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public override async Task<CarInsurance> GetCarHistoryById(int id, bool trackChange)
        {
            var query = FindByCondition(x => x.Id == id, trackChange);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .SingleOrDefaultAsync();
        }

        public override async Task<IEnumerable<CarInsurance>> GetCarHistorysByCarId(string vinId, CarInsuranceHistoryParameter parameter, bool trackChange)
        {
            var query = FindByCondition(x => x.CarId == vinId, trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public override async Task<IEnumerable<CarInsurance>> GetCarHistorysByUserId(string userId, CarInsuranceHistoryParameter parameter, bool trackChange)
        {
            var query = FindByCondition(x => x.CreatedByUserId == userId, trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public override async Task<IEnumerable<CarInsurance>> GetCarHistorysByOwnCompany(List<string> carIds, CarInsuranceHistoryParameter parameter, bool trackChange)
        {
            var query = FindByCondition(x => carIds.Contains(x.CarId), trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public override async Task<IEnumerable<CarInsurance>> GetCarHistorysByDataProviderId(int dataProviderId, CarInsuranceHistoryParameter parameter, bool trackChange)
        {
            var query = FindByCondition(x => x.CreatedByUser.DataProviderId == dataProviderId, trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public async Task<List<string>> InsuranceCompanyGetOwnCarIds(int? dataProviderId, bool trackChange)
        {
            var query = FindByCondition(x => x.CreatedByUser.DataProviderId == dataProviderId, trackChange);
            return await query.Select(x => x.CarId).ToListAsync();
        }

        public override IQueryable<CarInsurance> Filter(IQueryable<CarInsurance> query, CarInsuranceHistoryParameter parameter)
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

        public override IQueryable<CarInsurance> Sort(IQueryable<CarInsurance> query, CarInsuranceHistoryParameter parameter)
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
