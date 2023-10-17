using Application.DTO.Authentication;
using Application.DTO.Car;
using Application.DTO.CarSpecification;
using Application.DTO.DataProvider;
using Application.DTO.User;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<RegistrationRequestDTO, User>();
            CreateMap<CarSpecificationCreateRequestDTO, CarSpecification>();
            CreateMap<CarSpecificationUpdateRequestDTO, CarSpecification>();
            CreateMap<CarSpecification, CarSpecificationResponseDTO>()
                .ForMember(csr => csr.ManufacturerName, opt => opt.MapFrom(x => x.Manufacturer.Name));
            CreateMap<User, UserResponseDTO>()
            .ForMember(urr => urr.IsSuspended, opt => opt.MapFrom(src => src.LockoutEnabled));
            CreateMap<User, CreateUserRequestDTO>();
            CreateMap<CreateUserRequestDTO, User>();
            CreateMap<UpdateUserRequestDTO, User>();

            CreateMap<DataProviderCreateRequestDTO, DataProvider>();
            CreateMap<DataProviderUpdateRequestDTO, DataProvider>();
            CreateMap<DataProvider, DataProviderResponseDTO>()
                .ForMember(dp => dp.TypeName, opt => opt.MapFrom(x => x.Type.ToString()));

            CreateMap<CarCreateRequestDTO, Car>();
            CreateMap<CarUpdateRequestDTO, Car>();
            CreateMap<Car, CarResponseDTO>()
                .ForMember(c => c.ColorName, opt => opt.MapFrom(x => x.Color.ToString()));
            CreateMap<CarSalesInfoCreateRequestDTO, CarSalesInfo>();
            CreateMap<CarSalesInfoUpdateRequestDTO, CarSalesInfo>();
            CreateMap<CarSalesInfo, CarSalesInfoResponseDTO>();
            CreateMap<CarImages, CarImagesResponseDTO>();
            CreateMap<CarImagesCreateDTO, CarImages>();
        }
    }
}
