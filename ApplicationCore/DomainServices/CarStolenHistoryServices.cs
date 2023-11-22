using Application.Common.Models;
using Application.DTO.CarStolenHistory;
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
    public class CarStolenHistoryServices : ICarStolenHistoryServices
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IAuthenticationServices _authenticationServices;

        public CarStolenHistoryServices(IUnitOfWork unitOfWork, IMapper mapper, IAuthenticationServices authenticationServices)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _authenticationServices = authenticationServices;
        }

        public async Task<PagedList<CarStolenHistoryResponseDTO>> GetAllCarStolenHistorys(CarStolenHistoryParameter parameter)
        {
            var carStolenHistorys = await _unitOfWork.CarStolenHistoryRepository.GetAllCarStolenHistorys(parameter, false);
            var carStolenHistorysResponse = _mapper.Map<List<CarStolenHistoryResponseDTO>>(carStolenHistorys);
            var count = await _unitOfWork.CarStolenHistoryRepository.CountAll();
            return new PagedList<CarStolenHistoryResponseDTO>(carStolenHistorysResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<CarStolenHistoryResponseDTO> GetCarStolenHistory(int id)
        {
            var carStolenHistory = await _unitOfWork.CarStolenHistoryRepository.GetCarStolenHistoryById(id, trackChange: false);
            if (carStolenHistory is null)
            {
                throw new CarHistoryRecordNotFoundException(id, "Car Stolen History");
            }
            var carStolenHistoryResponse = _mapper.Map<CarStolenHistoryResponseDTO>(carStolenHistory);
            return carStolenHistoryResponse;
        }

        public async Task<PagedList<CarStolenHistoryResponseDTO>> GetCarStolenHistoryByCarId(string vinId, CarStolenHistoryParameter parameter)
        {
            var carStolenHistorys = await _unitOfWork.CarStolenHistoryRepository.GetCarStolenHistorysByCarId(vinId, parameter, false);
            var carStolenHistorysResponse = _mapper.Map<List<CarStolenHistoryResponseDTO>>(carStolenHistorys);
            var count = await _unitOfWork.CarStolenHistoryRepository.CountByCondition(x => x.CarId == vinId);
            return new PagedList<CarStolenHistoryResponseDTO>(carStolenHistorysResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<CarStolenHistoryResponseDTO> GetCurrentCarStolen(string vinId)
        {
            var carStolenHistory = await _unitOfWork.CarStolenHistoryRepository.GetCurrentCarStolen(vinId, trackChange: false);
            if (carStolenHistory is null)
            {
                throw new CarHistoryNotFoundException(vinId, "Car Stolen History");
            }
            var carStolenHistoryResponse = _mapper.Map<CarStolenHistoryResponseDTO>(carStolenHistory);
            return carStolenHistoryResponse;
        }

        public async Task<bool> CreateCarStolenHistory(CarStolenHistoryCreateRequestDTO request)
        {
            var currentCarStolen = await _unitOfWork.CarStolenHistoryRepository.GetCurrentCarStolen(request.CarId, trackChange: true);
            var carStolenHistory = _mapper.Map<CarStolenHistory>(request);
            _unitOfWork.CarStolenHistoryRepository.Create(carStolenHistory);
            if (currentCarStolen != null)
            {
                if (currentCarStolen.ReportDate == null)
                    currentCarStolen.ReportDate = request.ReportDate.Value.AddDays(-1);
            }
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteCarStolenHistory(int id)
        {
            var carStolenHistory = await _unitOfWork.CarStolenHistoryRepository.GetCarStolenHistoryById(id, trackChange: true);
            if (carStolenHistory is null)
            {
                throw new CarHistoryRecordNotFoundException(id, "Car Stolen History");
            }
            _unitOfWork.CarStolenHistoryRepository.Delete(carStolenHistory);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> UpdateCarStolenHistory(int id, CarStolenHistoryUpdateRequestDTO request)
        {
            var carStolenHistory = await _unitOfWork.CarStolenHistoryRepository.GetCarStolenHistoryById(id, trackChange: true);
            if (carStolenHistory is null)
            {
                throw new CarHistoryRecordNotFoundException(id, "Car Stolen History");
            }
            _mapper.Map(request, carStolenHistory);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<PagedList<CarStolenHistoryResponseDTO>> InsuranceCompanyGetOwnCarStolenHistories(CarStolenHistoryParameter parameter)
        {
            var user = await _authenticationServices.GetCurrentUserAsync();
            if(user.DataProviderId == null)
            {
                throw new UnauthorizedAccessException();
            }
            var carIds = await _unitOfWork.CarInsuranceRepository.InsuranceCompanyGetOwnCarIds(user.DataProviderId, false);
            if(carIds == null)
            {
                throw new CarNotFoundException();
            }
            var carStolenHistorys = await _unitOfWork.CarStolenHistoryRepository.InsuranceCompanyGetCarStolenHistorysBelongToOwnCompany(carIds, parameter, false);
            var carStolenHistorysResponse = _mapper.Map<List<CarStolenHistoryResponseDTO>>(carStolenHistorys);
            var count = await _unitOfWork.CarStolenHistoryRepository.CountAll();
            return new PagedList<CarStolenHistoryResponseDTO>(carStolenHistorysResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }        
        
        public async Task<CarStolenHistoryResponseDTO> InsuranceCompanyGetOwnCarStolenHistoryDetail(int id)
        {
            var user = await _authenticationServices.GetCurrentUserAsync();
            if(user.DataProviderId == null)
            {
                throw new UnauthorizedAccessException();
            }
            var carIds = await _unitOfWork.CarInsuranceRepository.InsuranceCompanyGetOwnCarIds(user.DataProviderId, false);
            if(carIds == null || carIds.Count == 0)
            {
                throw new CarNotFoundException();
            }
            var carStolenHistory = await _unitOfWork.CarStolenHistoryRepository.GetCarStolenHistoryById(id, false);
            if(carStolenHistory == null)
            {
                throw new CarHistoryRecordNotFoundException(id);
            }
            if (!carIds.Contains(carStolenHistory.CarId))
            {
                throw new UnauthorizedAccessException();
            }
            var carStolenHistoryResponse = _mapper.Map<CarStolenHistoryResponseDTO>(carStolenHistory);
            return carStolenHistoryResponse;
        }
    }
}
