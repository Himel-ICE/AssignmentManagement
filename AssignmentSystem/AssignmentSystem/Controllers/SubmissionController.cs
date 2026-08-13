using AssignmentSystem.DTOs.Submission;
using AssignmentSystem.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SubmissionController : ControllerBase
    {
        private readonly ISubmissionService _service;

        public SubmissionController(ISubmissionService service)
        {
            _service = service;
        }

        [HttpPost("submit")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> Submit(CreateSubmissionDto dto)
        {
            var result = await _service.SubmitAsync(dto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPut("update/{id}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> Update(int id, UpdateSubmissionDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("get-all")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("assignment/{assignmentId}")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> GetByAssignment(int assignmentId)
        {
            var result = await _service.GetByAssignmentAsync(assignmentId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("my")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetMy()
        {
            var result = await _service.GetMyAsync();
            return StatusCode(result.StatusCode, result);
        }

        [HttpPut("review/{id}")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> Review(int id, ReviewSubmissionDto dto)
        {
            var result = await _service.ReviewAsync(id, dto);
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
