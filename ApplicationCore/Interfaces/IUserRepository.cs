using Application.DTO.User;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<User> GetUserByUserId(string id, bool trackChanges);
        Task<IEnumerable<User>> GetAllUser(UserParameter parameter, bool trackChanges);
        Task<IEnumerable<string>> GetAdminUserIds();
    }
}
