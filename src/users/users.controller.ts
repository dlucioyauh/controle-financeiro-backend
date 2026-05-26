import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('perfil')
  async getPerfil(@Req() req: any) {
    return this.usersService.getPerfil(req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Patch('perfil')
  async updatePerfil(
    @Req() req: any,
    @Body() body: { nome?: string; email?: string; nomeNegocio?: string; telefone?: string },
  ) {
    return this.usersService.updatePerfil(req.user.userId, body);
  }

  @UseGuards(AuthGuard)
  @Patch('alterar-senha')
  async alterarSenha(
    @Req() req: any,
    @Body() body: { senhaAtual: string; novaSenha: string },
  ) {
    return this.usersService.alterarSenha(req.user.userId, body.senhaAtual, body.novaSenha);
  }

  @Get()
  async listar(@Req() req: any) {
    if (req.user?.username !== 'dlucio') {
      throw new ForbiddenException('Acesso negado');
    }
    return this.usersService.listarUsuarios();
  }

  @Delete(':id')
  async deletar(@Param('id') id: string, @Req() req: any) {
    if (req.user?.username !== 'dlucio') {
      throw new ForbiddenException('Acesso negado');
    }
    return this.usersService.deletarUsuario(id);
  }
}