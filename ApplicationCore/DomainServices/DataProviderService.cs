using Application.Common.Models;
using Application.DTO.Car;
using Application.DTO.CarSpecification;
using Application.DTO.DataProvider;
using Application.Interfaces;
using Application.Validation.Car;
using Application.Validation.DataProvider;
using AutoMapper;
using Domain.Entities;
using Domain.Enum;
using Domain.Exceptions;
using FluentValidation.AspNetCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DomainServices
{
    public class DataProviderService : IDataProviderService
    {
        private readonly IDataProviderRepository _dataProviderRepository;
        private readonly IIdentityServices _identityServices;
        private readonly IMapper _mapper;
        public DataProviderService(IDataProviderRepository dataProviderRepository, IMapper mapper, IIdentityServices identityServices)
        {
            _dataProviderRepository = dataProviderRepository;
            _mapper = mapper;
            _identityServices = identityServices;
        }

        public async Task<PagedList<DataProviderResponseDTO>> GetAllDataProviders(DataProviderParameter parameter)
        {
            var dataProviders = await _dataProviderRepository.GetAllDataProviders(parameter, trackChange: false);
            var dataProvidersResponse = _mapper.Map<List<DataProviderResponseDTO>>(dataProviders);
            var count = await _dataProviderRepository.CountAll();
            return new PagedList<DataProviderResponseDTO>(dataProvidersResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<IEnumerable<DataProviderResponseDTO>> GetAllDataProvidersWithoutUser(DataProviderParameter parameter, DataProviderType type)
        {
            var dataProviders = await _dataProviderRepository.GetAllDataProvidersWithoutUser(parameter, type, trackChange: false);
            var dataProvidersResponse = _mapper.Map<IEnumerable<DataProviderResponseDTO>>(dataProviders);
            return dataProvidersResponse;
        }

        public async Task<IEnumerable<DataProviderResponseDTO>> GetAllDataProvidersByType(DataProviderType type)
        {
            var dataProviders = await _dataProviderRepository.GetAllDataProvidersByType(type, false);
            var dataProvidersResponse = _mapper.Map<IEnumerable<DataProviderResponseDTO>>(dataProviders);
            return dataProvidersResponse;
        }

        public async Task<DataProviderResponseDTO> GetDataProvider(int dataProviderId)
        {
            var dataProvider = await _dataProviderRepository.GetDataProvider(dataProviderId, false);
            if(dataProvider is null)
            {
                throw new DataProviderNotFoundExpcetion(dataProviderId);
            }
            var dataProviderResponse = _mapper.Map<DataProviderResponseDTO>(dataProvider);
            return dataProviderResponse;
        }

        public async Task<DataProviderResponseDTO> GetDataProviderByUserId(string userId)
        {
            var user = await _identityServices.GetUserAsync(userId);
            if(user is null)
            {
                throw new UserNotFoundException(userId);
            }
            if(user.DataProviderId is null)
            {
                throw new DataProviderNotFoundExpcetion(user.DataProviderId);
            }
            return await GetDataProvider(user.DataProviderId.Value);
        }
        public async Task<int> CreateDataProvider(DataProviderCreateRequestDTO request)
        {
            var dataProvider = _mapper.Map<DataProvider>(request);
            _dataProviderRepository.Create(dataProvider);
            await _dataProviderRepository.SaveAsync();
            return dataProvider.Id;
        }

        public async Task<bool> DeleteDataProvider(int dataProviderId)
        {
            var dataProvider = await _dataProviderRepository.GetDataProvider(dataProviderId, true);
            if (dataProvider is null)
            {
                throw new DataProviderNotFoundExpcetion(dataProviderId);
            }
            _dataProviderRepository.Delete(dataProvider);
            await _dataProviderRepository.SaveAsync();
            return true;
        }

        public async Task<bool> UpdateDataProvider(int dataProviderId, DataProviderUpdateRequestDTO request)
        {
            var dataProvider = await _dataProviderRepository.GetDataProvider(dataProviderId, true);
            if (dataProvider is null)
            {
                throw new DataProviderNotFoundExpcetion(dataProviderId);
            }
            _mapper.Map(request, dataProvider);
            await _dataProviderRepository.SaveAsync();
            return true;
        }
    }
}
