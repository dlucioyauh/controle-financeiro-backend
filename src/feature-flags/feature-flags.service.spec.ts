import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FeatureFlagEntity } from './feature-flag.entity';
import { FeatureFlagsService } from './feature-flags.service';

describe('FeatureFlagsService', () => {
  let service: FeatureFlagsService;
  let mockRepo: any;

  beforeEach(async () => {
    mockRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureFlagsService,
        { provide: getRepositoryToken(FeatureFlagEntity), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<FeatureFlagsService>(FeatureFlagsService);
  });

  it('findAll deve retornar lista de flags', async () => {
    mockRepo.find.mockResolvedValue([{ name: 'test', enabled: true }]);
    const result = await service.findAll();
    expect(result).toEqual([{ name: 'test', enabled: true }]);
    expect(mockRepo.find).toHaveBeenCalled();
  });

  it('findByName deve retornar true se flag existe e está habilitada', async () => {
    mockRepo.findOne.mockResolvedValue({ name: 'flag1', enabled: true });
    const result = await service.findByName('flag1');
    expect(result).toBe(true);
  });

  it('findByName deve retornar false se flag não existe', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    const result = await service.findByName('flag_inexistente');
    expect(result).toBe(false);
  });

  it('updateFlag deve lançar ForbiddenException se não for admin', async () => {
    await expect(service.updateFlag('id', true, 'joao')).rejects.toThrow('Apenas o administrador');
  });

  it('updateFlag deve atualizar flag se for admin', async () => {
    const flag = { id: '123', enabled: false };
    mockRepo.findOne.mockResolvedValue(flag);
    mockRepo.save.mockResolvedValue({ ...flag, enabled: true });
    const result = await service.updateFlag('123', true, 'dlucio');
    expect(result.enabled).toBe(true);
  });
});