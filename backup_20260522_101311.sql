--
-- PostgreSQL database dump
--

\restrict ZA4fvheDF7qGTOLN63hby8zGSUWUCf9MEWnVuRoAIxhuoKZBFWGaqM7wEufUSIo

-- Dumped from database version 18.3 (Debian 18.3-1.pgdg13+1)
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: despesa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.despesa (
    id integer NOT NULL,
    tipo character varying NOT NULL,
    descricao character varying NOT NULL,
    categoria character varying NOT NULL,
    valor numeric NOT NULL,
    "formaPagamento" character varying NOT NULL,
    data timestamp without time zone NOT NULL
);


ALTER TABLE public.despesa OWNER TO postgres;

--
-- Name: despesa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.despesa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.despesa_id_seq OWNER TO postgres;

--
-- Name: despesa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.despesa_id_seq OWNED BY public.despesa.id;


--
-- Name: ingrediente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingrediente (
    id integer NOT NULL,
    nome character varying NOT NULL,
    preco numeric(10,2) NOT NULL,
    unidade character varying NOT NULL
);


ALTER TABLE public.ingrediente OWNER TO postgres;

--
-- Name: ingrediente_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ingrediente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ingrediente_id_seq OWNER TO postgres;

--
-- Name: ingrediente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingrediente_id_seq OWNED BY public.ingrediente.id;


--
-- Name: ingredientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredientes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying NOT NULL,
    "precoCompra" numeric(10,2) NOT NULL,
    "quantidadeCompra" numeric(10,2) NOT NULL,
    "unidadeMedida" character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    usuario character varying
);


ALTER TABLE public.ingredientes OWNER TO postgres;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: receita; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.receita (
    id integer NOT NULL,
    nome character varying NOT NULL,
    descricao character varying,
    rendimento integer NOT NULL,
    "unidadeRendimento" character varying,
    "custoIngredientes" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "custosFixosPorcentagem" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "maoDeObra" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "precoVendaFinal" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "precoVendaParceiro" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    ingredientes jsonb
);


ALTER TABLE public.receita OWNER TO postgres;

--
-- Name: receita_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.receita_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.receita_id_seq OWNER TO postgres;

--
-- Name: receita_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.receita_id_seq OWNED BY public.receita.id;


--
-- Name: receitas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.receitas (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying NOT NULL,
    descricao character varying,
    rendimento integer NOT NULL,
    "maoDeObra" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "lucroDesejado" numeric(5,2) DEFAULT '0'::numeric NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    usuario character varying
);


ALTER TABLE public.receitas OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: vendas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendas (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    produto character varying NOT NULL,
    quantidade integer NOT NULL,
    "precoUnitario" numeric(10,2) NOT NULL,
    "valorTotal" numeric(10,2) NOT NULL,
    "canalVenda" character varying DEFAULT 'Balcão'::character varying NOT NULL,
    "dataVenda" timestamp without time zone DEFAULT now() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    usuario character varying
);


ALTER TABLE public.vendas OWNER TO postgres;

--
-- Name: despesa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.despesa ALTER COLUMN id SET DEFAULT nextval('public.despesa_id_seq'::regclass);


--
-- Name: ingrediente id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingrediente ALTER COLUMN id SET DEFAULT nextval('public.ingrediente_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: receita id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receita ALTER COLUMN id SET DEFAULT nextval('public.receita_id_seq'::regclass);


--
-- Data for Name: despesa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.despesa (id, tipo, descricao, categoria, valor, "formaPagamento", data) FROM stdin;
105	pessoal	Mercado	Alimentação	52.58	Cartão de Crédito	2026-05-14 00:00:00
76	empresa	Compra de matéria-prima	Fornecedor	19.99	Cartão Débito	2026-05-05 00:00:00
106	empresa	Fornecedor	Mercado	11.99	Cartão de Crédito	2026-05-14 00:00:00
107	empresa	ETANOL	Transporte	139.29	Cartão de Crédito	2026-05-10 00:00:00
108	empresa	Fornecedor	Mercado	40.47	Cartão de Crédito	2026-05-12 00:00:00
109	pessoal	Mercado	Alimentação	17.01	Cartão de Crédito	2026-05-13 00:00:00
110	empresa	Fornecedor	Mercado	39.88	Cartão de Crédito	2026-05-12 00:00:00
111	empresa	Fornecedor	Mercado	31.63	Cartão de Crédito	2026-05-12 00:00:00
112	pessoal	Mercado 	Mercado	45	Cartão de Crédito	2026-05-18 00:00:00
48	empresa	Carro	Aluguel	792.34	Pix	2026-05-05 00:00:00
52	empresa	Compra de matéria-prima	Fornecedor	15.98	Cartão Débito	2026-05-06 00:00:00
54	empresa	Compra de matéria-prima	Geral	20.98	Cartão Crédito	2026-05-08 00:00:00
57	empresa	Entrega	Transporte	100	Cartão Crédito	2026-05-09 00:00:00
66	pessoal	Shopping	Roupas	33	Cartão Crédito	2026-05-09 00:00:00
67	pessoal	Shopping	Lazer	116.99	Cartão Crédito	2026-05-09 00:00:00
68	pessoal	Shopping	Lazer	37.98	Cartão Crédito	2026-05-09 00:00:00
69	pessoal	Restaurante	Lazer	166	Cartão Crédito	2026-05-09 00:00:00
73	pessoal	Supermercado	Alimentação	38.9	Cartão Crédito	2026-05-10 00:00:00
74	pessoal	Supermercado	Moradia	99.9	Cartão Crédito	2026-05-10 00:00:00
78	empresa	Compra de matéria-prima	Fornecedor	142.59	Cartão Débito	2026-05-06 00:00:00
79	empresa	Compra de matéria-prima	Fornecedor	10.79	Cartão Débito	2026-05-06 00:00:00
80	empresa	Compra de matéria-prima	Fornecedor	13.75	Cartão Débito	2026-05-06 00:00:00
81	empresa	Compra de matéria-prima	Fornecedor	15.98	Cartão Débito	2026-05-06 00:00:00
82	empresa	Compra de matéria-prima	Fornecedor	273.83	Cartão Débito	2026-05-08 00:00:00
84	empresa	Compra de matéria-prima	Fornecedor	16.99	Cartão Crédito	2026-05-08 00:00:00
85	empresa	Compra de matéria-prima	Fornecedor	29.78	Cartão Débito	2026-05-08 00:00:00
87	empresa	Compra de matéria-prima	Fornecedor	37.25	Cartão Crédito	2026-05-09 00:00:00
88	pessoal	Supermercado	Alimentação	17.05	Cartão Débito	2026-05-05 00:00:00
89	pessoal	Supermercado	Alimentação	74.01	Cartão Crédito	2026-05-05 00:00:00
90	pessoal	Supermercado	Alimentação	13.97	Cartão Débito	2026-05-06 00:00:00
91	pessoal	Supermercado	Alimentação	23.17	Cartão Crédito	2026-05-07 00:00:00
92	pessoal	Supermercado	Alimentação	33.96	Cartão Débito	2026-05-07 00:00:00
93	pessoal	Supermercado	Alimentação	57.25	Cartão Débito	2026-05-08 00:00:00
94	pessoal	Supermercado	Alimentação	18.98	Cartão Débito	2026-05-08 00:00:00
99	pessoal	Aeroporto	Lazer	7.98	Cartão Crédito	2026-05-10 00:00:00
100	pessoal	Supermercado	Alimentação	13.97	Cartão Crédito	2026-05-10 00:00:00
101	pessoal	dia da mae	Lazer	149	Cartão Crédito	2026-05-10 00:00:00
104	pessoal	Supermercado	Alimentação	43.2	Cartão Crédito	2026-05-11 00:00:00
\.


--
-- Data for Name: ingrediente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ingrediente (id, nome, preco, unidade) FROM stdin;
1	OVOS	0.33	un
2	ERITRITOL	59.00	kg
3	FARINHA DE ARROZ	6.99	kg
4	LEITE COND S/ LACTOSE	6.89	un
5	CREME DE LEITE S/ LACTOSE	4.99	un
6	FARINHA DE AMÊNDOAS	180.00	kg
7	CHOCOLATE 0%	85.00	kg
8	CACAU ALCALINO	47.50	kg
9	AÇÚCAR DE COCO	109.00	kg
10	POLVILHO AZEDO	17.80	kg
11	LEITE DE AMÊNDOAS	15.00	litro
12	FÉCULA DE BATATA	20.00	kg
13	CREAM CHESSE  	86.66	kg
14	AÇÚCAR DEMERARA	8.00	kg
15	NOZES	189.00	kg
16	FARINHA CASTANHA DE CAJU	45.00	kg
17	BRIGADEIRO	53.00	kg
18	ÓLEO DE GIRASOL	15.00	litro
19	BICARBONATO	14.00	kg
\.


--
-- Data for Name: ingredientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ingredientes (id, nome, "precoCompra", "quantidadeCompra", "unidadeMedida", "createdAt", usuario) FROM stdin;
b305030e-ae3e-43aa-b0ec-3ab6940d1831	FARINHA AMÊNDOAS	73.00	1.00	kg	2026-05-21 16:55:00.427061	dlucio
316ac971-0ac2-4494-9035-5b96e1428102	CHOCOLATE DEMERARA	80.00	1.00	kg	2026-05-21 16:58:57.731774	dlucio
c692ebb1-7d68-49fb-96d1-3a6b48651259	ÓLEO GIRASSOL	15.00	1.00	litro	2026-05-21 16:59:48.708982	dlucio
4e6972ec-009d-44c5-8ef7-2628390d7419	BICARBONATO DE SÓDIO	14.00	1.00	kg	2026-05-21 17:01:02.417818	dlucio
b5e35543-afd9-4ad1-8ad5-4faa40daf2d7	AÇÚCAR DEMERARA	8.00	1.00	kg	2026-05-21 17:04:38.374301	dlucio
ad940d99-0a02-4412-aab4-b574cc2d60a5	CACAU ALCALINO	90.00	1.00	kg	2026-05-21 17:07:46.571369	dlucio
a1d87518-0ce8-465d-ac5b-460a890dcf4b	OVOS	19.00	30.00	un	2026-05-21 16:57:39.734458	dlucio
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1779410185509	InitialSchema1779410185509
2	1779411934515	CreateUsers1779411934515
\.


--
-- Data for Name: receita; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.receita (id, nome, descricao, rendimento, "unidadeRendimento", "custoIngredientes", "custosFixosPorcentagem", "maoDeObra", "precoVendaFinal", "precoVendaParceiro", ingredientes) FROM stdin;
3	Brownie Tradicional	Nosso brownie tradicional super cremoso, sem glúten, sem lactose e adoçado com açúcar de coco. Sem conservantes!	12	unidades	40.94	10.00	2.00	13.00	9.99	[{"nome": "OVOS", "unidade": "un", "custoTotal": 1.32, "quantidade": 4, "custoUnitario": 0.33, "ingredienteId": 1}, {"nome": "CACAU ALCALINO", "unidade": "kg", "custoTotal": 1.425, "quantidade": 0.03, "custoUnitario": 47.5, "ingredienteId": 8}, {"nome": "CHOCOLATE 0%", "unidade": "kg", "custoTotal": 31.45, "quantidade": 0.37, "custoUnitario": 85, "ingredienteId": 7}, {"nome": "ÓLEO DE GIRASOL", "unidade": "litro", "custoTotal": 2.25, "quantidade": 0.15, "custoUnitario": 15, "ingredienteId": 18}, {"nome": "FARINHA CASTANHA DE CAJU", "unidade": "kg", "custoTotal": 3.1500000000000004, "quantidade": 0.07, "custoUnitario": 45, "ingredienteId": 16}, {"nome": "BICARBONATO", "unidade": "kg", "custoTotal": 0.14, "quantidade": 0.01, "custoUnitario": 14, "ingredienteId": 19}, {"nome": "AÇÚCAR DEMERARA", "unidade": "kg", "custoTotal": 1.2, "quantidade": 0.15, "custoUnitario": 8, "ingredienteId": 14}]
\.


--
-- Data for Name: receitas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.receitas (id, nome, descricao, rendimento, "maoDeObra", "lucroDesejado", "createdAt", usuario) FROM stdin;
81c7ed05-5e22-4ded-b855-4553a6989678	BROWNIE TRADICICONAL	Nosso brownie tradicional super cremoso, sem glúten, sem lactose  Sem conservantes!	12	2.00	0.00	2026-05-21 19:21:04.717445	dlucio
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, "createdAt") FROM stdin;
5b54b623-d353-421f-831c-658ed80a02cd	dlucio	$2b$10$vyfp1l.KWK0d26H/Js8Gs.tFf1.ILsgBPV29dsa1jH3wWU36mzwUC	2026-05-22 01:41:12.290618
\.


--
-- Data for Name: vendas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendas (id, produto, quantidade, "precoUnitario", "valorTotal", "canalVenda", "dataVenda", "createdAt", usuario) FROM stdin;
247d86c3-6e66-42f3-b3c7-2a05de0618ef	Brounie Tradicional	20	15.00	300.00	WhatsApp	2026-05-20 23:40:32.519617	2026-05-21 00:32:44.863423	\N
\.


--
-- Name: despesa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.despesa_id_seq', 112, true);


--
-- Name: ingrediente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingrediente_id_seq', 19, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 2, true);


--
-- Name: receita_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.receita_id_seq', 3, true);


--
-- Name: despesa PK_180d33aa63e7bae94e289ad23e0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.despesa
    ADD CONSTRAINT "PK_180d33aa63e7bae94e289ad23e0" PRIMARY KEY (id);


--
-- Name: receita PK_2b53bc8637e0b3fbc7978646d73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receita
    ADD CONSTRAINT "PK_2b53bc8637e0b3fbc7978646d73" PRIMARY KEY (id);


--
-- Name: vendas PK_371c42d415efbac7097bd08b744; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendas
    ADD CONSTRAINT "PK_371c42d415efbac7097bd08b744" PRIMARY KEY (id);


--
-- Name: ingrediente PK_5d2b1ec0f5d2a4cb767ac13f554; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingrediente
    ADD CONSTRAINT "PK_5d2b1ec0f5d2a4cb767ac13f554" PRIMARY KEY (id);


--
-- Name: receitas PK_8312a0fa7e81b3c0643ccac8b36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receitas
    ADD CONSTRAINT "PK_8312a0fa7e81b3c0643ccac8b36" PRIMARY KEY (id);


--
-- Name: ingredientes PK_8901a565cc70a661928d2011f2f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredientes
    ADD CONSTRAINT "PK_8901a565cc70a661928d2011f2f" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: users UQ_fe0bb3f6520ee0469504521e710; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);


--
-- PostgreSQL database dump complete
--

\unrestrict ZA4fvheDF7qGTOLN63hby8zGSUWUCf9MEWnVuRoAIxhuoKZBFWGaqM7wEufUSIo

