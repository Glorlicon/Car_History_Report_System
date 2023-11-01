using Application.DTO.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IPaymentServices
    {
        Task<bool> DoPayment(OrderCreateRequestDTO request);
    }
}
