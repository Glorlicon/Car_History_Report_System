using Application.Common.Models;
using Application.DTO.Authentication;
using Application.DTO.User;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enum;
using Domain.Exceptions;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DomainServices
{
    public class AuthenticationServices : IAuthenticationServices
    {
        private readonly IMapper _mapper;
        private readonly IIdentityServices _identityServices;
        private readonly ICurrentUserServices _currentUserServices;

        public AuthenticationServices(IMapper mapper, IIdentityServices identityServices, ICurrentUserServices currentUserServices)
        {
            _mapper = mapper;
            _identityServices = identityServices;
            _currentUserServices = currentUserServices;
        }

        public Task<bool> ConfirmEmail(string token, string email)
        {
            return _identityServices.ConfirmEmail(token, email);
        }

        public async Task<User> GetCurrentUserAsync()
        {
            var userId = _currentUserServices.GetCurrentUserId();
            var user = await _identityServices.GetUserAsync(userId);
            if (user is null)
                throw new UserNotFoundException("No current user is logged in");
            return user;
        }

        public async Task<bool> IsInRoleAsync(string userId, Role role)
        {
            return await _identityServices.IsInRoleAsync(userId, role);
        }

        public async Task<LoginResult> Login(LoginRequestDTO loginRequest)
        {
            return await _identityServices.Login(loginRequest.UserName, loginRequest.Password);
        }

        public async Task<RegisterResult> RegisterAsync(RegistrationRequestDTO request)
        {
            var user = _mapper.Map<User>(request);
            var result = await _identityServices.RegisterAsync(user, request.Password);
            return result;
        }

        public async Task<bool> ChangePassword(string userId, ChangePasswordUserRequestDTO request)
        {
            return await _identityServices.ChangePassword(userId, request);
        }

        public async Task<string> ForgotPassword(ForgotPasswordRequestDTO request)
        {
            return await _identityServices.ForgotPassword(request);
        }

        public async Task<string> ResetPassword(ResetPasswordRequestDTO request)
        {
            return await _identityServices.ResetPassword(request);
        }

        public async Task<string> ResendConfirmEmailTokenAsync(EmailResendConfirmTokenRequestDTO request)
        {
            return await _identityServices.CreateConfirmEmailToken(request.UserName, request.Password);
        }

        public async Task<bool> SuspendAccount(string userId)
        {
            return await _identityServices.SetSuspendAccount(userId, true);
        }

        public async Task<bool> UnSuspendAccount(string userId)
        {
            return await _identityServices.SetSuspendAccount(userId, false);
        }

        public async Task<string> ResendLoginTokenAsync()
        {
            var currentUser = await GetCurrentUserAsync();
            return await _identityServices.RefreshToken(currentUser.Id, isVerified: true);
        }
    }
}
