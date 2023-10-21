﻿using Application.Common.Models;
using Application.DTO.CarSpecification;
using Application.DTO.User;
using Application.Interfaces;
using Application.Utility;
using AutoMapper;
using AutoMapper.Configuration.Annotations;
using Domain.Entities;
using Domain.Enum;
using Domain.Exceptions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing.Constraints;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Application.DomainServices
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly IEmailServices _emailServices;
        private readonly IIdentityServices _identityServices;


        public UserService(IMapper mapper, IUserRepository userRepository, 
            IEmailServices emailServices, 
            IIdentityServices identityServices)
        {
            _mapper = mapper;
            _userRepository = userRepository;
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
            //password generate move to Helper
            var password = UserUtility.GenerateRandomPassword(16);

            var result = await _identityServices.RegisterAsync(user, password);

            //Gui mail password toi user
            await _emailServices.SendEmailAsync(request.Email, "Welcome to CarReportHistorySystem", "Hello!\n" +
                "Your account has been created. Please login using the following credentials:\n" +
                "Username: " + user.UserName + "\n" +
                "Password: " + password);
            return result;
        }

        public async Task<PagedList<UserResponseDTO>> GetAllUsers(UserParameter parameter, bool trackChange)
        {           
            var users = await _userRepository.GetAllUser(parameter, trackChange);

            var userResponse = _mapper.Map<List<UserResponseDTO>>(users);

            var count = await _userRepository.CountAll();

            //foreach (var user in userResponse)
            //{
            //user.Role = from role in 
            //user.RoleString = _userManager.GetRolesAsync(users.Where(us => us.Id == user.Id).First()).Result.FirstOrDefault();
            //}

            return new PagedList<UserResponseDTO>(userResponse, count: count, parameter.PageNumber, parameter.PageSize);
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

        //public async Task<bool> DeleteUser(string id)
        //{
        //    var user = await _userRepository.GetUserByUserId(id, trackChanges: true);
        //    if (user == null)
        //    {
        //        return false;
        //    }
        //    _userRepository.Delete(user);
        //    await _userRepository.SaveAsync();
        //    return true;
        //}

        public async Task<IEnumerable<string>> GetRoleList()
        {
            //List<string> roles = ((Role[])Enum.GetValues(typeof(Role))).Select(c => c.ToString()).ToList();
            var listRoles = Enum.GetNames(typeof(Role));
            return  listRoles;
        }
    }
}
