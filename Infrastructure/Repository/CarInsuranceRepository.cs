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
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Filter(parameter)
                              .Sort(parameter)
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
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Filter(parameter)
                              .Sort(parameter)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public override async Task<IEnumerable<CarInsurance>> GetCarHistorysByUserId(string userId, CarInsuranceHistoryParameter parameter, bool trackChange)
        {
            var query = FindByCondition(x => x.CreatedByUserId == userId, trackChange);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Filter(parameter)
                              .Sort(parameter)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public override async Task<IEnumerable<CarInsurance>> GetCarHistorysByOwnCompany(List<string> carIds, CarInsuranceHistoryParameter parameter, bool trackChange)
        {
            var query = FindByCondition(x => carIds.Contains(x.CarId), trackChange);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Filter(parameter)
                              .Sort(parameter)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public async Task<List<string>> InsuranceCompanyGetOwnCarIds(int? dataProviderId, bool trackChange)
        {
            var query = FindByCondition(x => x.CreatedByUser.DataProviderId == dataProviderId, trackChange);
            return await query.Select(x => x.CarId).ToListAsync();
        }
    }
}
