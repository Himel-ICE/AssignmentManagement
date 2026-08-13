using AssignmentSystem.DTOs.TeacherClassSubject;
using AssignmentSystem.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentSystem.Controllers
{
    [Route("api/teacher-class-subject")]
    [ApiController]
    [Authorize]
    public class TeacherClassSubjectController : ControllerBase
    {
        private readonly ITeacherClassSubjectService _service;

        public TeacherClassSubjectController(
            ITeacherClassSubjectService service)
        {
            _service = service;
        }

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateTeacherClassSubjectDto dto)
        {
            var result = await _service.CreateAsync(dto);

            return StatusCode(result.StatusCode, result);
        }
        [HttpGet("get-all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();

            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("my")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> GetMy()
        {
            var result = await _service.GetMyAsync();

            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("get/{id}")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);

            return StatusCode(result.StatusCode, result);
        }
        [HttpPut("update/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, UpdateTeacherClassSubjectDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);

            return StatusCode(result.StatusCode, result);
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);

            return StatusCode(result.StatusCode, result);
        }
    }
}
