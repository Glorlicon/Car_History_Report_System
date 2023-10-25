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
    public interface IDataProviderRepository : IBaseRepository<DataProvider>
    {
        Task<IEnumerable<DataProvider>> GetAllDataProviders(DataProviderParameter parameter, bool trackChange);

        Task<IEnumerable<DataProvider>> GetAllDataProvidersWithoutUser(DataProviderParameter parameter, DataProviderType type, bool trackChange);

        Task<IEnumerable<DataProvider>> GetAllDataProvidersByType(DataProviderType type, bool trackChange);

        Task<DataProvider?> GetDataProvider(int dataProviderId, bool trackChange);
    }
}
