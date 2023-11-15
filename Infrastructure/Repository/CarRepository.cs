using Application.DTO.Car;
using Application.Interfaces;
using Application.Utility;
using Domain.Entities;
using Infrastructure.DBContext;
using Infrastructure.Repository.Extension;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class CarRepository : BaseRepository<Car>, ICarRepository
    {
        protected ApplicationDBContext repositoryContext;
        public CarRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public async Task<int> CountCarAll(CarParameter parameter)
        {
            return await FindAll(false)
                            .Filter(parameter)
                            .CountAsync();
        }

        public async Task<int> CountCarByCondition(Expression<Func<Car, bool>> expression, CarParameter parameter)
        {
            return await FindByCondition(expression, false)
                            .Filter(parameter)
                            .CountAsync();
        }

        public async Task<IEnumerable<Car>> GetAllCar(CarParameter parameter, bool trackChange)
        {
            return await FindAll(trackChange)
                            .Include(c => c.Model)
                            .ThenInclude(c => c.Manufacturer)
                            .Include(c => c.CarSalesInfo).ThenInclude(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .Include(c => c.CarImages)
                            .Filter(parameter)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .AsSplitQuery()
                            .ToListAsync();
        }

        public async Task<Car> GetCarById(string vinId, bool trackChange)
        {
            var car =  await FindByCondition(c => c.VinId == vinId, trackChange)
                            .Include(c => c.Model)
                            .ThenInclude(c => c.Manufacturer)
                            .Include(c => c.CarSalesInfo).ThenInclude(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .Include(c => c.CarImages)
                            .SingleOrDefaultAsync();
            return car;
        }

        public async Task<Car> GetCarWithHistoriesById(string vinId, bool trackChange)
        {
            var car = await FindByCondition(c => c.VinId == vinId, trackChange)
                            .Include(c => c.CarInsurances)
                            .Include(c => c.CarAccidentHistories)
                            .Include(c => c.CarInspectionHistories)
                            .Include(c => c.CarOwnerHistories)
                            .Include(c => c.CarServiceHistories)
                            .Include(c => c.CarStolenHistories)
                            .Include(c => c.CarRegistrationHistories)
                            .AsSplitQuery()
                            .SingleOrDefaultAsync();
            return car;
        }

        public async Task<int> GetMaxOdometerValueByCarId(string vinId, bool trackChange)
        {
            var car = await FindByCondition(c => c.VinId == vinId, trackChange)
                            .Include(c => c.CarInsurances)
                            .Include(c => c.CarAccidentHistories)
                            .Include(c => c.CarInspectionHistories)
                            .Include(c => c.CarOwnerHistories)
                            .Include(c => c.CarServiceHistories)
                            .Include(c => c.CarStolenHistories)
                            .Include(c => c.CarRegistrationHistories)
                            .SingleOrDefaultAsync();
            return CarUtility.GetMaxCarOdometer(car);
        }

        public async Task<IEnumerable<Car>> GetCarsByCarDealerId(int carDealerId, CarParameter parameter, bool trackChange)
        {
            return await FindByCondition(c => c.CarSalesInfo != null &&  c.CarSalesInfo.CreatedByUser.DataProviderId == carDealerId, trackChange)
                            .Include(c => c.Model)
                            .ThenInclude(c => c.Manufacturer)
                            .Include(c => c.CarSalesInfo).ThenInclude(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .Include(c => c.CarImages)
                            .Filter(parameter)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .AsSplitQuery()
                            .ToListAsync();
        }

        public async Task<IEnumerable<Car>> GetCarsByPartialPlate(string searchString, CarParameter parameter, bool trackChange)
        {
            return await FindAll(trackChange)
                            .Include(c => c.Model)
                            .SearchPlate(searchString)
                            .Filter(parameter)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<IEnumerable<Car>> GetCarsByCurrentDataProviderId(int? dataProviderId, CarParameter parameter, bool trackChange)
        {
            return await FindByCondition(c => c.CurrentDataProviderId == dataProviderId, trackChange)
                            .Include(c => c.Model)
                            .ThenInclude(c => c.Manufacturer)
                            .Include(c => c.CarImages)
                            .Filter(parameter)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<IEnumerable<Car>> GetCarsByManufacturerId(int manufacturerId, CarParameter parameter, bool trackChange)
        {
            return await FindByCondition(c => c.Model.ManufacturerId == manufacturerId, trackChange)
                            .Include(c => c.Model)
                            .ThenInclude(c => c.Manufacturer)
                            .Include(c => c.CarSalesInfo).ThenInclude(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .Include(c => c.CarImages)
                            .Filter(parameter)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .AsSplitQuery()
                            .ToListAsync();
        }

        public async Task<IEnumerable<Car>> GetCarsByUserId(string userId, CarParameter parameter, bool trackChange)
        {
            return await FindByCondition(c => c.CreatedByUserId == userId, trackChange)
                            .Include(c => c.Model)
                            .ThenInclude(c => c.Manufacturer)
                            .Include(c => c.CarSalesInfo).ThenInclude(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .Include(c => c.CarImages)
                            .Filter(parameter)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .AsSplitQuery()
                            .ToListAsync();
        }

        public async Task<IEnumerable<Car>> GetCarsByAdminstrator(CarParameter parameter, bool trackChange)
        {
            return await FindByCondition(c => c.CreatedByUser.Role == Domain.Enum.Role.Adminstrator, trackChange)
                            .Include(c => c.Model)
                            .ThenInclude(c => c.Manufacturer)
                            .Include(c => c.CarSalesInfo).ThenInclude(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .Include(c => c.CarImages)
                            .Filter(parameter)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .AsSplitQuery()
                            .ToListAsync();
        }

        public async Task<IEnumerable<Car>> GetCarsCurrentlySelling(CarParameter parameter, bool trackChange)
        {
            return await FindByCondition(c => c.CarSalesInfo != null, trackChange)
                            .Include(c => c.Model)
                            .ThenInclude(c => c.Manufacturer)
                            .Include(c => c.CarSalesInfo).ThenInclude(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .Include(c => c.CarImages)
                            .Filter(parameter)
                            .Sort(parameter)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .AsSplitQuery()
                            .ToListAsync();
        }

        public async Task<Car> GetCarIncludeDataProviderFromVinId(string VinId, bool trackChange)
        {
            return await FindByCondition(c => c.VinId == VinId, trackChange)
                .Include(u => u.CreatedByUser)
                .ThenInclude(dp => dp.DataProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<string>> GetCarIdsByModelId(string modelId, bool trackChange)
        {
            return await FindByCondition(c => c.ModelId == modelId, trackChange)
                            .Select(x => x.VinId)
                            .ToListAsync();
        }

        public async Task<Car> GetCarReportDataById(string vinId, bool trackChange)
        {
            var car = await FindByCondition(c => c.VinId == vinId, trackChange)
                            .Include(c => c.Model)
                            .ThenInclude(c => c.Manufacturer)
                            .Include(c => c.CarInsurances).ThenInclude(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .Include(c => c.CarAccidentHistories).ThenInclude(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .Include(c => c.CarInspectionHistories).ThenInclude(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .Include(c => c.CarOwnerHistories).ThenInclude(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .Include(c => c.CarRecallStatuses).ThenInclude(x => x.CarRecall)
                            .Include(c => c.CarServiceHistories).ThenInclude(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .Include(c => c.CarStolenHistories).ThenInclude(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .Include(c => c.CarRegistrationHistories).ThenInclude(x => x.CreatedByUser).ThenInclude(x => x.DataProvider)
                            .AsSplitQuery()
                            .SingleOrDefaultAsync();
            return car;
        }
    }
}
