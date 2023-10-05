using Application.DTO.Authentication;
using Application.DTO.CarSpecification;
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
                .ForMember(csr => csr.ManufacturerName, opt => opt.MapFrom(x => x.Manufacturer.Name))
                .ForMember(csr => csr.FuelType, opt => opt.MapFrom(x => x.FuelType.ToString()))
                .ForMember(csr => csr.BodyType, opt => opt.MapFrom(x => x.BodyType.ToString()));
            CreateMap<User, UserResponseDTO>();
            CreateMap<User, CreateUserRequestDTO>();
            CreateMap<CreateUserRequestDTO, User>();
            CreateMap<UpdateUserRequestDTO, User>();

        }
    }
}
