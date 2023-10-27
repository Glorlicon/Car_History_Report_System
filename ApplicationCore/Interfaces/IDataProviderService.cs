using Application.Common.Models;
using Application.DTO.Car;
using Application.DTO.DataProvider;
using Application.DTO.DataProvider;
using Application.DTO.Request;
using Domain.Entities;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IDataProviderService
    {
        Task<PagedList<DataProviderDetailsResponseDTO>> GetAllDataProviders(DataProviderParameter parameter);

        Task<IEnumerable<DataProviderDetailsResponseDTO>> GetAllDataProvidersWithoutUser(DataProviderParameter parameter, DataProviderType type);

        Task<IEnumerable<DataProviderDetailsResponseDTO>> GetAllDataProvidersByType(DataProviderType type);

        Task<DataProviderDetailsResponseDTO> GetDataProvider(int dataProviderId);

        Task<DataProviderDetailsResponseDTO> GetDataProviderByUserId(string userId);

        Task<DataProviderDetailsResponseDTO> CreateDataProvider(DataProviderCreateRequestDTO request);

        Task<bool> DeleteDataProvider(int dataProviderId);

        Task<bool> UpdateDataProvider(int dataProviderId, DataProviderUpdateRequestDTO request);

        Task<bool> ContactDataProvider(DataProviderContactCreateRequestDTO request);

    }
}
