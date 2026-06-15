--
-- PostgreSQL database dump
--

\restrict H0Cbow6oFjB9hiFLVgzdnGCbH2aPYdkAWehYbQG0cPtSf6p8jwehggzabUbECNI

-- Dumped from database version 18.3
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
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id uuid DEFAULT public.uuid_generate_v4() CONSTRAINT cliente_id_not_null NOT NULL,
    nome character varying(100) CONSTRAINT cliente_nome_not_null NOT NULL,
    email character varying(100),
    telefone character varying(20),
    endereco character varying(200),
    "createdAt" timestamp without time zone DEFAULT now() CONSTRAINT "cliente_createdAt_not_null" NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() CONSTRAINT "cliente_updatedAt_not_null" NOT NULL,
    estado character varying,
    cep character varying,
    latitude numeric(10,7),
    longitude numeric(10,7)
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- Name: despesa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.despesa (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    descricao character varying(200) NOT NULL,
    valor numeric(10,2) NOT NULL,
    data date NOT NULL,
    categoria character varying(50),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    usuario character varying,
    pessoal boolean DEFAULT false,
    tipo character varying DEFAULT 'despesa'::character varying
);


ALTER TABLE public.despesa OWNER TO postgres;

--
-- Name: ingredientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredientes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying NOT NULL,
    "precoCompra" numeric(10,2),
    "quantidadeCompra" numeric(10,2),
    "unidadeMedida" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    usuario character varying,
    preco numeric(10,2),
    unidade character varying
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
-- Name: receitas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.receitas (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying NOT NULL,
    descricao character varying,
    rendimento numeric(10,2) NOT NULL,
    "maoDeObra" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    usuario character varying,
    "unidadeRendimento" character varying,
    "custosFixosPorcentagem" numeric(10,2) DEFAULT 10 NOT NULL,
    "custoIngredientes" numeric(10,2) DEFAULT 0 NOT NULL,
    "precoVendaFinal" numeric(10,2) DEFAULT 0 NOT NULL,
    "precoVendaParceiro" numeric(10,2) DEFAULT 0 NOT NULL,
    ingredientes jsonb
);


ALTER TABLE public.receitas OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    nome character varying,
    email character varying,
    "nomeNegocio" character varying,
    telefone character varying,
    "enderecoOrigem" character varying,
    "bairroOrigem" character varying,
    "cidadeOrigem" character varying,
    "estadoOrigem" character varying,
    "cepOrigem" character varying,
    "latitudeOrigem" numeric(10,7),
    "longitudeOrigem" numeric(10,7),
    "taxaFreteKm" numeric(10,2) DEFAULT 0.80,
    cnpj character varying(18),
    logo character varying,
    plano character varying DEFAULT 'free'::character varying,
    tema character varying DEFAULT 'dark'::character varying,
    "trialEndsAt" timestamp without time zone,
    "stripeCustomerId" character varying,
    "stripeSubscriptionId" character varying,
    "stripeSubscriptionStatus" character varying
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
    usuario character varying,
    "clienteId" character varying,
    "clienteNome" character varying
);


ALTER TABLE public.vendas OWNER TO postgres;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clientes (id, nome, email, telefone, endereco, "createdAt", "updatedAt", estado, cep, latitude, longitude) FROM stdin;
90de530f-8582-4b6f-bc5c-b9ef7f0166de	Douglas Lucio	\N	48996126202	Rua Celestino José Duarte, 210 apto 603	2026-05-26 15:24:32.152119	2026-05-26 15:24:32.152119	\N	\N	\N	\N
046ff139-3bd3-420d-811c-d969d00c9caf	ISABELA MOURA DA SILVA LUCIO 37996808880	\N	48998385486	r Celestino José Duarte	2026-05-26 15:24:58.487188	2026-05-26 15:24:58.487188	\N	\N	\N	\N
d7f3295f-d9df-44d8-b565-ae4bc9312294	douglaslucio	\N	48996126202	Rua Maria Turnês Becker, 41	2026-05-27 10:48:02.066383	2026-05-27 10:48:02.066383	\N	\N	\N	\N
99780679-5fb5-47c6-be1e-70896d9f0734	jaco	\N	48996126202	R Bernarda de Lacerda, 115	2026-05-27 10:48:11.990681	2026-05-27 10:48:11.990681	\N	\N	\N	\N
\.


--
-- Data for Name: despesa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.despesa (id, descricao, valor, data, categoria, "createdAt", "updatedAt", usuario, pessoal, tipo) FROM stdin;
129c7d03-63de-4155-b88e-3aa7ba70934e	mercadorias	1000.00	2026-05-13	Mercado	2026-05-26 15:28:03.073686	2026-05-26 15:28:03.073686	\N	f	despesa
e1269d93-9046-43c8-b983-fe26408c5f7b	entrega	80.00	2026-05-11	Geral	2026-05-26 15:27:36.263588	2026-05-26 15:46:46.184147	\N	f	despesa
09287415-7e01-421a-90b1-86f91e053481	comida	90.00	2026-05-24	Alimentação	2026-05-26 15:28:24.725041	2026-05-26 15:47:05.992133	\N	f	despesa
d2a0f1bc-c7b6-4a7c-841a-2527429dfd5c	Aluguel	800.00	2026-05-01	Fixo	2026-05-26 15:58:24.208266	2026-05-26 15:58:24.208266	teste_local	f	despesa
5eaec58b-cbf8-450e-8688-33de33fd22c1	Compras mercado	250.00	2026-05-15	Mercado	2026-05-26 15:58:24.208266	2026-05-26 15:58:24.208266	teste_local	f	despesa
f0ae7457-fe09-429c-ad4d-36c60ca692d0	Entrega	40.00	2026-05-26	Transporte	2026-05-26 15:58:24.208266	2026-05-26 15:58:24.208266	teste_local	f	despesa
40b25956-0a70-4f1e-a185-bf5574388945	Aluguel	800.00	2026-05-01	Fixo	2026-05-26 17:31:46.971872	2026-05-26 17:31:46.971872	teste	f	despesa
09209e38-f0b7-4508-b036-dea8d3db0e03	Compras mercado	250.00	2026-05-15	Mercado	2026-05-26 17:31:46.971872	2026-05-26 17:31:46.971872	teste	f	despesa
781b2ce3-f3b7-4857-88c0-99d53f4fac8e	Entrega	40.00	2026-05-26	Transporte	2026-05-26 17:31:46.971872	2026-05-26 17:31:46.971872	teste	f	despesa
c080d638-2f3c-41b0-ad47-adcf029bfa3d	Produtos	368.00	2026-05-26	Fornecedor	2026-05-26 18:02:41.353758	2026-05-26 18:02:41.353758	teste	f	despesa
\.


--
-- Data for Name: ingredientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ingredientes (id, nome, "precoCompra", "quantidadeCompra", "unidadeMedida", "createdAt", usuario, preco, unidade) FROM stdin;
3587278f-b17f-4176-81f7-32080981adf3	FARINHA DE AMÊNDOAS	73.00	1.00	kg	2026-05-21 13:54:15.484283	dlucio	73.00	kg
f686b90b-5a69-408e-ae91-9a8f64fea058	OVOS	19.00	30.00	un	2026-05-21 14:51:54.312758	dlucio	19.00	un
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1779410185509	InitialSchema1779410185509
2	1779411934515	CreateUsers1779411934515
\.


--
-- Data for Name: receitas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.receitas (id, nome, descricao, rendimento, "maoDeObra", "createdAt", usuario, "unidadeRendimento", "custosFixosPorcentagem", "custoIngredientes", "precoVendaFinal", "precoVendaParceiro", ingredientes) FROM stdin;
47e18eb1-d0a0-4132-b5a9-8d6b3834fdf1	Brounie Tradicional		12.00	2.00	2026-05-21 18:24:31.531112	\N	unidades	10.00	1.27	13.00	9.99	[{"unidade": "un", "custoTotal": 0.6333, "quantidade": 1, "ingredienteId": null}, {"unidade": "un", "custoTotal": 0.6333, "quantidade": 1, "ingredienteId": "f686b90b-5a69-408e-ae91-9a8f64fea058"}]
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, "createdAt", nome, email, "nomeNegocio", telefone, "enderecoOrigem", "bairroOrigem", "cidadeOrigem", "estadoOrigem", "cepOrigem", "latitudeOrigem", "longitudeOrigem", "taxaFreteKm", cnpj, logo, plano, tema, "trialEndsAt", "stripeCustomerId", "stripeSubscriptionId", "stripeSubscriptionStatus") FROM stdin;
5cfd990b-3c6e-4226-a1f3-ca418f131cd6	teste	$2b$10$rojKfOjQUf7Eir9D9MAJQuOzOgiEfnM02naeNR5o05Eg.ZjJtGATO	2026-05-26 17:28:28.673084	Teste Local	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.80	\N	\N	free	dark	\N	\N	\N	\N
\.


--
-- Data for Name: vendas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendas (id, produto, quantidade, "precoUnitario", "valorTotal", "canalVenda", "dataVenda", "createdAt", usuario, "clienteId", "clienteNome") FROM stdin;
cd2e2297-c76b-40fa-be9c-98f0fd8ffc50	Brownie tradicional	5	13.00	65.00	Balcão	2026-05-20 15:00:00	2026-05-26 15:44:21.783118	teste_local	\N	\N
e041b6b5-be29-4724-a5b4-eab93bf5339a	Torta de limão	2	150.00	300.00	Encomenda	2026-05-21 10:00:00	2026-05-26 15:44:21.783118	teste_local	\N	\N
1354f648-c6d6-48ba-971b-f2eddd4513f3	Brownie Suggar	10	14.00	140.00	WhatsApp	2026-05-22 18:00:00	2026-05-26 15:44:21.783118	teste_local	\N	\N
d880544d-bd53-4ec8-aa15-cf19e8ef1989	Bolo de abacaxi	1	200.00	200.00	Encomenda	2026-05-19 14:00:00	2026-05-26 15:44:21.783118	teste_local	\N	\N
08ab2252-3b07-4587-a7db-1e2a76c7891c	Torta de limão	1	160.00	160.00	Balcão	2026-05-18 11:00:00	2026-05-26 15:44:21.783118	teste_local	\N	\N
ea7ebed5-0df4-4aad-809d-5ee8158e4476	Brownie tradicional	5	13.00	65.00	Balcão	2026-05-20 15:00:00	2026-05-26 17:32:03.610001	teste	\N	\N
3acce4d2-542d-4c8c-8ba0-c0eff6fe5fc8	Brownie Suggar	10	14.00	140.00	WhatsApp	2026-05-22 18:00:00	2026-05-26 17:32:03.610001	teste	\N	\N
afc5c1d8-0b66-4588-b4c3-75139112e973	Brounie Tradicional	15	14.00	210.00	Encomenda	2026-05-11 21:00:00	2026-05-26 15:25:27.367986	teste	\N	\N
b015fb21-67e1-4708-866f-f7c305c7bcc2	Brounie Tradicional	12	13.00	156.00	Balcão	2026-05-25 21:00:00	2026-05-26 15:26:01.741304	teste	046ff139-3bd3-420d-811c-d969d00c9caf	ISABELA MOURA DA SILVA LUCIO 37996808880
ebdedcf4-c476-4206-8df2-6edfe5bf9795	Brounie Tradicional	1	13.00	13.00	Balcão	2026-05-25 21:00:00	2026-05-26 20:09:28.743423	teste	046ff139-3bd3-420d-811c-d969d00c9caf	ISABELA MOURA DA SILVA LUCIO 37996808880
e720244a-7f6b-4877-90f9-463a5ff656f2	Bolo de Chocolate	2	45.00	90.00	Balcão	2026-05-26 15:00:00	2026-05-26 20:12:55.954131	teste	\N	\N
e1699c8e-3781-4b00-aec9-0cc0ceff18b9	Brounie Tradicional	1	79.00	79.00	Encomenda	2026-05-25 21:00:00	2026-05-26 20:15:08.555306	teste	046ff139-3bd3-420d-811c-d969d00c9caf	ISABELA MOURA DA SILVA LUCIO 37996808880
285dbe12-6a56-4e1b-ae59-e29d147db755	Brounie Tradicional	1	599.00	599.00	WhatsApp	2026-05-25 21:00:00	2026-05-26 20:22:10.450857	teste	90de530f-8582-4b6f-bc5c-b9ef7f0166de	Douglas Lucio
71eb8937-8439-420e-87c5-d8f2e95e7944	Brounie Tradicional	1	13.00	13.00	iFood	2026-05-12 21:00:00	2026-05-26 20:25:20.2176	teste	90de530f-8582-4b6f-bc5c-b9ef7f0166de	Douglas Lucio
3f07b6a5-e028-4a27-b816-6a766147ba2d	Brounie Tradicional	1	0.99	0.99	Encomenda	2026-05-25 21:00:00	2026-05-26 20:29:02.276935	teste	046ff139-3bd3-420d-811c-d969d00c9caf	ISABELA MOURA DA SILVA LUCIO 37996808880
4f1ca316-3413-43f7-9d77-ebe46d200135	Brounie Tradicional	1	250.00	250.00	Balcão	2026-05-26 21:00:00	2026-05-27 07:15:21.11394	teste	90de530f-8582-4b6f-bc5c-b9ef7f0166de	Douglas Lucio
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 3, true);


--
-- Name: vendas PK_371c42d415efbac7097bd08b744; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendas
    ADD CONSTRAINT "PK_371c42d415efbac7097bd08b744" PRIMARY KEY (id);


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
-- Name: clientes cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id);


--
-- Name: despesa despesa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.despesa
    ADD CONSTRAINT despesa_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- PostgreSQL database dump complete
--

\unrestrict H0Cbow6oFjB9hiFLVgzdnGCbH2aPYdkAWehYbQG0cPtSf6p8jwehggzabUbECNI

