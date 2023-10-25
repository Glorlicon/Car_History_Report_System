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

        public async Task<PagedList<DataProviderDetailsResponseDTO>> GetAllDataProviders(DataProviderParameter parameter)
        {
            var dataProviders = await _dataProviderRepository.GetAllDataProviders(parameter, trackChange: false);
            var dataProvidersResponse = _mapper.Map<List<DataProviderDetailsResponseDTO>>(dataProviders);
            var count = await _dataProviderRepository.CountAll();
            return new PagedList<DataProviderDetailsResponseDTO>(dataProvidersResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<IEnumerable<DataProviderDetailsResponseDTO>> GetAllDataProvidersWithoutUser(DataProviderParameter parameter, DataProviderType type)
        {
            var dataProviders = await _dataProviderRepository.GetAllDataProvidersWithoutUser(parameter, type, trackChange: false);
            var dataProvidersResponse = _mapper.Map<IEnumerable<DataProviderDetailsResponseDTO>>(dataProviders);
            return dataProvidersResponse;
        }

        public async Task<IEnumerable<DataProviderDetailsResponseDTO>> GetAllDataProvidersByType(DataProviderType type)
        {
            var dataProviders = await _dataProviderRepository.GetAllDataProvidersByType(type, false);
            var dataProvidersResponse = _mapper.Map<IEnumerable<DataProviderDetailsResponseDTO>>(dataProviders);
            return dataProvidersResponse;
        }

        public async Task<DataProviderDetailsResponseDTO> GetDataProvider(int dataProviderId)
        {
            var dataProvider = await _dataProviderRepository.GetDataProvider(dataProviderId, false);
            if(dataProvider is null)
            {
                throw new DataProviderNotFoundException(dataProviderId);
            }
            var dataProviderResponse = _mapper.Map<DataProviderDetailsResponseDTO>(dataProvider);
            return dataProviderResponse;
        }

        public async Task<DataProviderDetailsResponseDTO> GetDataProviderByUserId(string userId)
        {
            var user = await _identityServices.GetUserAsync(userId);
            if(user is null)
            {
                throw new UserNotFoundException(userId);
            }
            if(user.DataProviderId is null)
            {
                throw new DataProviderNotFoundException(user.DataProviderId);
            }
            return await GetDataProvider(user.DataProviderId.Value);
        }
        public async Task<DataProviderDetailsResponseDTO> CreateDataProvider(DataProviderCreateRequestDTO request)
        {
            var dataProvider = _mapper.Map<DataProvider>(request);
            _dataProviderRepository.Create(dataProvider);
            await _dataProviderRepository.SaveAsync();
            var result = _mapper.Map<DataProviderDetailsResponseDTO>(dataProvider);
            return result;
        }

        public async Task<bool> DeleteDataProvider(int dataProviderId)
        {
            var dataProvider = await _dataProviderRepository.GetDataProvider(dataProviderId, true);
            if (dataProvider is null)
            {
                throw new DataProviderNotFoundException(dataProviderId);
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
                throw new DataProviderNotFoundException(dataProviderId);
            }
            _mapper.Map(request, dataProvider);
            await _dataProviderRepository.SaveAsync();
            return true;
        }
    }
}
