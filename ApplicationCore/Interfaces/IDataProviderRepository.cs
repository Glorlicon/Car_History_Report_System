using Application.DTO.DataProvider;
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
        Task<IEnumerable<DataProvider>> GetAllDataProvidersByType(DataProviderType type, bool trackChange);

        Task<DataProvider?> GetDataProvider(int dataProviderId, bool trackChange);
    }
}
