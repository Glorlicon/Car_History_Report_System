using Application.DTO.DataProvider;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Car
{
    public class CarSalesInfoResponseDTO
    {
        public string Description { get; set; }

        public List<string> Features { get; set; }

        public decimal Price { get; set; }

        public DataProviderDetailsResponseDTO DataProvider { get; set; }
    }
}
