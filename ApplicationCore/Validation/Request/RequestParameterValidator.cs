using Application.DTO.Car;
using Application.DTO.Request;
using Domain.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.Request
{
    public class RequestParameterValidator : AbstractValidator<RequestParameter>
    {
        public RequestParameterValidator()
        {
            RuleFor(x => x.RequestStatus).IsInEnum().WithMessage("Status can only be in range of [0,2]");
            RuleFor(x => x.RequestType).IsInEnum().WithMessage("Type can only be in range of [0,4]");
            RuleFor(x => x.SortByDate).InclusiveBetween(-1, 1).WithMessage("Can only be -1 for descending, 1 for ascending, 0 for not sorting");
        }
    }
}


