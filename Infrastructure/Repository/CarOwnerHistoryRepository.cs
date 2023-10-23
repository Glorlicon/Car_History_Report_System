using Application.DTO.CarOwnerHistory;
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
    public class CarOwnerHistoryRepository : BaseRepository<CarOwnerHistory>, ICarOwnerHistoryRepository
    {
        protected ApplicationDBContext repositoryContext;
        public CarOwnerHistoryRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public async Task<IEnumerable<CarOwnerHistory>> GetAllCarOwnerHistorys(CarOwnerHistoryParameter parameter, bool trackChange)
        {
            return await FindAll(trackChange)
                            .Include(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .OrderByDescending(x => x.StartDate)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<CarOwnerHistory> GetCarOwnerHistoryById(int id, bool trackChange)
        {
            return await FindByCondition(x => x.Id == id, trackChange)
                            .Include(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<CarOwnerHistory>> GetCarOwnerHistorysByCarId(string vinId, CarOwnerHistoryParameter parameter, bool trackChange)
        {
            return await FindByCondition(x => x.CarId == vinId, trackChange)
                            .Include(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .OrderByDescending(x => x.StartDate)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<CarOwnerHistory> GetCurrentCarOwner(string vinId, bool trackChange)
        {
            return await FindByCondition(x => x.CarId == vinId, trackChange)
                            .Include(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .OrderByDescending(x => x.StartDate)
                            .FirstOrDefaultAsync();
        }
    }
}
