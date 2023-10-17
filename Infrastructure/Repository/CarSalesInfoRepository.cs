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
    public class CarSalesInfoRepository : BaseRepository<CarSalesInfo>, ICarSalesInfoRepository
    {
        protected ApplicationDBContext repositoryContext;
        public CarSalesInfoRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }
    }
}
