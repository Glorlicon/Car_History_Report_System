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

        public override IQueryable<CarRegistrationHistory> Filter(IQueryable<CarRegistrationHistory> query, CarRegistrationHistoryParameter parameter)
        {
            if (parameter.CarId != null)
                query = query.Where(x => x.CarId.Contains(parameter.CarId));
            if (parameter.OwnerName != null)
                query = query.Where(x => x.OwnerName.Contains(parameter.OwnerName));
            if (parameter.LicensePlateNumber != null)
                query = query.Where(x => x.LicensePlateNumber.Contains(parameter.LicensePlateNumber));
            if (parameter.RegistrationNumber != null)
                query = query.Where(x => x.RegistrationNumber.Contains(parameter.RegistrationNumber));
            if (parameter.ExpireDateStart != null)
                query = query.Where(x => x.ExpireDate >= parameter.ExpireDateStart);
            if (parameter.ExpireDateEnd != null)
                query = query.Where(x => x.ExpireDate <= parameter.ExpireDateEnd);
            return query;
        }
    }
}
