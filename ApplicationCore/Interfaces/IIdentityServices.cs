using Application.Common.Models;
using Application.DTO.Authentication;
using Application.DTO.User;
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

        Task<bool> ChangePassword(string id, ChangePasswordUserRequestDTO request);

        Task<string> ForgotPassword(string email);

        Task<bool> ResetPassword(string email, string newPassword, string token);

        Task<bool> ValidateUser(string username, string password);

        Task<LoginResult> Login(string username,string password);

        Task<bool> ConfirmEmail(string token, string email);

        Task<bool> SetSuspendAccount(string userId, bool isSuspend);

        Task<string> CreateConfirmEmailToken(string username, string password);

        Task<string> RefreshToken(string userId, bool isVerified);

        string CreateTokenForGuest(string? carId);
    }
}
