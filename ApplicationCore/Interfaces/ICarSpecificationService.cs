using Application.DTO.CarSpecification;
using Domain.Entities;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarSpecificationService
    {
        Task<IEnumerable<CarSpecificationResponseDTO>> GetAllCarModels(bool trackChange);

        Task<CarSpecificationResponseDTO> GetCarModel(string modelId, bool trackChange);

        Task<IEnumerable<CarSpecificationResponseDTO>> GetCarModelByUserId(string userId, bool trackChange);

        Task<IEnumerable<CarSpecificationResponseDTO>> GetCarModelByManufacturerId(int manufacturerId, bool trackChange);

        Task<bool> CreateCarModel(CarSpecificationCreateRequestDTO request);

        Task<bool> DeleteCarModel(string modelId);

        Task<bool> UpdateCarModel(string modelId, CarSpecificationUpdateRequestDTO request);

    }
}
