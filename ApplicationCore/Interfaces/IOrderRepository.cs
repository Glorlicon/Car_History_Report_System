﻿using Application.DTO.Order;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IOrderRepository : IBaseRepository<Order>
    {
        Task<IEnumerable<Order>> GetAllOrders(OrderParameter parameter, bool trackChange);
        Task<Order> GetOrderById(int id, bool trackChange);

        Task<IEnumerable<Order>> GetOrderByUserId(string userId, OrderParameter parameter, bool trackChange);
        Task<int> CountAll(OrderParameter parameter);
        Task<int> CountByCondition(Expression<Func<Order, bool>> expression, OrderParameter parameter);
    }
}
