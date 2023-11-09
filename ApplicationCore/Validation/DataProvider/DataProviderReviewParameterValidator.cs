using Application.DTO.DataProvider;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.DataProvider
{
    public class DataProviderReviewParameterValidator : AbstractValidator<DataProviderReviewParameter>
    {
        public DataProviderReviewParameterValidator()
        {
            RuleFor(x => x.DataProviderId)
                .NotNull()
                .NotEmpty()
                .WithMessage("Data Provider Id is required");
            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5)
                .WithMessage("Rating can only be in range of [0,5]");
            RuleFor(x => x.SortByDataProviderId)
                .InclusiveBetween(-1, 1)
                .WithMessage("Can only be -1 for descending, 1 for ascending, 0 for not sorting");            
            RuleFor(x => x.SortByDate)
                .InclusiveBetween(-1, 1)
                .WithMessage("Can only be -1 for descending, 1 for ascending, 0 for not sorting");            
            RuleFor(x => x.SortByRating)
                .InclusiveBetween(-1, 1)
                .WithMessage("Can only be -1 for descending, 1 for ascending, 0 for not sorting");
        }
    }
}
