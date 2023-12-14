using Application.Common;
using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.CarRecall;
using Application.DTO.CarTracking;
using Application.DTO.Notification;
using Application.DTO.Order;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests
{
    public class OrderServicesTests
    {
        private IMapper mapper;
        private List<Order> data;
        private List<OrderOption> OrderOptionData;
        private OrderParameter parameter;
        private Mock<IIdentityServices> mockIdentityService;


        public OrderServicesTests()
        {
            var myProfile = new MappingProfile();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile(myProfile));
            mapper = new Mapper(configuration);
            data = GetData();
            OrderOptionData = GetOrderOptionData();
            parameter = new OrderParameter();
            mockIdentityService = new Mock<IIdentityServices>();
        }

        private List<OrderOption> GetOrderOptionData()
        {
            return new List<OrderOption>
            {
                new OrderOption
                {
                    Id = 1,
                    Description = "Basic",
                    Name= "Basic",
                    ReportNumber= 1
                },
                new OrderOption
                {
                    Id = 2,
                    Description = "Good",
                    Name= "Good",
                    ReportNumber= 3
                },
                new OrderOption
                {
                    Id = 3,
                    Description = "Best",
                    Name= "Best",
                    ReportNumber = 5
                }
            };
        }

        private List<Order> GetData()
        {
            return new List<Order>
            {
                new Order
                {
                    Id = 1,
                    OrderOptionId = 1,
                    TransactionId = "T1",
                    UserId = "User1",
                    CreatedDate= DateTime.Now,
                },
                new Order
                {
                    Id = 2,
                    OrderOptionId = 2,
                    TransactionId = "T2",
                    UserId = "User1",
                    CreatedDate= DateTime.Now,
                },
                new Order
                {
                    Id = 3,
                    OrderOptionId = 3,
                    TransactionId = "T3",
                    UserId = "User1",
                    CreatedDate= DateTime.Now,
                },
                new Order
                {
                    Id = 4,
                    OrderOptionId = 1,
                    TransactionId = "T4",
                    UserId = "User2",
                    CreatedDate= DateTime.Now,
                },
                new Order
                {
                    Id = 5,
                    OrderOptionId = 3,
                    TransactionId = "T5",
                    UserId = "User2",
                    CreatedDate= DateTime.Now,
                },
            };
        }

        [Fact]
        public async Task GetAllOrders_ReturnsCarRecallsList()
        {
            // Arrange
            bool trackChange = false;
            var mockRepo = new Mock<IOrderRepository>();
            mockRepo.Setup(repo => repo.GetAllOrders(parameter, trackChange))
                    .ReturnsAsync(data);
            mockRepo.Setup(repo => repo.CountAll(parameter)).ReturnsAsync(5);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.OrderRepository)
                          .Returns(mockRepo.Object);
            var service = new OrderServices(mockUnitOfWork.Object, mapper, mockIdentityService.Object);
            // Act
            var result = await service.GetAllOrders(parameter);
            // Assert
            Assert.Equal(5, result.Count());
            Assert.Equal(5, result.PagingData.TotalCount);
            Assert.IsAssignableFrom<PagedList<OrderResponseDTO>>(result);
        }

        [Fact]
        public async Task GetOrder_ReturnsOrderResponse()
        {
            // Arrange
            bool trackChange = false;
            int id = 1;
            var mockRepo = new Mock<IOrderRepository>();
            mockRepo.Setup(repo => repo.GetOrderById(id, trackChange))
                    .ReturnsAsync(data.First);
            mockRepo.Setup(repo => repo.CountAll(parameter)).ReturnsAsync(3);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.OrderRepository)
                          .Returns(mockRepo.Object);
            var service = new OrderServices(mockUnitOfWork.Object, mapper, mockIdentityService.Object);
            // Act
            var result = await service.GetOrder(id);
            // Assert
            Assert.Equal(1, result.Id);
            Assert.Equal("T1", result.TransactionId);
            Assert.Equal(1, result.OrderOptionId);
            Assert.IsAssignableFrom<OrderResponseDTO>(result);
        }

        [Fact]
        public async Task GetOrder_ThrowNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            int id = 6;
            var mockRepo = new Mock<IOrderRepository>();
            mockRepo.Setup(repo => repo.GetOrderById(id, trackChange))
                    .ReturnsAsync(data.SingleOrDefault(x => x.Id == id));
            mockRepo.Setup(repo => repo.CountAll(parameter)).ReturnsAsync(3);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.OrderRepository)
                          .Returns(mockRepo.Object);
            var service = new OrderServices(mockUnitOfWork.Object, mapper, mockIdentityService.Object);
            // Act
            Func<Task> act = () => service.GetOrder(id);
            // Assert
            await Assert.ThrowsAsync<OrderNotFoundException>(act);
        }


        [Fact]
        public async Task CreateOrder_ThrowOrderOptionNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            var request = new OrderCreateRequestDTO
            {
                UserId = "User1",
                OrderOptionId = -1,
                TransactionId = "T6"
            };
            var mockRepo = new Mock<IOrderRepository>();

            var mockOrderOptionRepo = new Mock<IOrderOptionRepository>();
            mockOrderOptionRepo.Setup(repo => repo.GetOrderOptionById(request.OrderOptionId, trackChange))
                    .ReturnsAsync(OrderOptionData.SingleOrDefault(x => x.Id == request.OrderOptionId));

            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.OrderRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.OrderOptionRepository)
                          .Returns(mockOrderOptionRepo.Object);
            var service = new OrderServices(mockUnitOfWork.Object, mapper, mockIdentityService.Object);
            // Act
            Func<Task> act = () => service.CreateOrder(request);
            // Assert
            await Assert.ThrowsAsync<OrderOptionNotFoundException>(act);
        }

        [Fact]
        public async Task CreateOrder_ThrowUserNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            var request = new OrderCreateRequestDTO
            {
                UserId = "User1",
                OrderOptionId = 1,
                TransactionId = "T6"
            };
            var mockRepo = new Mock<IOrderRepository>();

            var mockOrderOptionRepo = new Mock<IOrderOptionRepository>();
            mockOrderOptionRepo.Setup(repo => repo.GetOrderOptionById(request.OrderOptionId, trackChange))
                    .ReturnsAsync(OrderOptionData.SingleOrDefault(x => x.Id == request.OrderOptionId));

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.GetUserByUserId(request.UserId, true))
                .ReturnsAsync(value: null);

            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.OrderRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.OrderOptionRepository)
                          .Returns(mockOrderOptionRepo.Object);
            mockUnitOfWork.Setup(uow => uow.UserRepository)
                        .Returns(mockUserRepository.Object);
            var service = new OrderServices(mockUnitOfWork.Object, mapper, mockIdentityService.Object);
            // Act
            Func<Task> act = () => service.CreateOrder(request);
            // Assert
            await Assert.ThrowsAsync<UserNotFoundException>(act);
        }

        [Fact]
        public async Task CreateOrder_ThrowOrderTransactionIdNotUniqueException()
        {
            // Arrange
            bool trackChange = false;
            var request = new OrderCreateRequestDTO
            {
                UserId = "User1",
                OrderOptionId = 1,
                TransactionId = "T1"
            };
            var mockRepo = new Mock<IOrderRepository>();
            mockRepo.Setup(repo => repo.IsExist(x => x.TransactionId == request.TransactionId))
                .ReturnsAsync(true);

            var mockOrderOptionRepo = new Mock<IOrderOptionRepository>();
            mockOrderOptionRepo.Setup(repo => repo.GetOrderOptionById(request.OrderOptionId, trackChange))
                    .ReturnsAsync(OrderOptionData.SingleOrDefault(x => x.Id == request.OrderOptionId));

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.GetUserByUserId(request.UserId, true))
                .ReturnsAsync(value: new User { Id = "User1"});

            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.OrderRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.OrderOptionRepository)
                          .Returns(mockOrderOptionRepo.Object);
            mockUnitOfWork.Setup(uow => uow.UserRepository)
                            .Returns(mockUserRepository.Object);
            var service = new OrderServices(mockUnitOfWork.Object, mapper, mockIdentityService.Object);
            // Act
            Func<Task> act = () => service.CreateOrder(request);
            // Assert
            await Assert.ThrowsAsync<OrderTransactionIdNotUniqueException>(act);
        }

        [Fact]
        public async Task CreateOrder_Guest_ReturnCreateOrderResult()
        {
            // Arrange
            bool trackChange = false;
            var request = new OrderCreateRequestDTO
            {
                UserId = null,
                OrderOptionId = 1,
                TransactionId = "T7",
                CarId = "Car1"
            };
            var mockRepo = new Mock<IOrderRepository>();
            mockRepo.Setup(repo => repo.IsExist(x => x.TransactionId == request.TransactionId))
                .ReturnsAsync(false);

            var mockOrderOptionRepo = new Mock<IOrderOptionRepository>();
            mockOrderOptionRepo.Setup(repo => repo.GetOrderOptionById(request.OrderOptionId, trackChange))
                    .ReturnsAsync(OrderOptionData.SingleOrDefault(x => x.Id == request.OrderOptionId));

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.GetUserByUserId(request.UserId, true))
                .ReturnsAsync(value: new User { Id = "User1" });

            mockIdentityService.Setup(service => service.CreateTokenForGuest(request.CarId))
                .Returns("TokenString");

            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.OrderRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.OrderOptionRepository)
                          .Returns(mockOrderOptionRepo.Object);
            mockUnitOfWork.Setup(uow => uow.UserRepository)
                            .Returns(mockUserRepository.Object);
            var service = new OrderServices(mockUnitOfWork.Object, mapper, mockIdentityService.Object);
            // Act
            var result = await service.CreateOrder(request);
            // Assert
            Assert.Equal("TokenString",result.Token);
            Assert.IsType<CreateOrderResult>(result);
        }

        [Fact]
        public async Task CreateOrder_User_ReturnCreateOrderResult()
        {
            // Arrange
            bool trackChange = false;
            var request = new OrderCreateRequestDTO
            {
                UserId = "User1",
                OrderOptionId = 1,
                TransactionId = "T6"
            };
            var mockRepo = new Mock<IOrderRepository>();
            mockRepo.Setup(repo => repo.IsExist(x => x.TransactionId == request.TransactionId))
                .ReturnsAsync(false);

            var mockOrderOptionRepo = new Mock<IOrderOptionRepository>();
            mockOrderOptionRepo.Setup(repo => repo.GetOrderOptionById(request.OrderOptionId, trackChange))
                    .ReturnsAsync(OrderOptionData.SingleOrDefault(x => x.Id == request.OrderOptionId));

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.GetUserByUserId(request.UserId, true))
                .ReturnsAsync(value: new User { Id = "User1" });

            mockIdentityService.Setup(service => service.CreateTokenForGuest(request.CarId))
                .Returns("TokenString");

            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.OrderRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.OrderOptionRepository)
                          .Returns(mockOrderOptionRepo.Object);
            mockUnitOfWork.Setup(uow => uow.UserRepository)
                            .Returns(mockUserRepository.Object);
            var service = new OrderServices(mockUnitOfWork.Object, mapper, mockIdentityService.Object);
            // Act
            var result = await service.CreateOrder(request);
            // Assert
            Assert.Equal(null, result.Token);
            Assert.IsType<CreateOrderResult>(result);
        }

        [Fact]
        public async Task GetAllOrderOptions_ReturnsAllOrderOptionsList()
        {
            // Arrange
            bool trackChange = false;
            var mockRepo = new Mock<IOrderOptionRepository>();
            mockRepo.Setup(repo => repo.GetAllOrderOptions(trackChange))
                    .ReturnsAsync(OrderOptionData);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.OrderOptionRepository)
                          .Returns(mockRepo.Object);
            var service = new OrderServices(mockUnitOfWork.Object, mapper, mockIdentityService.Object);
            // Act
            var result = await service.GetAllOrderOptions();
            // Assert
            Assert.Equal(3, result.Count());
            Assert.IsAssignableFrom<IEnumerable<OrderOptionResponseDTO>>(result);
        }

        [Fact]
        public async Task GetOrderOption_ReturnsOrderOptionResponse()
        {
            // Arrange
            bool trackChange = false;
            int id = 1;
            var mockRepo = new Mock<IOrderOptionRepository>();
            mockRepo.Setup(repo => repo.GetOrderOptionById(id, trackChange))
                    .ReturnsAsync(OrderOptionData.SingleOrDefault(x => x.Id == id));
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.OrderOptionRepository)
                          .Returns(mockRepo.Object);
            var service = new OrderServices(mockUnitOfWork.Object, mapper, mockIdentityService.Object);
            // Act
            var result = await service.GetOrderOption(id);
            // Assert
            Assert.Equal(1, result.Id);
            Assert.Equal("Basic", result.Name);
            Assert.IsAssignableFrom<OrderOptionResponseDTO>(result);
        }

        [Fact]
        public async Task GetOrderOption_ThrowNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            int id = 6;
            var mockRepo = new Mock<IOrderOptionRepository>();
            mockRepo.Setup(repo => repo.GetOrderOptionById(id, trackChange))
                    .ReturnsAsync(OrderOptionData.SingleOrDefault(x => x.Id == id));
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.OrderOptionRepository)
                          .Returns(mockRepo.Object);
            var service = new OrderServices(mockUnitOfWork.Object, mapper, mockIdentityService.Object);
            // Act
            Func<Task> act = () => service.GetOrderOption(id);
            // Assert
            await Assert.ThrowsAsync<OrderOptionNotFoundException>(act);
        }

        [Fact]
        public async Task UpdateOrderOption_ThrowNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            int id = 6;
            var request = new OrderOptionUpdateRequestDTO
            {
                Name= "name",
            };
            var mockRepo = new Mock<IOrderOptionRepository>();
            mockRepo.Setup(repo => repo.GetOrderOptionById(id, trackChange))
                    .ReturnsAsync(OrderOptionData.SingleOrDefault(x => x.Id == id));
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.OrderOptionRepository)
                          .Returns(mockRepo.Object);
            var service = new OrderServices(mockUnitOfWork.Object, mapper, mockIdentityService.Object);
            // Act
            Func<Task> act = () => service.UpdateOrderOption(id, request);
            // Assert
            await Assert.ThrowsAsync<OrderOptionNotFoundException>(act);
        }

        [Fact]
        public async Task DeleteOrderOption_ThrowNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            int id = 6;
            var mockRepo = new Mock<IOrderOptionRepository>();
            mockRepo.Setup(repo => repo.GetOrderOptionById(id, trackChange))
                    .ReturnsAsync(OrderOptionData.SingleOrDefault(x => x.Id == id));
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.OrderOptionRepository)
                          .Returns(mockRepo.Object);
            var service = new OrderServices(mockUnitOfWork.Object, mapper, mockIdentityService.Object);
            // Act
            Func<Task> act = () => service.DeleteOrderOption(id);
            // Assert
            await Assert.ThrowsAsync<OrderOptionNotFoundException>(act);
        }
    }
}
