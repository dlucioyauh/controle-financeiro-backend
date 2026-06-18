import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('perfil')
  async getPerfil(@Req() req: Request) {
    const userId = (req as any).user?.userId || (req as any).user?.sub;
    return this.usersService.getPerfil(userId);
  }

  @Patch('perfil')
  async updatePerfil(@Req() req: Request, @Body() data: any) {
    const userId = (req as any).user?.userId || (req as any).user?.sub;
    const username = (req as any).user?.username;
    return this.usersService.updatePerfil(userId, data, username);
  }

  @Patch('alterar-senha')
  async alterarSenha(
    @Req() req: Request,
    @Body() body: { senhaAtual: string; novaSenha: string },
  ) {
    const userId = (req as any).user?.userId || (req as any).user?.sub;
    return this.usersService.alterarSenha(userId, body.senhaAtual, body.novaSenha);
  }

  // 🆕 Onboarding – status atual
  @Get('onboarding-status')
  async getOnboardingStatus(@Req() req: Request) {
    const userId = (req as any).user?.userId || (req as any).user?.sub;
    const user = await this.usersService.findById(userId);
    return user?.onboardingSteps || {};
  }

  // 🆕 Onboarding – marcar passo como concluído
  @Patch('onboarding-status')
  async updateOnboardingStatus(
    @Req() req: Request,
    @Body() body: { step: string; completed: boolean },
  ) {
    const userId = (req as any).user?.userId || (req as any).user?.sub;
    return this.usersService.updateOnboardingStatus(userId, body.step, body.completed);
  }

  // Admin
  @Get()
  async listarUsuarios() {
    return this.usersService.listarUsuarios();
  }

  @Delete(':id')
  async deletarUsuario(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deletarUsuario(id);
  }
}