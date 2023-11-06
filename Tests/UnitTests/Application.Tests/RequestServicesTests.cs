using Application.Common;
using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.Request;
using Application.DTO.User;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enum;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;
using System.Security.Principal;

namespace UnitTests.Application.Tests
{
    public class RequestServicesTests
    {
        private IMapper mapper;
        private List<Request> requestsTestData;
        private RequestParameter parameter;
        private Mock<IAuthenticationServices> mockService;
        private Mock<IEmailServices> mockEmailService;
        private Mock<IRequestRepository> mockRequestRepository;


        public RequestServicesTests()
        {
            var myProfile = new MappingProfile();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile(myProfile));
            mapper = new Mapper(configuration);
            requestsTestData = GetRequests();
            parameter = new RequestParameter();
            mockService = new Mock<IAuthenticationServices>();
            mockEmailService = new Mock<IEmailServices>();
            mockRequestRepository = new Mock<IRequestRepository>();
        }

        private List<Request> GetRequests()
        {
            var requests = new List<Request>();
            requests.Add(new Request
            {
                Id = 1,
                Description = "Test1",
                Type = UserRequestType.General,
                Status = UserRequestStatus.Pending,
                Response = "",
                CreatedByUserId = "0bd91055-41e3-42f0-921c-a3b7d5af829f"
            });
            requests.Add(new Request
            {
                Id = 2,
                Description = "Test2",
                Type = UserRequestType.Feedback,
                Status = UserRequestStatus.Rejected,
                Response = "",
                CreatedByUserId = "0bd91055-41e3-42f0-921c-a3b7d5af829f"
            });
            requests.Add(new Request
            {
                Id = 3,
                Description = "Test3",
                Type = UserRequestType.ReportInaccuracy,
                Status = UserRequestStatus.Approved,
                Response = "0bd91055-41e3-42f0-921c-a3b7d5af829f"
            });
            return requests;
        }

        public Mock<UserManager<User>> GetMockUserManager()
        {
            var userStoreMock = new Mock<IUserStore<User>>();
            return new Mock<UserManager<User>>(
                userStoreMock.Object, null, null, null, null, null, null, null, null);
        }

        [Fact]
        public async Task Adminstrator_GetAllRequests_ReturnRequestsList()
        {
            // Arrange
            bool trackChange = false;
            var mockRepo = new Mock<IRequestRepository>();
            mockRepo.Setup(repo => repo.GetAllRequests(parameter, trackChange))
                    .ReturnsAsync(requestsTestData);
            mockRepo.Setup(repo => repo.CountAll()).ReturnsAsync(3);

            mockService.Setup(x => x.GetCurrentUserAsync())
                        .ReturnsAsync(new User { Role = Role.Adminstrator });

            var service = new RequestServices(mockRepo.Object, mapper, mockService.Object);
            // Act            
            var result = await service.GetAllRequests(parameter, trackChange);
            // Assert
            Assert.Equal(3, result.Count());
            Assert.IsAssignableFrom<PagedList<RequestResponseDTO>>(result);
        }

        [Fact]
        public async Task User_GetAllRequests_ReturnRequestsList()
        {
            // Arrange
            bool trackChange = false;
            var mockRepo = new Mock<IRequestRepository>();
            mockService.Setup(x => x.GetCurrentUserAsync())
            .ReturnsAsync(new User
            {
                Id = "0bd91055-41e3-42f0-921c-a3b7d5af829f",
                Role = Role.User
            });
            var userId = mockService.Object.GetCurrentUserAsync().Result.Id;
            mockRepo.Setup(repo => repo.GetAllRequestByUserId(userId, parameter, trackChange))
                    .ReturnsAsync(requestsTestData);
            mockRepo.Setup(repo => repo.CountAll()).ReturnsAsync(3);

            var service = new RequestServices(mockRepo.Object, mapper, mockService.Object);
            // Act            
            var result = await service.GetAllRequestByUserId(userId, parameter, trackChange);
            // Assert
            Assert.Equal(3, result.Count());
            Assert.IsAssignableFrom<PagedList<RequestResponseDTO>>(result);
        }
    }
}
