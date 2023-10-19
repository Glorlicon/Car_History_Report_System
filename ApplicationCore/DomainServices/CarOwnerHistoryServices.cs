using Application.Common.Models;
using Application.DTO.CarOwnerHistory;
using Application.DTO.CarPart;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DomainServices
{
    public class CarOwnerHistoryServices : ICarOwnerHistoryServices
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CarOwnerHistoryServices(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedList<CarOwnerHistoryResponseDTO>> GetAllCarOwnerHistorys(CarOwnerHistoryParameter parameter)
        {
            var carOwnerHistorys = await _unitOfWork.CarOwnerHistoryRepository.GetAllCarOwnerHistorys(parameter, false);
            var carOwnerHistorysResponse = _mapper.Map<List<CarOwnerHistoryResponseDTO>>(carOwnerHistorys);
            var count = await _unitOfWork.CarOwnerHistoryRepository.CountAll();
            return new PagedList<CarOwnerHistoryResponseDTO>(carOwnerHistorysResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<CarOwnerHistoryResponseDTO> GetCarOwnerHistory(int id)
        {
            var carOwnerHistory = await _unitOfWork.CarOwnerHistoryRepository.GetCarOwnerHistoryById(id, trackChange: false);
            if (carOwnerHistory is null)
            {
                throw new CarHistoryRecordNotFoundException(id, "Car Owner History");
            }
            var carOwnerHistoryResponse = _mapper.Map<CarOwnerHistoryResponseDTO>(carOwnerHistory);
            return carOwnerHistoryResponse;
        }

        public async Task<CarOwnerHistoryResponseDTO> GetCurrentCarOwner(string vinId)
        {
            var carOwnerHistory = await _unitOfWork.CarOwnerHistoryRepository.GetCurrentCarOwner(vinId, trackChange: false);
            if (carOwnerHistory is null)
            {
                throw new CarHistoryNotFoundException(vinId, "Car Owner History");
            }
            var carOwnerHistoryResponse = _mapper.Map<CarOwnerHistoryResponseDTO>(carOwnerHistory);
            return carOwnerHistoryResponse;
        }

        public async Task<PagedList<CarOwnerHistoryResponseDTO>> GetCarOwnerHistoryByCarId(string vinId, CarOwnerHistoryParameter parameter)
        {
            var carOwnerHistorys = await _unitOfWork.CarOwnerHistoryRepository.GetCarOwnerHistorysByCarId(vinId, parameter, false);
            var carOwnerHistorysResponse = _mapper.Map<List<CarOwnerHistoryResponseDTO>>(carOwnerHistorys);
            var count = await _unitOfWork.CarOwnerHistoryRepository.CountByCondition(x => x.CarId == vinId);
            return new PagedList<CarOwnerHistoryResponseDTO>(carOwnerHistorysResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }


        public async Task<bool> CreateCarOwnerHistory(CarOwnerHistoryCreateRequestDTO request)
        {
            var currentCarOwner = await _unitOfWork.CarOwnerHistoryRepository.GetCurrentCarOwner(request.CarId, trackChange: true);
            var carOwnerHistory = _mapper.Map<CarOwnerHistory>(request);
            _unitOfWork.CarOwnerHistoryRepository.Create(carOwnerHistory);
            if(currentCarOwner != null)
            {
                if (currentCarOwner.EndDate == null)
                    currentCarOwner.EndDate = request.StartDate;
            }
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteCarOwnerHistory(int id)
        {
            var carOwnerHistory = await _unitOfWork.CarOwnerHistoryRepository.GetCarOwnerHistoryById(id, trackChange: true);
            if (carOwnerHistory is null)
            {
                throw new CarHistoryRecordNotFoundException(id, "Car Owner History");
            }
            _unitOfWork.CarOwnerHistoryRepository.Delete(carOwnerHistory);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> UpdateCarOwnerHistory(int id, CarOwnerHistoryUpdateRequestDTO request)
        {
            var carOwnerHistory = await _unitOfWork.CarOwnerHistoryRepository.GetCarOwnerHistoryById(id, trackChange: true);
            if (carOwnerHistory is null)
            {
                throw new CarHistoryRecordNotFoundException(id, "Car Owner History");
            }
            _mapper.Map(request, carOwnerHistory);
            await _unitOfWork.SaveAsync();
            return true;
        }
    }
}
