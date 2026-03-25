using FluentValidation;
using MyTestApi.DTOs;

namespace MyTestApi.Validators
{
    public class UpdateProductDtoValidator : AbstractValidator<UpdateProductDto>
    {
        public UpdateProductDtoValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("Product name is required.")
                .MaximumLength(100).WithMessage("Product name can't exceed 100 characters."); 

            RuleFor(p => p.Price)
                .GreaterThan(0).WithMessage("Price must be greater than 0."); 
        }
    }
}