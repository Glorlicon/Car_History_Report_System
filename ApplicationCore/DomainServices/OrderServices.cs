using Application.Common.Models;
using Application.DTO.Car;
using Application.DTO.Order;
using Application.Interfaces;
using Application.Utility;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace Application.DomainServices
{
    public class OrderServices : IOrderServices
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public OrderServices(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedList<OrderResponseDTO>> GetAllOrders(OrderParameter parameter)
        {
            var orders = await _unitOfWork.OrderRepository.GetAllOrders(parameter, false);
            var ordersResponse = _mapper.Map<List<OrderResponseDTO>>(orders);
            var count = await _unitOfWork.OrderRepository.CountAll();
            return new PagedList<OrderResponseDTO>(ordersResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<OrderResponseDTO> GetOrder(int id)
        {
            var order = await _unitOfWork.OrderRepository.GetOrderById(id, trackChange: false);
            if (order is null)
            {
                throw new OrderNotFoundException(id);
            }
            var orderResponse = _mapper.Map<OrderResponseDTO>(order);
            return orderResponse;
        }

        public async Task<PagedList<OrderResponseDTO>> GetOrdersByUserId(string userId, OrderParameter parameter)
        {
            var orders = await _unitOfWork.OrderRepository.GetOrderByUserId(userId, parameter, false);
            var ordersResponse = _mapper.Map<List<OrderResponseDTO>>(orders);
            var count = await _unitOfWork.OrderRepository.CountByCondition(x => x.UserId == userId);
            return new PagedList<OrderResponseDTO>(ordersResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }
        public async Task<int> CreateOrder(OrderCreateRequestDTO request)
        {
            var orderOption = await _unitOfWork.OrderOptionRepository.GetOrderOptionById(request.OrderOptionId, trackChange: false);
            if (orderOption is null)
            {
                throw new OrderOptionNotFoundException(request.OrderOptionId);
            }
            if(request.UserId != null)
            {
                var user = await _unitOfWork.UserRepository.GetUserByUserId(request.UserId, trackChanges: true);
                if(user is null)
                {
                    throw new UserNotFoundException($"User with id {request.UserId} not found");
                }
                // add report number to user
                user.MaxReportNumber += orderOption.ReportNumber;
            }
            var isTransactionIdNotUnique = await _unitOfWork.OrderRepository.IsExist(x => x.TransactionId == request.TransactionId);
            if(isTransactionIdNotUnique)
            {
                throw new OrderTransactionIdNotUniqueException();
            }
            var order = _mapper.Map<Order>(request);
            order.CreatedDate= DateTime.Now;
            _unitOfWork.OrderRepository.Create(order);
            // do payment
            await _unitOfWork.SaveAsync();
            return order.Id;
        }

        public async Task<IEnumerable<OrderOptionResponseDTO>> GetAllOrderOptions()
        {
            var orderOptions = await _unitOfWork.OrderOptionRepository.GetAllOrderOptions(trackChange: false);
            var orderOptionsResponse = _mapper.Map<List<OrderOptionResponseDTO>>(orderOptions);
            return orderOptionsResponse;
        }
        public async Task<OrderOptionResponseDTO> GetOrderOption(int id)
        {
            var orderOption = await _unitOfWork.OrderOptionRepository.GetOrderOptionById(id, trackChange: false);
            if (orderOption is null)
            {
                throw new OrderOptionNotFoundException(id);
            }
            var orderOptionResponse = _mapper.Map<OrderOptionResponseDTO>(orderOption);
            return orderOptionResponse;
        }

        public async Task<int> CreateOrderOption(OrderOptionCreateRequestDTO request)
        {
            var orderOption = _mapper.Map<OrderOption>(request);
            orderOption.TotalAmount = OrderUtility.CalculateTotalAmount(request);
            _unitOfWork.OrderOptionRepository.Create(orderOption);
            await _unitOfWork.SaveAsync();
            return orderOption.Id;
        }

        public async Task UpdateOrderOption(int id, OrderOptionUpdateRequestDTO request)
        {
            var orderOption = await _unitOfWork.OrderOptionRepository.GetOrderOptionById(id, trackChange: true);
            if (orderOption is null)
            {
                throw new OrderOptionNotFoundException(id);
            }
            _mapper.Map(request, orderOption);
            orderOption.TotalAmount = OrderUtility.CalculateTotalAmount(request);
            await _unitOfWork.SaveAsync();
        }

        public async Task DeleteOrderOption(int id)
        {
            var orderOption = await _unitOfWork.OrderOptionRepository.GetOrderOptionById(id, trackChange: true);
            if (orderOption is null)
            {
                throw new OrderOptionNotFoundException(id);
            }
            _unitOfWork.OrderOptionRepository.Delete(orderOption);
            await _unitOfWork.SaveAsync();
        }
    }
}
