using Application.DTO.Authentication;
using Application.DTO.Car;
using Application.DTO.CarAccidentHistory;
using Application.DTO.CarInspectionHistory;
using Application.DTO.CarInsurance;
using Application.DTO.CarMaintainance;
using Application.DTO.CarOwnerHistory;
using Application.DTO.CarPart;
using Application.DTO.CarRecall;
using Application.DTO.CarReport;
using Application.DTO.CarServiceHistory;
using Application.DTO.CarSpecification;
using Application.DTO.CarStolenHistory;
using Application.DTO.DataProvider;
using Application.DTO.ModelMaintainance;
using Application.DTO.Order;
using Application.DTO.Request;
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
            CreateMap<ModelMaintainanceCreateRequestDTO, ModelMaintainance>();
            CreateMap<ModelMaintainance, ModelMaintainanceResponseDTO>();


            CreateMap<User, UserResponseDTO>()
            .ForMember(urr => urr.IsSuspended, opt => opt.MapFrom(src => src.LockoutEnabled));
            CreateMap<CreateUserRequestDTO, User>();
            CreateMap<UpdateUserRequestDTO, User>();
            CreateMap<UpdateUserOwnProfileRequestDTO, User>();

            CreateMap<DataProvider, DataProviderDetailsResponseDTO>()
                .ForMember(dp => dp.TypeName, opt => opt.MapFrom(x => x.Type.ToString()));
            CreateMap<Review, DataProviderReviewsResponseDTO>();
            CreateMap<DataProviderReviewCreateRequestDTO, Review>();
            CreateMap<WorkingTime, DataProviderWorkingTimesResponseDTO>();
            CreateMap<DataProviderCreateRequestDTO, DataProvider>();
            CreateMap<DataProviderUpdateRequestDTO, DataProvider>();
            CreateMap<DataProviderWorkingTimesCreateRequestDTO, WorkingTime>()
                .ForMember(dpwt => dpwt.StartTime, opt => opt.MapFrom(x => new TimeOnly(x.StartHour,x.StartMinute)))
                .ForMember(dpwt => dpwt.EndTime, opt => opt.MapFrom(x => new TimeOnly(x.EndHour,x.EndMinute)));
            CreateMap<DataProviderWorkingTimesUpdateRequestDTO, WorkingTime>()  
            .ForMember(dpwt => dpwt.StartTime, opt => opt.MapFrom(x => new TimeOnly(x.StartHour, x.StartMinute)))
                .ForMember(dpwt => dpwt.EndTime, opt => opt.MapFrom(x => new TimeOnly(x.EndHour, x.EndMinute)));


            CreateMap<CarCreateRequestDTO, Car>();
            CreateMap<CarUpdateRequestDTO, Car>();
            CreateMap<Car, CarResponseDTO>()
                .ForMember(c => c.ColorName, opt => opt.MapFrom(x => x.Color.ToString()));
            CreateMap<CarSalesInfoCreateRequestDTO, CarSalesInfo>();
            CreateMap<CarSalesInfoUpdateRequestDTO, CarSalesInfo>();
            CreateMap<CarSalesInfo, CarSalesInfoResponseDTO>()
                .ForMember(csi => csi.DataProvider, opt => opt.MapFrom(x => x.CreatedByUser.DataProvider));
            CreateMap<CarImages, CarImagesResponseDTO>();
            CreateMap<CarImagesCreateDTO, CarImages>();

            CreateMap<CarPartCreateRequestDTO, CarPart>();
            CreateMap<CarPartUpdateRequestDTO, CarPart>();
            CreateMap<CarPart, CarPartResponseDTO>()
                .ForMember(csr => csr.ManufacturerName, opt => opt.MapFrom(x => x.Manufacturer.Name));

            CreateMap<CarOwnerHistoryCreateRequestDTO, CarOwnerHistory>();
            CreateMap<CarOwnerHistoryUpdateRequestDTO, CarOwnerHistory>();
            CreateMap<CarOwnerHistory, CarOwnerHistoryResponseDTO>()
                .ForMember(c => c.DataSource, opt => opt.MapFrom(x => x.CreatedByUser.DataProvider.Name));

            CreateMap<RequestCreateRequestDTO, Request>();
            CreateMap<RequestUpdateRequestDTO, Request>();
            CreateMap<Request, RequestResponseDTO>();

            CreateMap<AddCarToTrackingListRequestDTO, CarMaintainance>();

            CreateMap<CarRecallCreateRequestDTO, CarRecall>();
            CreateMap<CarRecallUpdateRequestDTO, CarRecall>();
            CreateMap<CarRecall, CarRecallResponseDTO>();
            CreateMap<CarRecallStatus, CarRecallStatusResponseDTO>()
                .ForMember(c => c.Description, opt => opt.MapFrom(x => x.CarRecall.Description))
                .ForMember(c => c.ModelId, opt => opt.MapFrom(x => x.CarRecall.ModelId))
                .ForMember(c => c.RecallDate, opt => opt.MapFrom(x => x.CarRecall.RecallDate))
                .ForMember(c => c.Status, opt => opt.MapFrom(x => x.Status.ToString()));

            CreateMap<CarServiceHistory, CarServiceHistoryResponseDTO>()
                .ForMember(c => c.ServicesName, opt => opt.MapFrom(x => x.Services.ToString()));
            CreateMap<CarServiceHistoryCreateRequestDTO, CarServiceHistory>();
            CreateMap<CarServiceHistoryUpdateRequestDTO, CarServiceHistory>();

            CreateMap<Order, OrderResponseDTO>();
            CreateMap<OrderCreateRequestDTO, Order>();
            CreateMap<OrderOption, OrderOptionResponseDTO>();
            CreateMap<OrderOptionCreateRequestDTO, OrderOption>();
            CreateMap<OrderOptionUpdateRequestDTO, OrderOption>();

            CreateMap<CarReport, CarReportResponseDTO>();
            CreateMap<Car, CarReportDataResponseDTO>()
                .ForMember(c => c.NumberOfOpenRecalls, opt => opt.MapFrom(x => x.CarRecallStatuses.Count(s => s.Status == Domain.Enum.RecallStatus.Open)))
                .ForMember(c => c.NumberOfStolenRecords, opt => opt.MapFrom(x => x.CarStolenHistories.Count))
                .ForMember(c => c.NumberOfAccidentRecords, opt => opt.MapFrom(x => x.CarAccidentHistories.Count))
                .ForMember(c => c.NumberOfOwners, opt => opt.MapFrom(x => x.CarOwnerHistories.Count))
                .ForMember(c => c.NumberOfServiceHistoryRecords, opt => opt.MapFrom(x => x.CarServiceHistories.Count));

            CreateMap<CarAccidentHistory, CarAccidentHistoryResponseDTO>();

            CreateMap<CarInspectionHistory, CarInspectionHistoryResponseDTO>();

            CreateMap<CarInsurance, CarInsuranceResponseDTO>();

            CreateMap<CarStolenHistory, CarStolenHistoryResponseDTO>();
        }
    }
}
