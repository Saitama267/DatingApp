using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  public class AccountController : BaseApiController
  {

    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;
    private readonly UserManager<AppUser> _userManager;

    public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper)
    {
      this._tokenService = tokenService;
      this._mapper = mapper;
      _userManager = userManager;

    }

    [HttpPost("register")] // POST: api/account/register
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
      if (await UserExist(registerDto.Username))
      {
        return BadRequest("Username is taken");
      }

      var user = _mapper.Map<AppUser>(registerDto);

      user.UserName = registerDto.Username.ToLower();

      var result = await _userManager.CreateAsync(user, registerDto.Password);

      if (!result.Succeeded)
      {
        return BadRequest(result.Errors);
      }

      var roleResult = await _userManager.AddToRoleAsync(user, "Member");
      
      if (!roleResult.Succeeded)
      {
        return BadRequest(roleResult.Errors);
      }

      return new UserDto
      {
        Username = user.UserName,
        Token = await _tokenService.CreateToken(user),
        KnownAs = user.KnownAs,
        Gender = user.Gender
      };

    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
      var user = await _userManager.Users
          .Include(p => p.Photos)
          .FirstOrDefaultAsync(l => l.UserName == loginDto.Username);

      if (user == null)
      {
        return Unauthorized("Invalid username");
      }

      var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

      if (!result)
      {
        return Unauthorized("Invalid password");
      }

      return new UserDto
      {
        Username = user.UserName,
        Token = await _tokenService.CreateToken(user),
        PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
        KnownAs = user.KnownAs,
        Gender = user.Gender
      };
    }
    private async Task<bool> UserExist(string username)
    {
      return await _userManager.Users.AnyAsync(u => u.UserName == username.ToLower());
    }
  }
}