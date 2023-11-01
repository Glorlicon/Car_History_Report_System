using Application.Common.Models;
using Application.DTO.CarOwnerHistory;
using Application.Interfaces;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DomainServices
{
    public class CarHistoryServices<T, R, P, C, U> : ICarHistoryServices<R,P,C,U> where T: CarHistory
                                                                                  where P : PagingParameters
    {
        private readonly ICarHistoryRepository<T,P> _carHistoryRepository;
        private readonly IMapper _mapper;

        public CarHistoryServices(ICarHistoryRepository<T,P> carHistoryRepository, IMapper mapper)
        {
            _carHistoryRepository = carHistoryRepository;
            _mapper = mapper;
        }

        public async Task<PagedList<R>> GetAllCarHistorys(P parameter)
        {
            var carHistorys = await _carHistoryRepository.GetAllCarHistorys(parameter, false);
            var carHistorysResponse = _mapper.Map<List<R>>(carHistorys);
            var count = await _carHistoryRepository.CountAllCarHistory(parameter);
            return new PagedList<R>(carHistorysResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<R> GetCarHistory(int id)
        {
            var carHistory = await _carHistoryRepository.GetCarHistoryById(id, trackChange: false);
            if (carHistory is null)
            {
                throw new CarHistoryRecordNotFoundException(id, nameof(T));
            }
            var carHistoryResponse = _mapper.Map<R>(carHistory);
            return carHistoryResponse;
        }

        public async Task<PagedList<R>> GetCarHistoryByCarId(string vinId, P parameter)
        {
            var carHistorys = await _carHistoryRepository.GetCarHistorysByCarId(vinId, parameter, false);
            var carHistorysResponse = _mapper.Map<List<R>>(carHistorys);
            var count = await _carHistoryRepository.CountCarHistoryByCondition(x => x.CarId == vinId,parameter);
            return new PagedList<R>(carHistorysResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<PagedList<R>> GetCarHistoryByUserId(string userId, P parameter)
        {
            var carHistorys = await _carHistoryRepository.GetCarHistorysByUserId(userId, parameter, false);
            var carHistorysResponse = _mapper.Map<List<R>>(carHistorys);
            var count = await _carHistoryRepository.CountCarHistoryByCondition(x => x.CreatedByUserId == userId, parameter);
            return new PagedList<R>(carHistorysResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public virtual async Task<int> CreateCarHistory(C request)
        {
            var carHistory = _mapper.Map<T>(request);
            _carHistoryRepository.Create(carHistory);
            await _carHistoryRepository.SaveAsync();
            return carHistory.Id;
        }

        public virtual async Task DeleteCarHistory(int id)
        {
            var carHistory = await _carHistoryRepository.GetCarHistoryById(id, trackChange: true);
            if (carHistory is null)
            {
                throw new CarHistoryRecordNotFoundException(id, nameof(T));
            }
            _carHistoryRepository.Delete(carHistory);
            await _carHistoryRepository.SaveAsync();
        }

        public virtual async Task UpdateCarHistory(int id, U request)
        {
            var carHistory = await _carHistoryRepository.GetCarHistoryById(id, trackChange: true);
            if (carHistory is null)
            {
                throw new CarHistoryRecordNotFoundException(id, nameof(T));
            }
            _mapper.Map(request, carHistory);
            await _carHistoryRepository.SaveAsync();
        }

        public async Task<IEnumerable<int>> CreateCarHistoryCollection(IEnumerable<C> requests)
        {
            if(requests is null)
            {
                throw new NullCollectionException();
            }
            var carHistorys = _mapper.Map<IEnumerable<T>>(requests);
            foreach(var carHistory in carHistorys)
            {
                _carHistoryRepository.Create(carHistory);
            }
            await _carHistoryRepository.SaveAsync();
            return carHistorys.Select(x => x.Id).ToList();
        }
    }
}
