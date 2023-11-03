using Application.Common.Models;
using Application.DTO.CarSpecification;
using Application.DTO.User;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IUserService
    {
        //public void AddRoleToUser(string user, string role);
        //public void AddRoleToUser2(User model);

        Task<RegisterResult> CreateAsync(CreateUserRequestDTO request);
        Task<PagedList<UserResponseDTO>> GetAllUsers(UserParameter parameter, bool trackChange);

        Task<UserResponseDTO> GetUser(string id);

        Task<bool> UpdateUser(string id, UpdateUserRequestDTO request);

        //Task<bool> DeleteUser(string id);
    }
}
