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
    public class OrderOptionRepository : BaseRepository<OrderOption>, IOrderOptionRepository
    {
        protected ApplicationDBContext repositoryContext;
        public OrderOptionRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public async Task<IEnumerable<OrderOption>> GetAllOrderOptions(bool trackChange)
        {
            return await FindAll(trackChange)
                            .ToListAsync();
        }

        public async Task<OrderOption> GetOrderOptionById(int id, bool trackChange)
        {
            return await FindByCondition(x => x.Id == id, trackChange)
                            .SingleOrDefaultAsync();
        }
    }
}
