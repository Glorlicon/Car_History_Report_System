using Application.DTO.DataProvider;
using Application.DTO.Request;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enum;
using Infrastructure.DBContext;
using Infrastructure.Repository.Extension;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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

        public async Task<IEnumerable<DataProvider>> GetAllDataProviders(DataProviderParameter parameter, bool trackChange)
        {
            return await FindAll(trackChange)
                            .Include(dp => dp.WorkingTimes)
                            .Include(dp => dp.Reviews)
                            .Filter(parameter)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<IEnumerable<DataProvider>> GetAllDataProvidersByType(DataProviderType type, bool trackChange)
        {
            return await FindByCondition(dp => dp.Type == type, trackChange)
                .ToListAsync();
        }

        public async Task<IEnumerable<DataProvider>> GetAllDataProvidersWithoutUser(DataProviderParameter parameter ,DataProviderType type, bool trackChange)
        {
            return await FindByCondition(dp => dp.Type == type && !dp.Users.Any(),trackChange)
                .ToListAsync();
        }

        public async Task<DataProvider?> GetDataProvider(int dataProviderId, bool trackChange)
        {
            return await FindByCondition(dp => dp.Id == dataProviderId, trackChange)
                .Include(dp => dp.WorkingTimes)
                .Include(dp => dp.Reviews)
                .SingleOrDefaultAsync();
        }
    }
}
