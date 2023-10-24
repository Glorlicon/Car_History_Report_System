using Application.DTO.Car;
using Application.DTO.CarMaintainance;
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
    public class CarMaintainanceServices : ICarMaintainanceServices
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CarMaintainanceServices(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CarMaintainanceTrackingResponseDTO>> GetCarMaintainanceTrackingListByUserId(string userId)
        {
            var carMaintainanceList = await _unitOfWork.CarMaintainanceRepository.GetCarMaintainanceTrackingListByUserId(userId, trackChange: false);
            return carMaintainanceList;
        }

        public async Task AddCarToTrackingList(AddCarToTrackingListRequestDTO request)
        {
            var carMaintainance = await _unitOfWork.CarMaintainanceRepository
                                        .GetCarMaintainanceById(request.CarId, request.UserId, trackChange: false);
            if(carMaintainance != null)
            {
                throw new ExistException("Car", request.CarId);
            }
            var newCarMaintainance = _mapper.Map<CarMaintainance>(request);
            _unitOfWork.CarMaintainanceRepository.Create(newCarMaintainance);
            await _unitOfWork.SaveAsync();
        }

        public async Task RemoveCarFromTrackingList(string carId, string userId)
        {
            var carMaintainance = await _unitOfWork.CarMaintainanceRepository.GetCarMaintainanceById(carId, userId, trackChange: false);
            if (carMaintainance is null)
            {
                throw new NotExistException("Car", carId);
            }
            _unitOfWork.CarMaintainanceRepository.Delete(carMaintainance);
            await _unitOfWork.SaveAsync();
        }
    }
}
