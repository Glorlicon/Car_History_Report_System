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
        private RequestUpdateRequestDTO requestUpdate;
        private Mock<IAuthenticationServices> mockService;
        private Mock<INotificationServices> mockNotificationService;
        private Mock<IEmailServices> mockEmailService;
        private Mock<IRequestRepository> mockRequestRepository;


        public RequestServicesTests()
        {
            var myProfile = new MappingProfile();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile(myProfile));
            mapper = new Mapper(configuration);
            requestsTestData = GetRequests();
            parameter = new RequestParameter();
            requestUpdate = new RequestUpdateRequestDTO();
            mockService = new Mock<IAuthenticationServices>();
            mockEmailService = new Mock<IEmailServices>();
            mockRequestRepository = new Mock<IRequestRepository>();
            mockNotificationService = new Mock<INotificationServices>();
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
                Response = "0bd91055-41e3-42f0-921c-a3b7d5af829a",
                CreatedByUserId = "0000000000"
            });
            return requests;
        }


        private List<Request> GetRequestsCreatedByUserId(string userId)
        {
            return requestsTestData.Where(x => x.CreatedByUserId == userId).ToList();
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

            var service = new RequestServices(mockRepo.Object, mapper, mockService.Object, mockNotificationService.Object);
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
                    .ReturnsAsync(GetRequestsCreatedByUserId(userId));
            mockRepo.Setup(repo => repo.CountByCondition(cs => cs.CreatedByUserId == userId, parameter))
            .ReturnsAsync(2);

            var service = new RequestServices(mockRepo.Object, mapper, mockService.Object, mockNotificationService.Object);
            // Act            
            var result = await service.GetAllRequests(parameter, trackChange);
            // Assert
            Assert.Equal(2, result.Count());
            Assert.IsAssignableFrom<PagedList<RequestResponseDTO>>(result);
        }

        [Fact]
        public async Task GetAllRequestByUserId_ReturnRequestsList()
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
                    .ReturnsAsync(GetRequestsCreatedByUserId(userId));
            mockRepo.Setup(repo => repo.CountByCondition(cs => cs.CreatedByUserId == userId, parameter))
            .ReturnsAsync(2);

            var service = new RequestServices(mockRepo.Object, mapper, mockService.Object, mockNotificationService.Object);
            // Act            
            var result = await service.GetAllRequestByUserId(userId, parameter, trackChange);
            // Assert
            Assert.Equal(2, result.Count());
            Assert.IsAssignableFrom<PagedList<RequestResponseDTO>>(result);
        }

        [Fact]
        public async Task GetRequest_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            int id = 1;
            var mockRepo = new Mock<IRequestRepository>();
            mockRepo.Setup(repo => repo.GetRequestById(id, trackChange))
                    .ReturnsAsync(value: null);
            mockService.Setup(x => x.GetCurrentUserAsync())
.ReturnsAsync(new User
{
    Id = "0bd91055-41e3-42f0-921c-a3b7d5af829f",
    Role = Role.User
});
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Object);
            var service = new RequestServices(mockRepo.Object, mapper, mockService.Object, mockNotificationService.Object);
            // Act
            Func<Task> act = () => service.GetRequest(id, trackChange);
            // Assert
            await Assert.ThrowsAsync<RequestNotFoundException>(act);
        }

        [Fact]
        public async Task DeleteRequest_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = true;
            int id = 10;
            var mockRepo = new Mock<IRequestRepository>();
            mockRepo.Setup(repo => repo.GetRequestById(id, trackChange))
                    .ReturnsAsync(value: null);
            mockService.Setup(x => x.GetCurrentUserAsync())
                .ReturnsAsync(new User
                {
                    Id = "0bd91055-41e3-42f0-921c-a3b7d5af829f",
                    Role = Role.User
                });
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Object);
            var service = new RequestServices(mockRepo.Object, mapper, mockService.Object, mockNotificationService.Object);
            // Act
            Func<Task> act = () => service.DeleteRequest(id);
            // Assert
            await Assert.ThrowsAsync<RequestNotFoundException>(act);
        }

        [Fact]
        public async Task DeleteRequest_ReturnsTrue()
        {
            // Arrange
            bool trackChange = true;
            int id = 1;
            var mockRepo = new Mock<IRequestRepository>();
            mockService.Setup(x => x.GetCurrentUserAsync())
                .ReturnsAsync(new User
                {
                    Id = "0bd91055-41e3-42f0-921c-a3b7d5af829f",
                    Role = Role.User
                });
            mockRepo.Setup(repo => repo.GetRequestById(id, trackChange))
                    .ReturnsAsync(requestsTestData.First());

            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Object);
            var service = new RequestServices(mockRepo.Object, mapper, mockService.Object, mockNotificationService.Object);
            // Act
            var result = await service.DeleteRequest(id);
            // Asserts
            Assert.True(result);
        }
        
        [Fact]
        public async Task UpdateRequest_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = true;
            int id = 10;
            var mockRepo = new Mock<IRequestRepository>();
            mockRepo.Setup(repo => repo.GetRequestById(id, trackChange))
                    .ReturnsAsync(value: null);
            mockService.Setup(x => x.GetCurrentUserAsync())
                .ReturnsAsync(new User
                {
                    Id = "0bd91055-41e3-42f0-921c-a3b7d5af829f",
                    Role = Role.User
                });
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Object);
            var service = new RequestServices(mockRepo.Object, mapper, mockService.Object, mockNotificationService.Object);
            // Act
            Func<Task> act = () => service.UpdateRequest(id, requestUpdate);
            // Assert
            await Assert.ThrowsAsync<RequestNotFoundException>(act);
        }

        [Fact]
        public async Task UpdateRequest_ReturnsTrue()
        {
            // Arrange
            bool trackChange = true;
            int id = 1;
            var mockRepo = new Mock<IRequestRepository>();
            mockService.Setup(x => x.GetCurrentUserAsync())
                .ReturnsAsync(new User
                {
                    Id = "0bd91055-41e3-42f0-921c-a3b7d5af829f",
                    Role = Role.User
                });
            mockRepo.Setup(repo => repo.GetRequestById(id, trackChange))
                    .ReturnsAsync(requestsTestData.First());

            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Object);
            var service = new RequestServices(mockRepo.Object, mapper, mockService.Object, mockNotificationService.Object);
            // Act
            var result = await service.UpdateRequest(id, requestUpdate);
            // Asserts
            Assert.True(result);
        }

        [Fact]
        public async Task User_GetRequest_ReturnsRequest()
        {
            // Arrange
            bool trackChange = false;
            int id = 1;
            var mockRepo = new Mock<IRequestRepository>();
            mockService.Setup(x => x.GetCurrentUserAsync())
                .ReturnsAsync(new User
                {
                    Id = "0bd91055-41e3-42f0-921c-a3b7d5af829f",
                    Role = Role.User
                });
            var userId = mockService.Object.GetCurrentUserAsync().Result.Id;
            mockRepo.Setup(repo => repo.GetRequestByIdAndUserId(id, userId, trackChange))
                    .ReturnsAsync(requestsTestData.First());

            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Object);
            var service = new RequestServices(mockRepo.Object, mapper, mockService.Object, mockNotificationService.Object);
            // Act
            var result = await service.GetRequest(id, trackChange);
            // Asserts
            Assert.IsAssignableFrom<RequestResponseDTO>(result);
            Assert.Equal(id, result.Id);
        }

        [Fact]
        public async Task Admin_GetRequest_ReturnsRequest()
        {
            // Arrange
            bool trackChange = false;
            int id = 1;
            var mockRepo = new Mock<IRequestRepository>();
            mockService.Setup(x => x.GetCurrentUserAsync())
                .ReturnsAsync(new User
                {
                    Id = "0bd91055-41e3-42f0-921c-a3b7d5af829f",
                    Role = Role.Adminstrator
                });
            var userId = mockService.Object.GetCurrentUserAsync().Result.Id;
            mockRepo.Setup(repo => repo.GetRequestById(id, trackChange))
                    .ReturnsAsync(requestsTestData.First());

            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Object);
            var service = new RequestServices(mockRepo.Object, mapper, mockService.Object, mockNotificationService.Object);
            // Act
            var result = await service.GetRequest(id, trackChange);
            // Asserts
            Assert.IsAssignableFrom<RequestResponseDTO>(result);
            Assert.Equal(id, result.Id);
        }
    }
}
