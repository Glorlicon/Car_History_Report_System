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
    public interface IAuthenticationServices
    {
        Task<User> GetCurrentUserAsync();

        Task<bool> IsInRoleAsync(string userId, Role role);

        Task<RegisterResult> RegisterAsync(RegistrationRequestDTO request);

        Task<LoginResult> Login(LoginRequestDTO loginRequest);

        Task<bool> ConfirmEmail(string token, string email);

        Task<string> ResendConfirmEmailTokenAsync(EmailResendConfirmTokenRequestDTO request);

        Task<bool> SuspendAccount(string userId);

        Task<bool> UnSuspendAccount(string userId);
    }
}
