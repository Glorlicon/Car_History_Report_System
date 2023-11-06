using Application.Common.Models;
using Application.DTO.Car;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarRepository : IBaseRepository<Car>
    {
        Task<Car> GetCarById(string vinId, bool trackChange);
        Task<Car> GetCarWithHistoriesById(string vinId, bool trackChange);
        Task<Car> GetCarReportDataById(string vinId, bool trackChange);

        Task<IEnumerable<Car>> GetAllCar(CarParameter parameter, bool trackChange);

        Task<IEnumerable<Car>> GetCarsByUserId(string userId, CarParameter parameter, bool trackChange);

        Task<IEnumerable<Car>> GetCarsByManufacturerId(int manufacturerId, CarParameter parameter, bool trackChange);

        Task<IEnumerable<string>> GetCarIdsByModelId(string modelId, bool trackChange);

        Task<IEnumerable<Car>> GetCarsByCarDealerId(int carDealerId, CarParameter parameter, bool trackChange);

        Task<IEnumerable<Car>> GetCarsByAdminstrator(CarParameter parameter, bool trackChange);

        Task<IEnumerable<Car>> GetCarsCurrentlySelling(CarParameter parameter, bool trackChange);

        Task<int> CountCarByCondition(Expression<Func<Car, bool>> expression, CarParameter parameter);

        Task<int> CountCarAll(CarParameter parameter);

        Task<Car> GetCarIncludeDataProviderFromVinId(string VinId, bool trackChange);

    }
}
