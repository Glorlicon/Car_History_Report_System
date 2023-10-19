using Application.DTO.Car;
using Application.DTO.CarPart;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarPartRepository : IBaseRepository<CarPart>
    {
        Task<CarPart> GetCarPartById(int id, bool trackChange);

        Task<IEnumerable<CarPart>> GetAllCarParts(CarPartParameter parameter, bool trackChange);

        Task<IEnumerable<CarPart>> GetCarPartsByCarId(string vinId, CarPartParameter parameter, bool trackChange);

        Task<IEnumerable<CarPart>> GetCarPartsByManufacturerId(int manufacturerId, CarPartParameter parameter, bool trackChange);

        Task<List<CarPart>> GetCarPartsByIdList(List<int> ids, bool trackChange);
    }
}
