using Application.Common.Models;
using Application.DTO.Car;
using Application.DTO.CarRecall;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enum;
using Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DomainServices
{
    public class CarRecallServices : ICarRecallServices
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CarRecallServices(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<CarRecallResponseDTO> GetCarRecall(int id)
        {
            var carRecall = await _unitOfWork.CarRecallRepository.GetCarRecallById(id, trackChange: false);
            if (carRecall is null)
            {
                throw new CarRecallNotFoundException(id);
            }
            var carRecallResponse = _mapper.Map<CarRecallResponseDTO>(carRecall);
            return carRecallResponse;
        }

        public async Task<PagedList<CarRecallResponseDTO>> GetAllCarRecalls(CarRecallParameter parameter)
        {
            var carRecalls = await _unitOfWork.CarRecallRepository.GetCarRecalls(parameter, false);
            var carRecallsResponse = _mapper.Map<List<CarRecallResponseDTO>>(carRecalls);
            var count = await _unitOfWork.CarRecallRepository.CountAll();
            return new PagedList<CarRecallResponseDTO>(carRecallsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<PagedList<CarRecallResponseDTO>> GetCarRecallsByManufacturer(int manufacturerId, CarRecallParameter parameter)
        {
            var carRecalls = await _unitOfWork.CarRecallRepository.GetCarRecallsByManufacturer(manufacturerId,parameter, false);
            var carRecallsResponse = _mapper.Map<List<CarRecallResponseDTO>>(carRecalls);
            var count = await _unitOfWork.CarRecallRepository.CountByCondition(x => x.Model.ManufacturerId == manufacturerId);
            return new PagedList<CarRecallResponseDTO>(carRecallsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<PagedList<CarRecallResponseDTO>> GetCarRecallsByModel(string modelId, CarRecallParameter parameter)
        {
            var carRecalls = await _unitOfWork.CarRecallRepository.GetCarRecallsByModel(modelId, parameter, false);
            var carRecallsResponse = _mapper.Map<List<CarRecallResponseDTO>>(carRecalls);
            var count = await _unitOfWork.CarRecallRepository.CountByCondition(x => x.ModelId == modelId);
            return new PagedList<CarRecallResponseDTO>(carRecallsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task CreateCarRecall(CarRecallCreateRequestDTO request)
        {
            var modelExist = await _unitOfWork.CarSpecificationRepository.IsExist(x => x.ModelID == request.ModelId);
            if(!modelExist)
            {
                throw new CarSpecificationNotFoundException(request.ModelId);
            }
            var carRecall = _mapper.Map<CarRecall>(request);
            var carRecallStatuses = new List<CarRecallStatus>();
            var carIds = await _unitOfWork.CarRepository.GetCarIdsByModelId(request.ModelId, trackChange: false);
            foreach(var carId in carIds)
            {
                carRecallStatuses.Add(new CarRecallStatus
                {
                    CarId = carId,
                    Status = Domain.Enum.RecallStatus.Open
                });
            }
            carRecall.CarRecallStatuses = carRecallStatuses;
            _unitOfWork.CarRecallRepository.Create(carRecall);
            await _unitOfWork.SaveAsync();
            //--- Push Notification here----
            //
            //------------------------------
        }

        public async Task DeleteCarRecall(int id)
        {
            var carRecall = await _unitOfWork.CarRecallRepository.GetCarRecallById(id, trackChange: true);
            if (carRecall is null)
            {
                throw new CarRecallNotFoundException(id);
            }
            //carRecall.CarRecallStatuses.Clear();
            var carRecallStatus = await _unitOfWork.CarRecallStatusRepository
                                            .GetCarRecallStatusByRecall(id, new CarRecallStatusParameter(), true);
            foreach(var recallStatus in carRecallStatus)
            {
                _unitOfWork.CarRecallStatusRepository.Delete(recallStatus);
            }
            _unitOfWork.CarRecallRepository.Delete(carRecall);
            await _unitOfWork.SaveAsync();
        }

        public async Task UpdateCarRecall(int id, CarRecallUpdateRequestDTO request)
        {
            var carRecall = await _unitOfWork.CarRecallRepository.GetCarRecallById(id, trackChange: true);
            if (carRecall is null)
            {
                throw new CarRecallNotFoundException(id);
            }
            _mapper.Map(request, carRecall);
            await _unitOfWork.SaveAsync();
        }

        public async Task<CarRecallStatusResponseDTO> GetCarRecallStatus(int recallId, string carId)
        {
            var carRecallStatus = await _unitOfWork.CarRecallStatusRepository.GetCarRecallStatus(recallId, carId, false);
            if (carRecallStatus is null)
            {
                throw new CarRecallStatusNotFound(carId, recallId);
            }
            var carRecallStatusResponse = _mapper.Map<CarRecallStatusResponseDTO>(carRecallStatus);
            return carRecallStatusResponse;
        }

        public async Task<IEnumerable<CarRecallStatusResponseDTO>> GetCarRecallStatusByCar(string carId, CarRecallStatusParameter parameter)
        {
            var carRecallStatuses = await _unitOfWork.CarRecallStatusRepository.GetCarRecallStatusByCar(carId, parameter, trackChange: false);
            var carRecallcarRecallStatusesResponse = _mapper.Map<IEnumerable<CarRecallStatusResponseDTO>>(carRecallStatuses);
            return carRecallcarRecallStatusesResponse;
        }

        public async Task UpdateCarRecallStatus(int recallId, string carId, CarRecallStatusUpdateRequestDTO request)
        {
            var carRecallStatus = await _unitOfWork.CarRecallStatusRepository.GetCarRecallStatus(recallId, carId, trackChange: true);
            if(carRecallStatus is null)
            {
                throw new CarRecallStatusNotFound(carId, recallId);
            }
            carRecallStatus.Status = request.Status;
            await _unitOfWork.SaveAsync();
        }
    }
}
