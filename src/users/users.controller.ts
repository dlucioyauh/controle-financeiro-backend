import {
  Controller,
  Get,
  Delete,
  Param,
  Req,
  ForbiddenException,
} from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
  ) {}

  @Get()
  async listar(@Req() req: any) {
    if (
      req.user?.username !== 'dlucio'
    ) {
      throw new ForbiddenException(
        'Acesso negado',
      );
    }

    return this.usersService.listarUsuarios();
  }

  @Delete(':id')
  async deletar(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    if (
      req.user?.username !== 'dlucio'
    ) {
      throw new ForbiddenException(
        'Acesso negado',
      );
    }

    return this.usersService.deletarUsuario(
      id,
    );
  }
}