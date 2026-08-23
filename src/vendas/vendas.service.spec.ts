import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { VendasService } from './vendas.service';
import { UsersService } from '../users/users.service';
import { ClientesService } from '../clientes/clientes.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VendaEntity } from './venda.entity';

describe('VendasService - calcularFrete', () => {
  let service: VendasService;
  let usersService: Partial<UsersService>;
  let clientesService: Partial<ClientesService>;
  let configService: Partial<ConfigService>;

  const mockRouteResponse = {
    routes: [
      {
        summary: {
          distance: 15230, // metros = 15,23 km
          duration: 1200,  // segundos = 20 minutos
        },
      },
    ],
  };

  beforeEach(async () => {
    // CORREÇÃO: findById em vez de findOne, para bater com o código real
    usersService = {
      findById: jest.fn(),
    };
    clientesService = {
      buscarPorId: jest.fn(),
    };
    configService = {
      get: jest.fn((key: string) => {
        if (key === 'ORS_API_KEY') return 'fake-api-key';
        return null;
      }),
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockRouteResponse),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendasService,
        { provide: getRepositoryToken(VendaEntity), useValue: {} },
        { provide: UsersService, useValue: usersService },
        { provide: ClientesService, useValue: clientesService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<VendasService>(VendasService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve calcular frete corretamente (distância × taxa)', async () => {
    const userId = 'mock-user-id';
    const clienteId = 'mock-client-id';

    (usersService.findById as jest.Mock).mockResolvedValue({
      id: userId,
      latitudeOrigem: -27.5954,
      longitudeOrigem: -48.5480,
      taxaFreteKm: 0.80,
    });

    (clientesService.buscarPorId as jest.Mock).mockResolvedValue({
      id: clienteId,
      latitude: -27.6000,
      longitude: -48.5400,
    });

    const result = await service.calcularFrete(userId, clienteId);

    expect(result).toEqual({
      distanciaKm: '15.23',
      tempoMinutos: 20,
      valorFrete: '12.18', // 15.23 * 0.80
      taxaFreteKm: 0.80,
    });
  });

  it('deve lançar erro se endereço de origem não configurado', async () => {
    const userId = 'mock-user-id';
    
    (usersService.findById as jest.Mock).mockResolvedValue({
      id: userId,
      latitudeOrigem: null,
      longitudeOrigem: null,
    });

    await expect(
      service.calcularFrete(userId, 'mock-client-id'),
    ).rejects.toThrow(NotFoundException);
    
    await expect(
      service.calcularFrete(userId, 'mock-client-id'),
    ).rejects.toThrow('Endereço de origem não configurado');
  });

  it('deve lançar erro se cliente não tem coordenadas', async () => {
    const userId = 'mock-user-id';

    (usersService.findById as jest.Mock).mockResolvedValue({
      id: userId,
      latitudeOrigem: -27.5954,
      longitudeOrigem: -48.5480,
    });
    (clientesService.buscarPorId as jest.Mock).mockResolvedValue({
      latitude: null,
      longitude: null,
    });

    await expect(
      service.calcularFrete(userId, 'mock-client-id'),
    ).rejects.toThrow(NotFoundException);

    await expect(
      service.calcularFrete(userId, 'mock-client-id'),
    ).rejects.toThrow('Endereço do cliente não possui coordenadas');
  });

  it('deve usar a taxa de frete padrão (0.80) se não configurada', async () => {
    const userId = 'mock-user-id';

    (usersService.findById as jest.Mock).mockResolvedValue({
      id: userId,
      latitudeOrigem: -27.5954,
      longitudeOrigem: -48.5480,
      taxaFreteKm: undefined,
    });
    (clientesService.buscarPorId as jest.Mock).mockResolvedValue({
      latitude: -27.6000,
      longitude: -48.5400,
    });

    const result = await service.calcularFrete(userId, 'mock-client-id');
    expect(result.taxaFreteKm).toBe(0.80);
  });
});