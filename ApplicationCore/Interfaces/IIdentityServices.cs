using Application.Common.Models;
using Application.DTO.Authentication;
using Domain.Entities;
using Domain.Enum;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IIdentityServices
    {
        Task<User> GetUserAsync(string userId);

        Task<bool> IsInRoleAsync(string userId, Role role);

        Task<RegisterResult> RegisterAsync(User user, string password);

        Task<LoginResult> Login(string username,string password);

        Task<bool> ConfirmEmail(string token, string email);

        Task<bool> SetSuspendAccount(string userId, bool isSuspend);

        Task<string> CreateConfirmEmailToken(string username, string password);
    }
}
