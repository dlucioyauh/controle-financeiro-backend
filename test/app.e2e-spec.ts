jest.setTimeout(30000);

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request = require('supertest');
import { TestAppModule } from './test.module';

describe('VendasController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('deve registrar e logar', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'test_e2e', password: '123456' })
      .expect(201);
    expect(res.body.access_token).toBeDefined();
    token = res.body.access_token;
  });

  it('deve criar uma venda', async () => {
    const res = await request(app.getHttpServer())
      .post('/vendas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        produto: 'Bolo Teste',
        quantidade: 2,
        precoUnitario: 50,
        valorTotal: 100,
        canalVenda: 'Balcão',
        dataVenda: new Date().toISOString(),
      })
      .expect(201);
    expect(res.body.id).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});