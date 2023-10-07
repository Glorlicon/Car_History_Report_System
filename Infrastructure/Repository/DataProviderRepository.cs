using Application.DTO.DataProvider;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enum;
using Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class DataProviderRepository : BaseRepository<DataProvider>, IDataProviderRepository
    {
        private ApplicationDBContext repositoryContext;
        public DataProviderRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public async Task<IEnumerable<DataProvider>> GetAllDataProvidersByType(DataProviderType type, bool trackChange)
        {
            return await FindByCondition(dp => dp.Type == type, trackChange).ToListAsync();
        }

        public async Task<DataProvider?> GetDataProvider(int dataProviderId, bool trackChange)
        {
            return await FindByCondition(dp => dp.Id == dataProviderId, trackChange).SingleOrDefaultAsync();
        }
    }
}
