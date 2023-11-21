using Application.DTO.CarInspectionHistory;
using Application.DTO.CarRegistrationHistory;
using Domain.Entities;
using Infrastructure.DBContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class CarRegistrationHistoryRepository : CarHistoryRepository<CarRegistrationHistory, CarRegistrationHistoryParameter>
    {
        protected ApplicationDBContext repositoryContext;
        public CarRegistrationHistoryRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }
    }
}
