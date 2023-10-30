using Application.Common.Models;
using Application.DTO.Car;
using Application.DTO.CarOwnerHistory;
using Application.DTO.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IOrderServices
    {
        Task<PagedList<OrderResponseDTO>> GetAllOrders(OrderParameter parameter);

        Task<PagedList<OrderResponseDTO>> GetOrdersByUserId(string userId, OrderParameter parameter);

        Task<OrderResponseDTO> GetOrder(int id);

        Task<int> CreateOrder(OrderCreateRequestDTO request);

        Task<IEnumerable<OrderOptionResponseDTO>> GetAllOrderOptions();

        Task<OrderOptionResponseDTO> GetOrderOption(int id);

        Task<int> CreateOrderOption(OrderOptionCreateRequestDTO request);

        Task UpdateOrderOption(int id, OrderOptionUpdateRequestDTO request);

        Task DeleteOrderOption(int id);
    }
}
