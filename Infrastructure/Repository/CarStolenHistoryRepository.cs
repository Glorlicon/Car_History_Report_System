using Application.DTO.CarOwnerHistory;
using Application.DTO.CarStolenHistory;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class CarStolenHistoryRepository : BaseRepository<CarStolenHistory>, ICarStolenHistoryRepository
    {
        protected ApplicationDBContext repositoryContext;
        public CarStolenHistoryRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public async Task<IEnumerable<CarStolenHistory>> GetAllCarStolenHistorys(CarStolenHistoryParameter parameter, bool trackChange)
        {
            return await FindAll(trackChange)
                            .Include(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .OrderByDescending(x => x.CreatedTime)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<CarStolenHistory> GetCarStolenHistoryById(int id, bool trackChange)
        {
            return await FindByCondition(x => x.Id == id, trackChange)
                            .Include(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<CarStolenHistory>> GetCarStolenHistorysByCarId(string vinId, CarStolenHistoryParameter parameter, bool trackChange)
        {
            return await FindByCondition(x => x.CarId == vinId, trackChange)
                            .Include(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .OrderByDescending(x => x.CreatedTime)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<CarStolenHistory> GetCurrentCarStolen(string vinId, bool trackChange)
        {
            return await FindByCondition(x => x.CarId == vinId, trackChange)
                            .Include(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .OrderByDescending(x => x.CreatedTime)
                            .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<CarStolenHistory>> InsuranceCompanyGetCarStolenHistorysBelongToOwnCompany(List<string> carIds, CarStolenHistoryParameter parameter, bool trackChange)
        {          
            return await FindByCondition(x => carIds.Contains(x.CarId), trackChange)
                            .Include(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .OrderByDescending(x => x.CreatedTime)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }
    }
}
