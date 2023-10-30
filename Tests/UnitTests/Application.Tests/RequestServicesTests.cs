using Application.Common;
using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.Request;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
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
        private Mock<IPrincipal> mockPrincipal;


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
            mockPrincipal = new Mock<IPrincipal>();
        }

        private List<Request> GetRequests()
        {
            var requests = new List<Request>();
            requests.Add(new Request
            {
                Id = 1,
                Description = "Test1",
                Type = Domain.Enum.UserRequestType.General,
                Status = Domain.Enum.UserRequestStatus.Pending,
                Response = ""
            });
            requests.Add(new Request
            {
                Id = 2,
                Description = "Test2",
                Type = Domain.Enum.UserRequestType.Feedback,
                Status = Domain.Enum.UserRequestStatus.Rejected,
                Response = ""
            });            
            requests.Add(new Request
            {
                Id = 3,
                Description = "Test3",
                Type = Domain.Enum.UserRequestType.ReportInaccuracy,
                Status = Domain.Enum.UserRequestStatus.Approved,
                Response = ""      
            });
            return requests;
        }

        public Mock<UserManager<User>> GetMockUserManager()
        {
            var userStoreMock = new Mock<IUserStore<User>>();
            return new Mock<UserManager<User>>(
                userStoreMock.Object, null, null, null, null, null, null, null, null);
        }

        //[Fact]
        //public async Task GetAllRequests_ReturnRequestsList()
        //{
        //    // Arrange
        //    bool trackChange = false;
        //    var mockRepo = new Mock<IRequestRepository>();
        //    mockRepo.Setup(repo => repo.GetAllRequests(parameter, trackChange))
        //            .ReturnsAsync(requestsTestData);
        //    mockRepo.Setup(repo => repo.CountAll()).ReturnsAsync(3);

        //    var user = new User() { UserName = "datng1412"};

        //    var claims = new List<Claim>()
        //    {
        //        new Claim(ClaimTypes.Name, user.UserName),
        //        new Claim(ClaimTypes.NameIdentifier, user.Id),
        //        new Claim("name", user.UserName),
        //    };
        //    var identity = new ClaimsIdentity(claims, "Test");
        //    var claimsPrincipal = new ClaimsPrincipal(identity);
        //    var mockPrincipal = new Mock<IPrincipal>();
        //    mockPrincipal.Setup(x => x.Identity).Returns(identity);
        //    mockPrincipal.Setup(x => x.IsInRole(It.IsAny<string>())).Returns(true);
        //    var mockHttpContext = new Mock<HttpContext>();
        //    mockHttpContext.Setup(m => m.User).Returns(claimsPrincipal);
        //    Mock<UserManager<User>> userMgr = GetMockUserManager();
        //    userMgr.Setup(x => x.FindByNameAsync(It.IsAny<string>())).ReturnsAsync(user);
        //    var service = new RequestServices(mockRepo.Object, mapper, mockService.Object);
        //    // Act            
        //    var result = await service.GetAllRequests(parameter, trackChange);
        //    // Assert
        //    Assert.Equal(3, result.Count());
        //    Assert.IsAssignableFrom<PagedList<RequestResponseDTO>>(result);
        //}
    }
}
