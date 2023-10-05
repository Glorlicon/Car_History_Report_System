using Application.Common.Models;
using Application.DTO.Authentication;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enum;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.InfrastructureServices
{
    public class IdentityServices : IIdentityServices
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private User _user;

        public IdentityServices(UserManager<User> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }


        public Task<bool> DeleteUserAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public async Task<User> GetUserAsync(string userId)
        {
            return await _userManager.FindByIdAsync(userId);
        }

        public async Task<bool> IsInRoleAsync(string userId, Role role)
        {
            var user = await GetUserAsync(userId);
            return user.Role == role;
        }

        public async Task<LoginResult> Login(string username, string password)
        {
            if (!await ValidateUser(username,password))
            {
                return new LoginResult(token: null, isEmailVerified: false, isUserExist: false, succeed: false, isSuspended: false);
            }
            var isSuspended = IsSuspended(_user);
            var isEmailVerified = await _userManager.IsEmailConfirmedAsync(_user);
            if (isSuspended) 
                return new LoginResult(token: null, isEmailVerified: isEmailVerified, isUserExist: true, succeed: false, isSuspended: isSuspended);
            
            var token = await CreateToken(isEmailVerified);
            if (!isEmailVerified)
                return new LoginResult(token: token, isEmailVerified: isEmailVerified, isUserExist: true, succeed: false, isSuspended: isSuspended);
            return new LoginResult(token: token, isEmailVerified: isEmailVerified, isUserExist: true, succeed: true, isSuspended: isSuspended);
        }

        private bool IsSuspended(User user)
        {
            return user.LockoutEnabled;
        }

        public async Task<bool> ValidateUser(string username, string password)
        {
            _user = await _userManager.FindByNameAsync(username);
            if (_user == null)
                _user = await _userManager.FindByEmailAsync(username);
            return (_user != null && await _userManager.CheckPasswordAsync(_user, password));
        }

        public async Task<RegisterResult> RegisterAsync(User user,string password)
        {
            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                return new RegisterResult(result, "","");
            }
            var userRoles = new List<string>(){
                user.Role.ToString()
            };
            // Send Confirmation Email
            await _userManager.AddToRolesAsync(user, userRoles);
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            return new RegisterResult(result, user.Id, token);
        }

        public async Task<string> CreateConfirmEmailToken(string username, string password)
        {
            if (!await ValidateUser(username, password))
            {
                return null;
            }
            return await _userManager.GenerateEmailConfirmationTokenAsync(_user);
        }

        public async Task<string> CreateToken(bool isVerified)
        {
            var signingCredentials = GetSigningCredentials();
            var claims = await GetClaims(isVerified);
            var tokenOptions = GenerateTokenOptions(signingCredentials, claims);
            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }
        private SigningCredentials GetSigningCredentials()
        {
            var keyPlain = Environment.GetEnvironmentVariable("CAR_HISTORY_API_SECRET");
            var key = Encoding.UTF8.GetBytes(keyPlain);
            var secret = new SymmetricSecurityKey(key);
            return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        }
        private async Task<List<Claim>> GetClaims(bool isVerified)
        {
            var claims = new List<Claim>
             {
                new Claim(ClaimTypes.NameIdentifier,_user.Id),
                new Claim(ClaimTypes.Name, _user.UserName),
                new Claim(ClaimTypes.Email, _user.Email)
             };
            if (isVerified) claims.Add(new Claim(ClaimTypes.Role, _user.Role.ToString()));
            return claims;
        }
        private JwtSecurityToken GenerateTokenOptions(SigningCredentials signingCredentials, List<Claim> claims)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var tokenOptions = new JwtSecurityToken
            (
            issuer: jwtSettings.GetSection("validIssuer").Value,
            audience: jwtSettings.GetSection("validAudience").Value,
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings.GetSection("expires").Value)),
            signingCredentials: signingCredentials
            );
            return tokenOptions;
        }

        public async Task<bool> ConfirmEmail(string token, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return false;
            var result = await _userManager.ConfirmEmailAsync(user, token);
            return result.Succeeded;
        }

        public async Task<bool> SetSuspendAccount(string userId,bool isSuspend)
        {
            var user = await _userManager.FindByIdAsync(userId);
            await _userManager.SetLockoutEnabledAsync(user, isSuspend);
            return true;
        }
    }
}
