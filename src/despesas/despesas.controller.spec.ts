import { Test, TestingModule } from '@nestjs/testing';
import { DespesasController } from './despesas.controller';

describe('DespesasController', () => {
  let controller: DespesasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DespesasController],
    }).compile();

    controller = module.get<DespesasController>(DespesasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
