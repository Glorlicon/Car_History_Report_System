using Application.Interfaces;
using Domain.Entities;
using Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;
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

        public async Task<User> GetUserByUserId(string id, bool trackChanges)
        {
            return await FindByCondition(u => u.Id == id, trackChanges)
                .SingleOrDefaultAsync();
        }
    }
}
