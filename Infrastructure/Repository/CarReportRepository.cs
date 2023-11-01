using Application.DTO.CarMaintainance;
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
    public class CarReportRepository : BaseRepository<CarReport>, ICarReportRepository
    {
        protected ApplicationDBContext repositoryContext;
        public CarReportRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public async Task<CarReport> GetById(string carId, string userId, bool trackChange)
        {
            return await FindByCondition(x => x.CarId == carId && x.UserId == userId, trackChange)
                            .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<CarReport>> GetByUserId(string userId, bool trackChange)
        {
            return await FindByCondition(x => x.UserId == userId, trackChange)
                            .Include(x => x.Car)
                            .ToListAsync();
        }
    }
}
