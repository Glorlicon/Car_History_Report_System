using Application.DTO.CarRecall;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.DBContext;
using Infrastructure.Repository.Extension;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
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

        public async Task<int> CountAll(CarRecallParameter parameter)
        {
            return await FindAll(false)
                            .Filter(parameter)
                            .CountAsync();
        }

        public async Task<int> CountByCondition(Expression<Func<CarRecall, bool>> expression, CarRecallParameter parameter)
        {
            return await FindByCondition(expression, false)
                            .Filter(parameter)
                            .CountAsync();
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
                            .Filter(parameter)
                            .Include(x => x.Model)
                            .OrderByDescending(x => x.RecallDate)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<IEnumerable<CarRecall>> GetCarRecallsByManufacturer(int manufacturerId, CarRecallParameter parameter, bool trackChange)
        {
            return await FindByCondition(x => x.Model.ManufacturerId == manufacturerId, trackChange)
                            .Filter(parameter)
                            .Include(x => x.Model)
                            .OrderByDescending(x => x.RecallDate)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<IEnumerable<CarRecall>> GetCarRecallsByModel(string modelId, CarRecallParameter parameter, bool trackChange)
        {
            return await FindByCondition(x => x.ModelId == modelId, trackChange)
                            .Filter(parameter)  
                            .Include(x => x.Model)
                            .OrderByDescending(x => x.RecallDate)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }
    }
}
