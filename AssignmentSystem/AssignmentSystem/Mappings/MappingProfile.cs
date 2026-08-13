using AssignmentSystem.DTOs.AcademicClass;
using AssignmentSystem.DTOs.Assignment;
using AssignmentSystem.DTOs.Role;
using AssignmentSystem.DTOs.Subject;
using AssignmentSystem.DTOs.Submission;
using AssignmentSystem.DTOs.TeacherClassSubject;
using AssignmentSystem.DTOs.User;
using AssignmentSystem.Entities;
using AutoMapper;

namespace AssignmentSystem.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
            CreateMap<CreateUserDto, User>();

            CreateMap<UpdateUserDto, User>();

            CreateMap<User, UserResponseDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.Name));

            CreateMap<User, UserListDto>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.Name));

            CreateMap<User, DropdownDto>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"));

            CreateMap<AcademicClass, AcademicClassResponseDto>();
            CreateMap<CreateAcademicClassDto, AcademicClass>();
            CreateMap<UpdateAcademicClassDto, AcademicClass>();
            CreateMap<CreateSubjectDto, Subject>();
            CreateMap<UpdateSubjectDto, Subject>();
            CreateMap<Subject, SubjectResponseDto>();
            CreateMap<CreateTeacherClassSubjectDto, TeacherClassSubject>();
            CreateMap<UpdateTeacherClassSubjectDto, TeacherClassSubject>();
            CreateMap<TeacherClassSubject, TeacherClassSubjectResponseDto>()
                .ForMember(d => d.TeacherName,
                    o => o.MapFrom(s => s.Teacher.FirstName + " " + s.Teacher.LastName))
                .ForMember(d => d.AcademicClassName,
                    o => o.MapFrom(s => s.AcademicClass.Name))
                .ForMember(d => d.SubjectCode,
                    o => o.MapFrom(s => s.Subject.Code))
                .ForMember(d => d.SubjectName,
                    o => o.MapFrom(s => s.Subject.Name));
            CreateMap<CreateAssignmentDto, Assignment>();

            CreateMap<UpdateAssignmentDto, Assignment>();

            CreateMap<Assignment, AssignmentResponseDto>()
                .ForMember(d => d.TeacherName,
                    o => o.MapFrom(s =>
                        s.TeacherClassSubject.Teacher.FirstName + " " +
                        s.TeacherClassSubject.Teacher.LastName))

                .ForMember(d => d.Class,
                    o => o.MapFrom(s =>
                        s.TeacherClassSubject.AcademicClass.Name))

                .ForMember(d => d.SubjectName,
                    o => o.MapFrom(s =>
                        s.TeacherClassSubject.Subject.Name));
            
            CreateMap<Role, DropdownDto>();
            CreateMap<Subject, DropdownDto>();
            CreateMap<AcademicClass, DropdownDto>();
            CreateMap<CreateSubmissionDto, Submission>();
            CreateMap<Submission, SubmissionResponseDto>()
                .ForMember(d => d.AssignmentTitle,
                    o => o.MapFrom(s => s.Assignment.Title))
                .ForMember(d => d.SubjectName,
                    o => o.MapFrom(s => s.Assignment.TeacherClassSubject.Subject.Name))
                .ForMember(d => d.Class,
                    o => o.MapFrom(s => s.Assignment.TeacherClassSubject.AcademicClass.Name))
                .ForMember(d => d.TeacherName,
                    o => o.MapFrom(s =>
                        s.Assignment.TeacherClassSubject.Teacher.FirstName + " " +
                        s.Assignment.TeacherClassSubject.Teacher.LastName))
                .ForMember(d => d.Deadline,
                    o => o.MapFrom(s => s.Assignment.Deadline))
                .ForMember(d => d.StudentName,
                    o => o.MapFrom(s => s.Student.FirstName + " " + s.Student.LastName));
        }
    }
}
