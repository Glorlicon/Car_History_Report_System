using Application.DTO.CarSpecification;
using Application.DTO.User;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.DBContext;
using Infrastructure.Repository.Extension;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.ObjectPool;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        protected ApplicationDBContext repositoryContext;
        public UserRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }
        //TODO getall
        public override async Task<IEnumerable<User>> GetAll(bool trackChanges)
        {
            return await FindAll(trackChanges).ToListAsync();
        }

        public async Task<IEnumerable<User>> GetAllUser(UserParameter parameter, bool trackChanges)
        {
            return await FindAll(trackChanges)
                .Include(u => u.DataProvider)
                .Filter(parameter)
                .Sort(parameter)          
                .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                .Take(parameter.PageSize)
                .ToListAsync();
        }

        public async Task<User> GetUserByUserId(string id, bool trackChanges)
        {
            return await FindByCondition(u => u.Id == id, trackChanges)
                .Include(u => u.DataProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<int?> GetDataProviderId(string id)
        {
            return await FindByCondition(u => u.Id == id, trackChanges: false)
                            .Select(u => u.DataProviderId).SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<string>> GetAdminUserIds()
        {
            return await FindByCondition(x => x.Role == Domain.Enum.Role.Adminstrator, trackChanges: false)
                            .Select(x => x.Id)
                            .Distinct()
                            .ToListAsync();
        }
    }
}
