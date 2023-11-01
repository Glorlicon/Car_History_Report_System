using Application.DTO.CarRecall;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enum;
using Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class CarRecallStatusRepository : BaseRepository<CarRecallStatus>, ICarRecallStatusRepository
    {
        protected ApplicationDBContext repositoryContext;
        public CarRecallStatusRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public async Task<CarRecallStatus> GetCarRecallStatus(int recallId, string carId, bool trackChange)
        {
            return await FindByCondition(x => x.CarRecallId == recallId && x.CarId == carId, trackChange)
                            .Include(x => x.CarRecall)
                            .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<CarRecallStatus>> GetCarRecallStatusByCar(string carId, CarRecallStatusParameter parameter, bool trackChange)
        {
            var query = FindByCondition(x => x.CarId == carId, trackChange);
            if (parameter.Status != null)
            {
                var recallStatus = Enum.Parse<RecallStatus>(parameter.Status);
                query = query.Where(x => x.Status == recallStatus);
            }
            return await query.Include(x => x.CarRecall)
                        .ToListAsync();
        }

        public async Task<IEnumerable<CarRecallStatus>> GetCarRecallStatusByRecall(int recallId, CarRecallStatusParameter parameter, bool trackChange)
        {
            var query = FindByCondition(x => x.CarRecallId == recallId, trackChange);
            if (parameter.Status != null)
            {
                var recallStatus = Enum.Parse<RecallStatus>(parameter.Status);
                query = query.Where(x => x.Status == recallStatus);
            }
            return await query.Include(x => x.CarRecall)
                        .ToListAsync();
        }
    }
}
