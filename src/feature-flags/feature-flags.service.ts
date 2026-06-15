import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeatureFlagEntity } from './feature-flag.entity';

@Injectable()
export class FeatureFlagsService {
  constructor(
    @InjectRepository(FeatureFlagEntity)
    private flagsRepository: Repository<FeatureFlagEntity>,
  ) {}

  async findAll(): Promise<FeatureFlagEntity[]> {
    return this.flagsRepository.find({ order: { name: 'ASC' } });
  }

  async findByName(name: string): Promise<boolean> {
    const flag = await this.flagsRepository.findOne({ where: { name } });
    return flag?.enabled ?? false;
  }

  async getEnabledFlags(): Promise<Record<string, boolean>> {
    const flags = await this.flagsRepository.find({ where: { enabled: true } });
    return flags.reduce((acc, flag) => ({ ...acc, [flag.name]: true }), {});
  }

  async updateFlag(id: string, enabled: boolean, currentUsername: string): Promise<FeatureFlagEntity> {
    if (currentUsername !== 'dlucio') {
      throw new ForbiddenException('Apenas o administrador pode modificar feature flags');
    }
    const flag = await this.flagsRepository.findOne({ where: { id } });
    if (!flag) throw new NotFoundException('Feature flag não encontrada');
    flag.enabled = enabled;
    return this.flagsRepository.save(flag);
  }
}