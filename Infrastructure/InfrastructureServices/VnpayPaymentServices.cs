using Application.DTO.Order;
using Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.InfrastructureServices
{
    public class VnpayPaymentServices : IPaymentServices
    {
        public Task<bool> DoPayment(OrderCreateRequestDTO request)
        {
            return Task.FromResult(true);
        }
    }
}
