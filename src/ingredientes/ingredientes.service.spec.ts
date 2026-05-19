import { Test, TestingModule } from '@nestjs/testing';
import { IngredientesService } from './ingredientes.service';

describe('IngredientesService', () => {
  let service: IngredientesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngredientesService],
    }).compile();

    service = module.get<IngredientesService>(IngredientesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
