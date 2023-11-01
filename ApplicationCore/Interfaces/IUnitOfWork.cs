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

        ICarPartRepository CarPartRepository { get; }

        ICarOwnerHistoryRepository CarOwnerHistoryRepository { get; }

        ICarMaintainanceRepository CarMaintainanceRepository { get; }

        ICarRecallRepository CarRecallRepository { get; }

        ICarRecallStatusRepository CarRecallStatusRepository { get; }

        IOrderRepository OrderRepository { get; }

        IOrderOptionRepository OrderOptionRepository { get; }

        Task SaveAsync();
    }
}
