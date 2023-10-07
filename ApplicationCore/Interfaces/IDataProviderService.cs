using Application.DTO.DataProvider;
using Application.DTO.DataProvider;
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
        Task<IEnumerable<DataProviderResponseDTO>> GetAllDataProviders();

        Task<IEnumerable<DataProviderResponseDTO>> GetAllDataProvidersWithoutUser(DataProviderType type);

        Task<IEnumerable<DataProviderResponseDTO>> GetAllDataProvidersByType(DataProviderType type);

        Task<DataProviderResponseDTO> GetDataProvider(int dataProviderId);

        Task<DataProviderResponseDTO> GetDataProviderByUserId(string userId);

        Task<int> CreateDataProvider(DataProviderCreateRequestDTO request);

        Task<bool> DeleteDataProvider(int dataProviderId);

        Task<bool> UpdateDataProvider(int dataProviderId, DataProviderUpdateRequestDTO request);
    }
}
