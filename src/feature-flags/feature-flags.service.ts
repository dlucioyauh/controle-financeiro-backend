import { Injectable, ForbiddenException, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FeatureFlagEntity } from './feature-flag.entity';

@Injectable()
export class FeatureFlagsService {
  constructor(
    @InjectRepository(FeatureFlagEntity)
    private flagsRepository: Repository<FeatureFlagEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<FeatureFlagEntity[]> {
    return this.flagsRepository.find({ order: { name: 'ASC' } });
  }

  async findByName(name: string): Promise<boolean> {
    const flag = await this.flagsRepository.findOne({ where: { name } });
    return flag?.enabled ?? false;
  }

  async getEnabledFlags(): Promise<Record<string, boolean>> {
    // Tenta obter do cache
    const cached = await this.cacheManager.get<Record<string, boolean>>('feature_flags_enabled');
    if (cached) {
      return cached;
    }

    // Se não estiver em cache, consulta o banco
    const flags = await this.flagsRepository.find({ where: { enabled: true } });
    const result = flags.reduce((acc, flag) => ({ ...acc, [flag.name]: true }), {});

    // Armazena no cache por 5 minutos (TTL definido globalmente)
    await this.cacheManager.set('feature_flags_enabled', result, 300); // 300s

    return result;
  }

  async updateFlag(id: string, enabled: boolean, currentUsername: string): Promise<FeatureFlagEntity> {
    if (currentUsername !== 'dlucio') {
      throw new ForbiddenException('Apenas o administrador pode modificar feature flags');
    }
    const flag = await this.flagsRepository.findOne({ where: { id } });
    if (!flag) throw new NotFoundException('Feature flag não encontrada');
    flag.enabled = enabled;
    const saved = await this.flagsRepository.save(flag);

    // Invalida o cache após atualizar uma flag
    await this.cacheManager.del('feature_flags_enabled');

    return saved;
  }
}