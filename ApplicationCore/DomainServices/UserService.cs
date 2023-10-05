using Application.Common.Models;
using Application.DTO.CarSpecification;
using Application.DTO.User;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.Configuration.Annotations;
using Domain.Entities;
using Domain.Enum;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing.Constraints;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Application.DomainServices
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly UserManager<User> _userManager;
        private readonly IEmailServices _emailServices;
        private readonly IIdentityServices _identityServices;
        private readonly static Random _rand = new Random();


        public UserService(IMapper mapper, IUserRepository userRepository, UserManager<User> userManager, IEmailServices emailServices, IIdentityServices identityServices)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _userManager = userManager;
            _emailServices = emailServices;
            _identityServices = identityServices;
        }

        // THEM ROLE CHO USER: _userManager.AddToRoleAsync(user, "ADMIN");
        // Lay ra tat ca cac role
        //IList<string> roles = await _userManager.GetRolesAsync(user);

        //public void AddRoleToUser(string userName, string role)
        //{
        //    var user = _userManager.FindByNameAsync(userName).Result;
        //    var res = _userManager.AddToRoleAsync(user, role).Result;
        //}

        //public void AddRoleToUser2(User model)
        //{
        //    var user = _userManager.FindByNameAsync(model.Id).Result;
        //    var res = _userManager.AddToRoleAsync(user, Role.Adminstrator + "").Result;
        //}
        public async Task<RegisterResult> CreateAsync(CreateUserRequestDTO request)
        {
            var user = _mapper.Map<User>(request);
            user.EmailConfirmed = true;
            //TODO: password generate move to Helper
            string password = "";
            const string lower = "abcdefghijklmnopqrstuvwxyz";
            const string upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string number = "1234567890";
            const string special = "!@#$%^&*_-=+";
            // Get cryptographically random sequence of bytes
            var length = 20;
            var bytes = new byte[length];
            new RNGCryptoServiceProvider().GetBytes(bytes);

            // Build up a string using random bytes and character classes
            var res = new StringBuilder();
            foreach (byte b in bytes)
            {
                // Randomly select a character class for each byte
                switch (_rand.Next(4))
                {
                    // In each case use mod to project byte b to the correct range
                    case 0:
                        res.Append(lower[b % lower.Count()]);
                        break;
                    case 1:
                        res.Append(upper[b % upper.Count()]);
                        break;
                    case 2:
                        res.Append(number[b % number.Count()]);
                        break;
                    case 3:
                        res.Append(special[b % special.Count()]);
                        break;
                }
            }
            password = res.ToString();
            //all move to helper

            var result = await _identityServices.RegisterAsync(user, password);

            // TODO: Gui mail password toi user
            await _emailServices.SendEmailAsync(request.Email, "You register successfully", "This is your password: " + password);
            return result;
        }

        public async Task<IEnumerable<UserResponseDTO>> GetAllUsers()
        {
            var users = await _userRepository.GetAll(trackChange: false);
            var userResponse = _mapper.Map<IEnumerable<UserResponseDTO>>(users);
            //foreach (var user in userResponse)
            //{
            //user.Role = from role in 
            //user.RoleString = _userManager.GetRolesAsync(users.Where(us => us.Id == user.Id).First()).Result.FirstOrDefault();
            //}
            return userResponse;
        }

        public async Task<UserResponseDTO> GetUser(string id)
        {
            var user = await _userRepository.GetUserByUserId(id, trackChanges: false);
            var userResponse = _mapper.Map<UserResponseDTO>(user);
            return userResponse;
        }

        public async Task<bool> UpdateUser(string id, UpdateUserRequestDTO request)
        {
            var user = await _userRepository.GetUserByUserId(id, trackChanges: true);
            if (user == null)
            {
                return false;
            }
            _mapper.Map(request, user);
            //TODO: validate
            await _userRepository.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteUser(string id)
        {
            var user = await _userRepository.GetUserByUserId(id, trackChanges: true);
            if (user == null)
            {
                return false;
            }
            _userRepository.Delete(user);
            await _userRepository.SaveAsync();
            return true;
        }
    }
}
