import { Test, TestingModule } from '@nestjs/testing';
import { VendasService } from './vendas.service';
import { UsersService } from '../users/users.service';
import { ClientesService } from '../clientes/clientes.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VendaEntity } from './venda.entity';
import { Repository } from 'typeorm';

describe('VendasService - calcularFrete', () => {
  let service: VendasService;
  let usersService: Partial<UsersService>;
  let clientesService: Partial<ClientesService>;
  let configService: Partial<ConfigService>;

  // Mock da resposta da API de roteirização
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
    usersService = {
      findOne: jest.fn(),
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

    // Mock global fetch
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
    const usuario = 'teste';
    const clienteId = 'uuid-cliente';

    // Mock do usuário com endereço de origem e taxa
    (usersService.findOne as jest.Mock).mockResolvedValue({
      latitudeOrigem: -27.5954,
      longitudeOrigem: -48.5480,
      taxaFreteKm: 0.80,
    });

    // Mock do cliente com coordenadas
    (clientesService.buscarPorId as jest.Mock).mockResolvedValue({
      id: clienteId,
      latitude: -27.6000,
      longitude: -48.5400,
    });

    const result = await service.calcularFrete(usuario, clienteId);

    expect(result).toEqual({
      distanciaKm: '15.23',
      tempoMinutos: 20,
      valorFrete: (15.23 * 0.80).toFixed(2),
      taxaFreteKm: 0.80,
    });
  });

  it('deve lançar erro se endereço de origem não configurado', async () => {
    (usersService.findOne as jest.Mock).mockResolvedValue({
      latitudeOrigem: null,
      longitudeOrigem: null,
    });

    await expect(
      service.calcularFrete('teste', 'uuid-cliente'),
    ).rejects.toThrow('Endereço de origem não configurado');
  });

  it('deve lançar erro se cliente não tem coordenadas', async () => {
    (usersService.findOne as jest.Mock).mockResolvedValue({
      latitudeOrigem: -27.5954,
      longitudeOrigem: -48.5480,
    });
    (clientesService.buscarPorId as jest.Mock).mockResolvedValue({
      latitude: null,
      longitude: null,
    });

    await expect(
      service.calcularFrete('teste', 'uuid-cliente'),
    ).rejects.toThrow('Endereço do cliente não possui coordenadas');
  });

  it('deve usar a taxa de frete padrão (0.80) se não configurada', async () => {
    (usersService.findOne as jest.Mock).mockResolvedValue({
      latitudeOrigem: -27.5954,
      longitudeOrigem: -48.5480,
      taxaFreteKm: undefined, // não configurada
    });
    (clientesService.buscarPorId as jest.Mock).mockResolvedValue({
      latitude: -27.6000,
      longitude: -48.5400,
    });

    const result = await service.calcularFrete('teste', 'uuid-cliente');
    expect(result.taxaFreteKm).toBe(0.80); // valor padrão do código
  });
});