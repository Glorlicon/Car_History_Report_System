using Application.Common;
using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.DataProvider;
using Application.DTO.Request;
using Application.DTO.User;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enum;
using Domain.Exceptions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests
{
    public class UserServicesTests
    {
        private IMapper mapper;
        private List<User> usersTestData;
        private UserParameter parameter;
        private UpdateUserRequestDTO updateRequest;
        private UpdateUserOwnProfileRequestDTO updateUserOwnProfileRequest;
        private Mock<IUserService> mockService;
        private Mock<IIdentityServices> mockIdentityService;
        private Mock<IEmailServices> mockEmailService;
        private Mock<IAuthenticationServices> mockAuthenticationService;

        public UserServicesTests()
        {
            var myProfile = new MappingProfile();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile(myProfile));
            mapper = new Mapper(configuration);
            usersTestData = GetUsers();
            parameter = new UserParameter();
            updateRequest = new UpdateUserRequestDTO();
            updateUserOwnProfileRequest = new UpdateUserOwnProfileRequestDTO();
            mockService = new Mock<IUserService>();
            mockIdentityService = new Mock<IIdentityServices>();
            mockEmailService = new Mock<IEmailServices>();
            mockAuthenticationService = new Mock<IAuthenticationServices>();
        }

        private List<User> GetUsers()
        {
            var users = new List<User>();
            users.Add(new User
            {
                Id = "User Test 1",
                DataProviderId = 1,
                DataProvider = new DataProvider
                {
                    Id = 1,
                    Name = "Data Provider Test 01",
                    Description = "This is test description 1",
                    Address = "This is test address 1",
                    Service = "This is test service 1",
                    PhoneNumber = "0981235762",
                    Email = "EmailTest1@gmailtest.com",
                    Type = DataProviderType.CarDealer,
                },
                Role = Role.CarDealer

            });
            users.Add(new User
            {
                Id = "User Test 2",
                Role = Role.Adminstrator
            });
            return users;
        }

        [Fact]
        public async Task GetAllUsers_ReturnUsersList()
        {
            // Arrange
            bool trackChange = false;
            var mockRepo = new Mock<IUserRepository>();
            mockRepo.Setup(repo => repo.GetAllUser(parameter, trackChange))
                    .ReturnsAsync(usersTestData);
            mockRepo.Setup(repo => repo.CountAll()).ReturnsAsync(2);

            var service = new UserService(mapper, mockRepo.Object, mockEmailService.Object, mockIdentityService.Object, mockAuthenticationService.Object);
            // Act            
            var result = await service.GetAllUsers(parameter, trackChange);
            // Assert
            Assert.Equal(2, result.Count());
            Assert.IsAssignableFrom<PagedList<UserResponseDTO>>(result);
        }

        [Fact]
        public async Task GetUser_ReturnUser()
        {
            // Arrange
            bool trackChange = false;
            string id = "User Test 1";
            var mockRepo = new Mock<IUserRepository>();
            mockRepo.Setup(repo => repo.GetUserByUserId(id, trackChange))
                    .ReturnsAsync(usersTestData.First());

            var service = new UserService(mapper, mockRepo.Object, mockEmailService.Object, mockIdentityService.Object, mockAuthenticationService.Object);
            // Act            
            var result = await service.GetUser(id);
            // Assert
            Assert.Equal(id, result.Id);
        }

        [Fact]
        public async Task GetUser_ReturnUserNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            string id = "User Test 3";
            var mockRepo = new Mock<IUserRepository>();
            mockRepo.Setup(repo => repo.GetUserByUserId(id, trackChange))
                    .ReturnsAsync(value: null);

            var service = new UserService(mapper, mockRepo.Object, mockEmailService.Object, mockIdentityService.Object, mockAuthenticationService.Object);

            Func<Task> act = () => service.GetUser(id);
            // Assert
            await Assert.ThrowsAsync<UserNotFoundException>(act);
        }

        [Fact]
        public async Task UpdateUser_ReturnFalse()
        {
            // Arrange
            bool trackChange = true;
            string id = "User Test 3";
            var mockRepo = new Mock<IUserRepository>();
            mockRepo.Setup(repo => repo.GetUserByUserId(id, trackChange))
                    .ReturnsAsync(value: null);

            var service = new UserService(mapper, mockRepo.Object, mockEmailService.Object, mockIdentityService.Object, mockAuthenticationService.Object);

            var result = await service.UpdateUser(id, updateRequest);
            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task UpdateUser_ReturnTrue()
        {
            // Arrange
            bool trackChange = true;
            string id = "User Test 1";
            var mockRepo = new Mock<IUserRepository>();
            mockRepo.Setup(repo => repo.GetUserByUserId(id, trackChange))
                    .ReturnsAsync(usersTestData.First());

            var service = new UserService(mapper, mockRepo.Object, mockEmailService.Object, mockIdentityService.Object, mockAuthenticationService.Object);

            var result = await service.UpdateUser(id, updateRequest);
            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task UpdateOwnUserProfile_ReturnFalse()
        {
            // Arrange
            bool trackChange = true;
            string id = "User Test 1";
            var mockRepo = new Mock<IUserRepository>();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
                .ReturnsAsync(value: null);
            var service = new UserService(mapper, mockRepo.Object, mockEmailService.Object, mockIdentityService.Object, mockAuthenticationService.Object);

            var result = await service.UpdateUserOwnProfile(updateUserOwnProfileRequest);
            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task UpdateOwnUserProfile_ReturnTrue()
        {
            // Arrange
            bool trackChange = true;
            string id = "User Test 1";
            var mockRepo = new Mock<IUserRepository>();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
                .ReturnsAsync(new User { Id = id, Role = Role.User });
            var service = new UserService(mapper, mockRepo.Object, mockEmailService.Object, mockIdentityService.Object, mockAuthenticationService.Object);

            var result = await service.UpdateUserOwnProfile(updateUserOwnProfileRequest);
            // Assert
            Assert.True(result);
        }
    }
}
