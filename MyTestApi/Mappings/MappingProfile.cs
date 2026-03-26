using AutoMapper;
using MyTestApi.DTOs;
using MyTestApi.Models;
namespace MyTestApi.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImagePath));
            CreateMap<CreateProductDto, Product>();
            CreateMap<UpdateProductDto, Product>();
 

        }
    }
}