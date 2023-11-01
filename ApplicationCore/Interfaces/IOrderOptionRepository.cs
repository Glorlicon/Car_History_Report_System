using Application.DTO.Order;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IOrderOptionRepository : IBaseRepository<OrderOption>
    {
        Task<IEnumerable<OrderOption>> GetAllOrderOptions(bool trackChange);
        Task<OrderOption> GetOrderOptionById(int id, bool trackChange);
    }
}
