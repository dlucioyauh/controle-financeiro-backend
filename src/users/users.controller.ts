import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('perfil')
  getPerfil(@Req() req: any) {
    return this.usersService.getPerfil(req.user.username);
  }

  @Patch('perfil')
  atualizarPerfil(@Body() body: { nomeNegocio?: string }, @Req() req: any) {
    return this.usersService.atualizarPerfil(req.user.username, body);
  }

  @Patch('alterar-senha')
  alterarSenha(
    @Body() body: { senhaAtual: string; novaSenha: string },
    @Req() req: any,
  ) {
    return this.usersService.alterarSenha(
      req.user.username,
      body.senhaAtual,
      body.novaSenha,
    );
  }
}