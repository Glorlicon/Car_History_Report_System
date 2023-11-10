using Application.DTO.CarTracking;
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
    public class CarTrackingRepository : BaseRepository<CarTracking>, ICarTrackingRepository
    {
        protected ApplicationDBContext repositoryContext;
        public CarTrackingRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public async Task<IEnumerable<CarTracking>> GetAllCarTrackings(CarTrackingParameter parameter, bool trackChange)
        {
            return await FindAll(trackChange)
                            .Include(x => x.Car)
                            .OrderByDescending(x => x.IsFollowing)
                            .ThenByDescending(x => x.CreatedTime)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<CarTracking> GetCarTracking(string userId, string carId, bool trackChange)
        {
            return await FindByCondition(x => x.UserId == userId && x.CarId == carId, trackChange)
                            .Include(x => x.Car)
                            .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<CarTracking>> GetCarTrackingsByUserId(string userId, CarTrackingParameter parameter, bool trackChange)
        {
            return await FindByCondition(x => x.UserId == userId, trackChange)
                            .Include(x => x.Car)
                            .OrderByDescending(x => x.IsFollowing)
                            .ThenByDescending(x => x.CreatedTime)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<IEnumerable<CarTracking>> GetCarCurrentlyTrackingsByCarId(string carId, CarTrackingParameter parameter, bool trackChange)
        {
            return await FindByCondition(x => x.CarId == carId && x.IsFollowing == true, trackChange)
                            .Include(x => x.Car)
                            .OrderByDescending(x => x.IsFollowing)
                            .ThenByDescending(x => x.CreatedTime)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<IEnumerable<string>> GetUserIdsTrackingCarId(string carId, bool trackChange)
        {
            return await FindByCondition(x => x.CarId == carId && x.IsFollowing, trackChange)
                            .Select(x => x.UserId)
                            .Distinct()
                            .ToListAsync();
        }
    }
}
