using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IUnitOfWork
    {
        ICarRepository CarRepository { get; }
        ICarSpecificationRepository CarSpecificationRepository { get; }
        IUserRepository UserRepository { get; }
        IDataProviderRepository DataProviderRepository { get; }

        ICarSalesInfoRepository CarSalesInfoRepository { get; }

        Task SaveAsync();
    }
}
