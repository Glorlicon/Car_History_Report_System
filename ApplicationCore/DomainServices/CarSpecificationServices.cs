using Application.DTO.CarSpecification;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DomainServices
{
    public class CarSpecificationServices : ICarSpecificationService
    {
        private readonly ICarSpecificationRepository _carSpecRepository;
        private readonly IMapper _mapper;
        public CarSpecificationServices(ICarSpecificationRepository carSpecRepository, IMapper mapper)
        {
            _carSpecRepository = carSpecRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CarSpecificationResponseDTO>> GetAllCarModels(bool trackChange)
        {
            var carModels = await _carSpecRepository.GetAll(trackChange);
            var carModelsResponse = _mapper.Map<IEnumerable<CarSpecificationResponseDTO>>(carModels);
            return carModelsResponse;
        }

        public async Task<CarSpecificationResponseDTO> GetCarModel(string modelId, bool trackChange)
        {
            var carModel = await _carSpecRepository.GetCarModelById(modelId, trackChange);
            if (carModel is null)
            {
                throw new CarSpecificationNotFoundException(modelId);
            }

            var carModelsResponse = _mapper.Map<CarSpecificationResponseDTO>(carModel);
            return carModelsResponse;
        }

        public async Task<IEnumerable<CarSpecificationResponseDTO>> GetCarModelByUserId(string userId, bool trackChange)
        {
            var carModels = await _carSpecRepository.GetCarModelByUserId(userId, trackChange);
            var carModelsResponse = _mapper.Map<IEnumerable<CarSpecificationResponseDTO>>(carModels);
            return carModelsResponse;
        }

        public async Task<IEnumerable<CarSpecificationResponseDTO>> GetCarModelByManufacturerId(int manufacturerId, bool trackChange)
        {
            var carModels =  await _carSpecRepository.GetCarModelByManufacturerId(manufacturerId,trackChange);
            var carModelsResponse = _mapper.Map<IEnumerable<CarSpecificationResponseDTO>>(carModels);
            return carModelsResponse;
        }

        public async Task<bool> CreateCarModel(CarSpecificationCreateRequestDTO request)
        {
            var carSpec = _mapper.Map<CarSpecification>(request);
            _carSpecRepository.Create(carSpec);
            await _carSpecRepository.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteCarModel(string modelId)
        {
            var carSpec = await _carSpecRepository.GetCarModelById(modelId, trackChange: true);
            if(carSpec is null)
            {
                throw new CarSpecificationNotFoundException(modelId);
            }
            _carSpecRepository.Delete(carSpec);
            await _carSpecRepository.SaveAsync();
            return true;
        }

        public async Task<bool> UpdateCarModel(string modelId, CarSpecificationUpdateRequestDTO request)
        {

            var carSpec = await _carSpecRepository.GetCarModelById(modelId, trackChange: true);
            if(carSpec is null)
            {
                throw new CarSpecificationNotFoundException(modelId);
            }
            _mapper.Map(request, carSpec);
            await _carSpecRepository.SaveAsync();
            return true;
        }

    }
}
