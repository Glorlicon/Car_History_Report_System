﻿using Domain.Entities;
using System;
using System.Collections.Generic;
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

        public int? CarDealerId { get; set; }
        public string? CarDealerName { get; set; }
    }
}
