using Application.DTO.Order;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class OrderRepository : BaseRepository<Order>, IOrderRepository
    {
        protected ApplicationDBContext repositoryContext;
        public OrderRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public async Task<IEnumerable<Order>> GetAllOrders(OrderParameter parameter, bool trackChange)
        {
            return await FindAll(trackChange)
                            .Include(x => x.OrderOption)
                            .OrderByDescending(x => x.CreatedDate)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        public async Task<Order> GetOrderById(int id, bool trackChange)
        {
            return await FindByCondition(x => x.Id == id,trackChange)
                            .Include(x => x.OrderOption)
                            .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<Order>> GetOrderByUserId(string userId, OrderParameter parameter, bool trackChange)
        {
            return await FindByCondition(x => x.UserId == userId, trackChange)
                            .Include(x => x.OrderOption)  
                            .OrderByDescending(x => x.CreatedDate)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }
    }
}
