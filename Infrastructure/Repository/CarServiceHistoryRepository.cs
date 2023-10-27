using Application.DTO.CarServiceHistory;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.DBContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class CarServiceHistoryRepository : CarHistoryRepository<CarServiceHistory, CarServiceHistoryParameter>, ICarServiceHistoryRepository
    {
        protected ApplicationDBContext repositoryContext;
        public CarServiceHistoryRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public override IQueryable<CarServiceHistory> Sort(IQueryable<CarServiceHistory> query, CarServiceHistoryParameter parameter)
        {
            return query.OrderByDescending(x => x.ServiceTime);
        }
    }
}
