using Application.DTO.CarOwnerHistory;
using Application.DTO.CarServiceHistory;
using Application.DTO.CarStolenHistory;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarStolenHistory
{
    public class CarStolenHistoryCreateRequestDTOValidator : AbstractValidator<CarStolenHistoryCreateRequestDTO>
    {
        public CarStolenHistoryCreateRequestDTOValidator()
        {

        }
    }
}
