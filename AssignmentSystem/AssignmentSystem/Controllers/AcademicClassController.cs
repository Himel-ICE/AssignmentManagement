using AssignmentSystem.DTOs.AcademicClass;
using AssignmentSystem.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AcademicClassController : ControllerBase
    {
        private readonly IAcademicClassService _academicClassService;
        public AcademicClassController(IAcademicClassService academicClassService)
        {
            _academicClassService = academicClassService;
        }

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateAcademicClassDto dto)
        {
            var result = await _academicClassService.CreateAsync(dto);

            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _academicClassService.GetAllAsync();

            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("dropdown")]
        public async Task<IActionResult> GetDropdown()
        {
            var result = await _academicClassService.GetDropdownAsync();

            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _academicClassService.GetByIdAsync(id);

            return StatusCode(result.StatusCode, result);
        }

        [HttpPut("update/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, UpdateAcademicClassDto dto)
        {
            var result = await _academicClassService.UpdateAsync(id, dto);

            return StatusCode(result.StatusCode, result);
        }
        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _academicClassService.DeleteAsync(id);

            return StatusCode(result.StatusCode, result);
        }
    }
}
