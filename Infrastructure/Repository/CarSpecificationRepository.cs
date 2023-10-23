using Application.Common.Models;
using Application.DTO.CarSpecification;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class CarSpecificationRepository : BaseRepository<CarSpecification>, ICarSpecificationRepository
    {
        protected ApplicationDBContext repositoryContext;
        public CarSpecificationRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public async Task<IEnumerable<CarSpecification>> GetAllCarModels(CarSpecificationParameter parameter, bool trackChange)
        {
            return await FindAll(trackChange)
                            .Include(x => x.Manufacturer)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<IEnumerable<CarSpecification>> GetAllCarModelsTest(CarSpecificationParameter parameter, bool trackChange)
        {
            var carModels = await FindAll(trackChange)
                            .Include(x => x.Manufacturer)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
            var count = await FindAll(trackChange).CountAsync();
            return new PagedList<CarSpecification>(carModels, count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<CarSpecification> GetCarModelById(string modelId, bool trackChange)
        {
            return await FindByCondition(cs => cs.ModelID == modelId, trackChange)
                            .Include(x => x.Manufacturer)
                            .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<CarSpecification>> GetCarModelByManufacturerId(int manufacturerId, CarSpecificationParameter parameter, bool trackChange)
        {
            return await FindByCondition(cs => cs.ManufacturerId == manufacturerId, trackChange)
                            .Include(x => x.Manufacturer)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<IEnumerable<CarSpecification>> GetCarModelByUserId(string userId, CarSpecificationParameter parameter, bool trackChange)
        {
            return await FindByCondition(cs => cs.CreatedByUserId == userId, trackChange)
                            .Include(x => x.Manufacturer)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<IEnumerable<CarSpecification>> GetCarModelsCreatedByAdminstrator(CarSpecificationParameter parameter,bool trackChange)
        {
            return await FindAll(trackChange)
                            .Include(x => x.Manufacturer)
                            .Include(x => x.CreatedByUser)
                            .Where(x => x.CreatedByUser != null && x.CreatedByUser.Role == Domain.Enum.Role.Adminstrator)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }
    }
}
