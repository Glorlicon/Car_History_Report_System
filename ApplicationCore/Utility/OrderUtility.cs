using Application.DTO.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Utility
{
    public static class OrderUtility
    {
        public static decimal CalculateTotalAmount(OrderOptionCreateRequestDTO request)
        {
            decimal discount = 0;
            if(request.DiscountStart != null && request.DiscountEnd != null)
            {
                var today = DateOnly.FromDateTime(DateTime.Now);
                if (request.DiscountStart <= today && request.DiscountEnd >= today)
                    discount = request.Discount;
            }
            var totalAmount = request.Price - request.Price * discount / 100;
            return totalAmount;
        }

        public static decimal CalculateTotalAmount(OrderOptionUpdateRequestDTO request)
        {
            decimal discount = 0;
            if (request.DiscountStart != null && request.DiscountEnd != null)
            {
                var today = DateOnly.FromDateTime(DateTime.Now);
                if (request.DiscountStart <= today && request.DiscountEnd >= today)
                    discount = request.Discount;
            }
            var totalAmount = request.Price - request.Price * discount / 100;
            return totalAmount;
        }
    }
}
