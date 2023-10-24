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
    public class CarMaintainanceRepository : BaseRepository<CarMaintainance>, ICarMaintainanceRepository
    {
        protected ApplicationDBContext repositoryContext;
        public CarMaintainanceRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }
        public async Task<CarMaintainance> GetCarMaintainanceById(string carId, string userId, bool trackChange)
        {
            return await FindByCondition(x => x.CarId == carId && x.UserId == userId, trackChange)
                            .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<CarMaintainanceTrackingResponseDTO>> GetCarMaintainanceTrackingListByUserId(string userId, bool trackChange)
        {
            return await FindByCondition(x => x.UserId == userId, trackChange)
                            .Include(x => x.Car)
                            .ThenInclude(x => x.Model)
                            .Select(x => new CarMaintainanceTrackingResponseDTO
                                {
                                    VinId = x.CarId,
                                    ModelId = x.Car.ModelId
                                })
                            .ToListAsync();
        }
    }
}
