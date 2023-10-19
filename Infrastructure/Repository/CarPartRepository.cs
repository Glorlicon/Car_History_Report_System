using Application.DTO.Car;
using Application.DTO.CarPart;
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
    public class CarPartRepository : BaseRepository<CarPart>, ICarPartRepository
    {
        protected ApplicationDBContext repositoryContext;
        public CarPartRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public async Task<IEnumerable<CarPart>> GetAllCarParts(CarPartParameter parameter, bool trackChange)
        {
            return await FindAll(trackChange)
                            .Include(x => x.Manufacturer)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<CarPart> GetCarPartById(int id, bool trackChange)
        {
            return await FindByCondition(x => x.Id == id, trackChange)
                            .Include(x => x.Manufacturer)
                            .SingleOrDefaultAsync();
        }

        public async Task<List<CarPart>> GetCarPartsByIdList(List<int> ids, bool trackChange)
        {
            var carParts =  await FindByCondition(x => ids.Contains(x.Id),trackChange)
                                .ToListAsync();
            return carParts;
        }

        public async Task<IEnumerable<CarPart>> GetCarPartsByCarId(string vinId, CarPartParameter parameter, bool trackChange)
        {
            return await FindByCondition(x => x.Cars.Any(x => x.VinId == vinId), trackChange)
                            .Include(x => x.Manufacturer)
                            .Include(x => x.Cars)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<IEnumerable<CarPart>> GetCarPartsByManufacturerId(int manufacturerId, CarPartParameter parameter, bool trackChange)
        {
            return await FindByCondition(x => x.ManufacturerId == manufacturerId, trackChange)
                            .Include(x => x.Manufacturer)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }
    }
}
