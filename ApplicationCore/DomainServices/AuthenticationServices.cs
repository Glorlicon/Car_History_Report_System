using Application.Common.Models;
using Application.DTO.Authentication;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enum;
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
            return await _identityServices.GetUserAsync(userId);
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

        public async Task<string> ResendConfirmEmailTokenAsync(LoginRequestDTO loginRequest)
        {
            return await _identityServices.CreateConfirmEmailToken(loginRequest.UserName, loginRequest.Password);
        }

        public async Task<bool> SuspendAccount(string userId)
        {
            return await _identityServices.SetSuspendAccount(userId, true);
        }

        public async Task<bool> UnSuspendAccount(string userId)
        {
            return await _identityServices.SetSuspendAccount(userId, false);
        }
    }
}
