using Application.DTO.CarSpecification;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarSpecificationRepository : IBaseRepository<CarSpecification>
    {
        Task<CarSpecification> GetCarModelById(string modelId, bool trackChange);

        Task<IEnumerable<CarSpecification>> GetAllCarModels(CarSpecificationParameter parameter, bool trackChange);

        Task<IEnumerable<CarSpecification>> GetAllCarModelsTest(CarSpecificationParameter parameter, bool trackChange);

        Task<IEnumerable<CarSpecification>> GetCarModelByUserId(string userId, CarSpecificationParameter parameter, bool trackChange);

        Task<IEnumerable<CarSpecification>> GetCarModelByManufacturerId(int manufacturerId, CarSpecificationParameter parameter, bool trackChange);

        Task<IEnumerable<CarSpecification>> GetCarModelsCreatedByAdminstrator(CarSpecificationParameter parameter, bool trackChange);
    }
}
