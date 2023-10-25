using Application.DTO.CarRecall;
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
    public class CarRecallRepository : BaseRepository<CarRecall>, ICarRecallRepository
    {
        protected ApplicationDBContext repositoryContext;
        public CarRecallRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public async Task<CarRecall> GetCarRecallById(int id, bool trackChange)
        {
            return await FindByCondition(x => x.ID == id, trackChange)
                            .Include(x => x.Model)
                            .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<CarRecall>> GetCarRecalls(CarRecallParameter parameter, bool trackChange)
        {
            return await FindAll(trackChange)
                            .Include(x => x.Model)
                            .OrderByDescending(x => x.RecallDate)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<IEnumerable<CarRecall>> GetCarRecallsByManufacturer(int manufacturerId, CarRecallParameter parameter, bool trackChange)
        {
            return await FindByCondition(x => x.Model.ManufacturerId == manufacturerId, trackChange)
                            .Include(x => x.Model)
                            .OrderByDescending(x => x.RecallDate)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<IEnumerable<CarRecall>> GetCarRecallsByModel(string modelId, CarRecallParameter parameter, bool trackChange)
        {
            return await FindByCondition(x => x.ModelId == modelId, trackChange)
                            .Include(x => x.Model)
                            .OrderByDescending(x => x.RecallDate)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }
    }
}
