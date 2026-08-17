--
-- PostgreSQL database dump
--

\restrict DGvP0rk0PLPSh8iMfL3o0mRdRcX5V6MFfig8p0MdvaN1elUTU4mRg3l6etQ77WY

-- Dumped from database version 18.4 (Debian 18.4-1.pgdg13+1)
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
-- Name: cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying(100) NOT NULL,
    email character varying(100),
    telefone character varying(20),
    endereco character varying(200),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cliente OWNER TO postgres;

--
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying NOT NULL,
    telefone character varying,
    endereco character varying,
    bairro character varying,
    cidade character varying,
    usuario character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    estado character varying,
    cep character varying,
    latitude numeric(10,7),
    longitude numeric(10,7),
    "updatedAt" timestamp without time zone DEFAULT now()
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
-- Name: feature_flags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feature_flags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    description text,
    enabled boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.feature_flags OWNER TO postgres;

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
    rendimento numeric(10,2) NOT NULL,
    "maoDeObra" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    usuario character varying,
    "unidadeRendimento" character varying,
    "custosFixosPorcentagem" numeric(10,2) DEFAULT '10'::numeric NOT NULL,
    "custoIngredientes" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "precoVendaFinal" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "precoVendaParceiro" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    ingredientes jsonb
);


ALTER TABLE public.receitas OWNER TO postgres;

--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "userId" uuid NOT NULL,
    "trialRemindersEnabled" boolean DEFAULT true,
    "reportFrequency" character varying DEFAULT 'monthly'::character varying
);


ALTER TABLE public.user_preferences OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "nomeNegocio" character varying,
    nome character varying,
    email character varying,
    telefone character varying,
    "enderecoOrigem" character varying,
    "bairroOrigem" character varying,
    "cidadeOrigem" character varying,
    "estadoOrigem" character varying,
    "cepOrigem" character varying,
    "latitudeOrigem" numeric(10,7),
    "longitudeOrigem" numeric(10,7),
    "taxaFreteKm" numeric(10,2) DEFAULT 0.80,
    "trialEndsAt" timestamp without time zone,
    cnpj character varying(18),
    logo character varying,
    plano character varying DEFAULT 'free'::character varying,
    tema character varying DEFAULT 'dark'::character varying,
    "stripeCustomerId" character varying,
    "stripeSubscriptionId" character varying,
    "stripeSubscriptionStatus" character varying,
    "onboardingSteps" jsonb DEFAULT '{}'::jsonb,
    "updatedAt" timestamp without time zone DEFAULT now(),
    "whatsappNumber" character varying,
    "whatsappEnabled" boolean DEFAULT false
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
    "clienteNome" character varying,
    "clienteTelefone" character varying,
    "updatedAt" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.vendas OWNER TO postgres;

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
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cliente (id, nome, email, telefone, endereco, "createdAt", "updatedAt") FROM stdin;
17d39f2b-6b32-4431-a89f-6cdbb063f498	BIANCA (Grupo Leonora)	\N	4898200739	Av. Pedra Branca, 184	2026-05-26 21:22:50.593099	2026-05-26 21:22:50.593099
32645e4a-8d4e-4a2b-addc-3efb19088f48	IOLANDA	\N	48 8821-7471	Servidão Políbio Miguel Nunes, 34	2026-05-26 21:30:40.58381	2026-05-26 21:30:40.58381
41ffd553-3332-442c-be87-84c6972522db	MONIQUE	\N	48 8824-1747	Servidão Revoar das Perdizes - 513	2026-05-26 21:29:06.238329	2026-05-26 21:30:48.77893
f985327e-c029-4b67-aafe-c6ecd02c5fa1	MARIA EMILIA	\N	489148-3975	Rua Souza Dutra, 481, apto 302	2026-05-26 21:32:26.603043	2026-05-26 21:32:26.603043
cc7c2b32-ad73-437a-9d77-af645c591f77	JULIANA LEMOS PRADO (Advogada)	\N	48 9606-9717	Rua Vereador Batista Pereira 514 apto 301	2026-05-26 21:36:05.42614	2026-05-26 21:36:05.42614
2a894a25-f778-48c5-83f3-f190b22a8f5f	FABI  (CAFE BULEBA)	\N	48 9204-2203	Av. Presidente Kennedy, 1953	2026-05-26 21:39:41.633099	2026-05-26 21:39:41.633099
3f4c4839-10be-495b-a90c-cd7cb08c20de	SABRINA (Floricultura SAKURA)	\N	48 8464-6837	3245 Rod. Ulysses Guimarães	2026-05-26 21:44:49.692552	2026-05-26 21:44:49.692552
1efa2bca-3784-436c-b3c9-3f3f0517bdde	THAIS (CAFÉ OUTONO)	\N	48 8814-1514	Av. Rio Branco, 380	2026-05-26 21:48:14.900527	2026-05-26 21:48:14.900527
41a2d421-c6c8-427a-85a6-6d5f7ea1f755	MARINA SOARES (Academia Master Form) 	\N	48 9976-6566	R. Prefeito José Kehrig, 5318	2026-05-26 21:53:53.785957	2026-05-26 21:53:53.785957
b37ae716-7cb2-4c8c-a96e-b726a421fc91	FRANCISCO (Café Imperador)	\N	48 9624-4652	Rod. Princesa Leopoldina, 3131	2026-05-26 21:56:40.556755	2026-05-26 21:56:40.556755
2220f356-3e00-478e-89e1-1016ca3f0a3e	DAYANE MONTEMEZZO	\N	48 9641-4871	Rua Clodorico Moreira 38	2026-05-26 21:51:27.050598	2026-05-27 14:15:44.262641
\.


--
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clientes (id, nome, telefone, endereco, bairro, cidade, usuario, "createdAt", estado, cep, latitude, longitude, "updatedAt") FROM stdin;
90c28410-30eb-400f-8f1b-3c56c8ee6065	Marina Academia (Master Form)	48 9976-6566	R. Prefeito José Kehrig, 5318 	Centro	Santo Amaro da Imperatriz	dlucio	2026-06-01 17:43:08.512092	SC	88140-160	-27.6851375	-48.7765866	2026-07-24 01:45:50.507397
e9198d04-52b7-4b26-b898-de6be6785769	Deia	48988294371	Rua Bolonha, 146	Pagani	Palhoça	dlucio	2026-06-15 15:37:07.929292		88132-201	-27.6375907	-48.6865104	2026-07-24 01:45:50.507397
470fc55e-1d87-4676-85e2-252e9f825848	Margaret Biasi	51 9967-4122	Av. Santa Catarina 1556 apto 501	Balneário Estreito	São José 	dlucio	2026-08-11 19:04:41.434589	SC	88075500	\N	\N	2026-08-11 19:04:41.434589
a6e76275-5f07-472e-82d1-33e95cf0ad04	ISABELA MOURA DA SILVA LUCIO 37996808880	48998385486	r Celestino José Duarte	Centro	Santo Amaro da Imperatriz	teste	2026-05-23 19:01:18.473549	\N	\N	\N	\N	2026-07-24 01:45:50.507397
11aa2197-38fe-41d6-972d-26040576777b	DOUGLAS G LUCIO	48996126202	R Bernarda de Lacerda, 30	VIla Fanton	São Paulo	teste	2026-05-23 19:01:41.028777	\N	\N	\N	\N	2026-07-24 01:45:50.507397
7e44b2b1-fcca-499a-84b4-8809e8c2586d	Davi Come Tudoi	48996126202	Av dos Principes	Campeche	Florianópolis	teste	2026-05-23 23:24:35.795109	\N	\N	\N	\N	2026-07-24 01:45:50.507397
f1d9e87b-9d99-4432-9ace-b160415bcf82	Mikael Silva Lucio	48998385486	Rua Maria Turnes Becker, 41	Trindade	FLORIANÓPOLIS	teste	2026-05-23 23:24:18.62824	\N	\N	\N	\N	2026-07-24 01:45:50.507397
91aa790b-bbfb-4d69-a02d-af8961fde31a	Fabi (Café Buleba)	48 9204-2203	Av. Presidente Kennedy, 1953	Campinas	São Jose	dlucio	2026-05-28 21:09:44.18756	SC	88102-401	-27.6022597	-48.6162037	2026-07-24 01:45:50.507397
5ac187d5-96f5-447a-b3d3-b967404a4e96	Dayane Montemezzo	5548996414871	R. Clodorico Moreira, 38	Santa Monica	Florianópolis	dlucio	2026-05-28 21:06:53.575309	SC	88035-012	-27.5906857	-48.5137066	2026-07-24 01:45:50.507397
ad8d5c47-7865-4d6c-a9ae-8c9eae7d48a6	Bianca (Grupo Leonora)	5548998200739	Av. Pedra Branca, 184	Cidade Universitária Pedra Branca	Palhoça	dlucio	2026-05-28 21:06:53.575309	SC	88137270	-27.6185895	-48.6832351	2026-07-24 01:45:50.507397
e5a75be9-8599-4f34-9d5f-6a4b822a08a6	Monique	5548988241747	Servidão Revoar das Perdizes, 513	Campeche	Florianópolis	dlucio	2026-05-28 21:06:53.575309	SC	88063-077	-27.6934617	-48.5022634	2026-07-24 01:45:50.507397
e42cc18c-618c-42a6-9777-d8a70ac8e00a	Isabela Moura da Silva Lucio	5548998385486	Rua Maria Turnês Becker	Vila Becker	SANTO AMARO DA IMPERATRIZ	dlucio	2026-07-24 02:08:23.98566	SC	88140842	-27.6802173	-48.7562425	2026-07-24 02:08:23.98566
0cb790b9-d4ce-4c42-9fc0-fb6f143de465	DAVI LUCIO	5548996126202	Rua Maria Turnês Becker, 41	VIla Becker	Santo Amaro da Imperatriz	dlucio	2026-06-01 17:49:59.138831	SC	88140842	-27.6802173	-48.7562425	2026-07-24 01:45:50.507397
54143c93-518f-4058-bf25-88db118024a4	Sabrina (Floricultura Sakura)	48 8464-6837	3245 Rod. Ulysses Guimarães	Santo Anjo	Santo Amaro da Imperatriz	dlucio	2026-05-28 21:31:20.400819	SC	88140000	-27.6757292	-48.7809072	2026-07-24 01:45:50.507397
84f75464-9b72-4b2d-b26f-feb05b1e5ed9	Thais (Café Outono)	48 8814-1514	Av. Rio Branco, 380	Centro	Florianópolis	dlucio	2026-05-28 21:09:44.18756	SC	88015-200	-27.5919068	-48.5539938	2026-07-24 01:45:50.507397
14e5331f-dae5-4bce-a3f9-a7a57f616b25	Juliana Lemos Prado Advogada	48 9606-9717	Rua Ver. Batista Pereira, 514	Balneário (Estreito)	Florianópolis	dlucio	2026-05-28 21:31:20.400819	SC	88075525	\N	\N	2026-07-24 01:45:50.507397
29fb5388-70bc-4ef7-9629-2801d96e0486	Francisco Imperador | Café 	48 96244652	Rod. Princesa Leopoldina, 3131	Caldas	Santo Amaro da Imperatriz	dlucio	2026-06-01 16:37:38.31018	sc	88140-000	\N	\N	2026-07-24 01:45:50.507397
8a7bd519-a1f0-4444-bf2c-e90437d49df4	Maria Emilia	48 9148-3975	R. Souza Dutra, 481 	Estreito	Florianópolis	dlucio	2026-06-01 16:39:53.807742	SC	88070-605	-27.5864405	-48.5786771	2026-07-24 01:45:50.507397
0cc6a22d-daaf-4a16-b2c9-654dc05c3c9d	Iolanda	48 8821-7471	Servidão Polibio Miguel Nunes, 34	Campeche	Florianópolis	dlucio	2026-06-01 17:28:58.188173	SC	88065-039	-27.6780088	-48.5027491	2026-07-24 01:45:50.507397
b1f8e9af-a714-4c91-8c66-23949161cac3	Luciana Silva de Jesus	554896076905	Biguaçu: rua 7 de setembro, 611	Centro	Biguaçu	dlucio	2026-08-10 15:32:13.477724	SC	88160190	\N	\N	2026-08-10 15:32:13.477724
\.


--
-- Data for Name: despesa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.despesa (id, descricao, valor, data, categoria, "createdAt", "updatedAt", usuario, pessoal, tipo) FROM stdin;
518a3ea8-a955-42c2-9f76-55ef62bd9e3c	PRODUTOS	22.98	2026-05-23	Fornecedor	2026-05-27 11:50:25.371231	2026-05-27 11:50:25.371231	dlucio	f	despesa
cf0f6d36-7d80-4191-b914-f1b497d043f7	PRODUTOS	10.99	2026-05-24	Fornecedor	2026-05-27 11:51:07.963018	2026-05-27 11:51:07.963018	dlucio	f	despesa
b041bddb-cc3c-4ff0-b0e3-d405cd85c20a	PRODUTOS	6.49	2026-05-08	Fornecedor	2026-05-27 11:59:37.792591	2026-05-27 11:59:37.792591	dlucio	f	despesa
81cececc-e46f-44b4-9233-7a1c4f6150c5	PRODUTOS	16.79	2026-05-07	Fornecedor	2026-05-27 12:00:24.050195	2026-05-27 12:00:24.050195	dlucio	f	despesa
5b5226eb-82a6-4cf4-afc7-09b31130ab07	PRODUTOS	233.68	2026-04-21	Fornecedor	2026-05-27 12:11:09.995552	2026-05-27 12:11:09.995552	dlucio	f	despesa
f9d369d1-2a0d-4546-9488-5ec4e6b60950	PRODUTOS	368.06	2026-05-08	Fornecedor	2026-05-27 12:17:39.913292	2026-05-27 12:17:39.913292	dlucio	f	despesa
245ed658-af8f-460e-bfe6-bb012b4aa9aa	PRODUTOS	24.98	2026-05-20	Fornecedor	2026-05-27 12:22:18.429795	2026-05-27 12:22:18.429795	dlucio	f	despesa
b65f3972-b925-406b-b399-9f168b27edde	PRODUTOS	17.05	2026-05-19	Fornecedor	2026-05-27 12:23:38.108453	2026-05-27 12:23:38.108453	dlucio	f	despesa
acc20d1d-0569-4928-aac3-64ec6f044eb9	PRODUTOS	18.48	2026-05-18	Fornecedor	2026-05-27 12:24:48.204528	2026-05-27 12:24:48.204528	dlucio	f	despesa
84d3f7ea-ed28-4bc7-bb8b-8e5a3fb4d6c6	PRODUTOS	25.73	2026-05-16	Fornecedor	2026-05-27 12:26:04.382619	2026-05-27 12:26:04.382619	dlucio	f	despesa
b7e86349-5040-439a-9f83-3cd614393341	PRODUTOS	89.04	2026-05-15	Fornecedor	2026-05-27 12:29:03.546646	2026-05-27 12:29:03.546646	dlucio	f	despesa
0262d569-9e86-459d-93a0-7dfb81fc03f3	PRODUTOS	37.05	2026-05-09	Fornecedor	2026-05-27 12:32:01.25512	2026-05-27 12:32:01.25512	dlucio	f	despesa
d93e9e8d-f8a1-4ece-bef1-f30d9d67e1fc	PRODUTOS	11.49	2026-05-27	Fornecedor	2026-05-27 14:12:17.106636	2026-05-27 14:12:17.106636	dlucio	f	despesa
8c2a75df-1b21-4148-97f6-fe9fec08e72d	UBER	60.00	2026-05-27	Entregas/Fretes	2026-05-27 20:46:03.078662	2026-05-27 20:46:03.078662	dlucio	f	despesa
cba01dc4-a9b8-47f3-b6fb-101c3fe66dad	UBER	40.00	2026-05-20	Entregas/Fretes	2026-05-27 22:06:17.872187	2026-05-27 22:06:17.872187	dlucio	f	despesa
95b5592d-1ee9-4bf9-9624-9753bad90268	UBER	61.95	2026-05-17	Entregas/Fretes	2026-06-01 20:16:31.866966	2026-06-01 20:16:31.866966	dlucio	f	despesa
e30d36d1-24ef-4ad7-9917-e04468ae957e	IFOOD	10.37	2026-05-31	Impostos/Taxas	2026-06-01 20:17:33.769712	2026-06-01 20:17:33.769712	dlucio	f	despesa
f0a6a216-4276-49bb-89a0-5034ab97590f	UBER	49.96	2026-05-20	Entregas/Fretes	2026-06-01 20:20:53.90341	2026-06-01 20:20:53.90341	dlucio	f	despesa
3c6af407-c8fc-468e-9aff-419a7fdbb4a1	UBER	60.93	2026-04-27	Entregas/Fretes	2026-06-01 20:26:52.558717	2026-06-01 20:26:52.558717	dlucio	f	despesa
042b66bc-2928-4d18-bd34-eac5f38222fb	CARRO	792.34	2026-05-10	Fornecedor	2026-06-01 20:34:46.050726	2026-06-01 20:34:46.050726	dlucio	f	despesa
\.


--
-- Data for Name: feature_flags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feature_flags (id, name, description, enabled, created_at, updated_at) FROM stdin;
9d2ad187-7273-470e-ad68-0caa4238ee70	dashboard_pessoal	Habilita o toggle Empresa/Pessoal no Dashboard	t	2026-06-15 14:36:29.732561	2026-06-15 17:21:44.413539
2fbb6b58-c900-4e31-8cd2-7d6639c9e3d4	dark_mode	Permite alternar entre tema claro/escuro (em breve)	t	2026-06-15 14:36:29.732561	2026-06-15 17:21:49.710138
bcf0f891-667e-402c-a2c5-a9a33843bb42	novo_relatorio	Ativa novo formato de relatório em PDF	t	2026-06-15 14:36:29.732561	2026-06-17 22:12:47.028948
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

COPY public.ingredientes (id, nome, "precoCompra", "quantidadeCompra", "unidadeMedida", "createdAt", usuario, preco, unidade) FROM stdin;
b305030e-ae3e-43aa-b0ec-3ab6940d1831	FARINHA AMÊNDOAS	73.00	1.00	kg	2026-05-21 16:55:00.427061	dlucio	\N	\N
316ac971-0ac2-4494-9035-5b96e1428102	CHOCOLATE DEMERARA	80.00	1.00	kg	2026-05-21 16:58:57.731774	dlucio	\N	\N
4e6972ec-009d-44c5-8ef7-2628390d7419	BICARBONATO DE SÓDIO	14.00	1.00	kg	2026-05-21 17:01:02.417818	dlucio	\N	\N
ad940d99-0a02-4412-aab4-b574cc2d60a5	CACAU ALCALINO	45.00	1.00	kg	2026-05-21 17:07:46.571369	dlucio	45.00	kg
a46db8ad-c3ce-4ea4-95a1-31b04e5e3ae6	CHOCOLATE 0%	85.00	1.00	kg	2026-05-23 14:01:09.933227	dlucio	85.00	kg
19eb8482-993b-4cdb-ac87-c498e666754e	ERITRITOL	21.50	1.00	kg	2026-05-23 14:02:49.456763	dlucio	21.50	kg
1c8e2aef-c4f6-4bc4-98e9-7fcda676a6e9	FARINHA COCO	22.50	1.00	kg	2026-05-23 14:03:58.311675	dlucio	22.50	kg
d6232e9e-5725-44d4-95a3-149c383957df	FÉCULA DE BATATA	9.92	1.00	kg	2026-05-23 14:07:46.005173	dlucio	9.92	kg
969fc3af-775f-4af2-a811-4ddefcb4f2cb	MEL	41.90	1.00	litro	2026-05-23 14:09:17.094243	dlucio	41.90	litro
b5718a4a-f771-4dd1-9e20-6bc9f15a89e4	POLVILHO DOCE	10.90	1.00	kg	2026-05-23 14:12:09.835631	dlucio	10.90	kg
906e9e95-a148-486b-a6b7-4fcfb436a7ab	AMIDO DE MILHO	7.48	1.00	kg	2026-05-23 14:12:57.985544	dlucio	7.48	kg
c692ebb1-7d68-49fb-96d1-3a6b48651259	ÓLEO	8.00	1.00	litro	2026-05-21 16:59:48.708982	dlucio	8.00	litro
41d95da8-0c36-447f-a4f0-889b6ed3dd1b	FARINHA ARROZ	8.00	1.00	kg	2026-05-23 22:42:25.078243	dlucio	8.00	kg
6cec8ac4-a4f5-4e54-9012-ce40296a179d	DOCE DE LEITE	11.49	0.35	g	2026-05-23 22:45:55.435347	dlucio	11.49	g
0973d0c4-1704-42ee-a8f7-f6e8301312d0	OVOS	16.00	30.00	unidades	2026-05-23 16:57:08.664904	teste	16.00	unidades
b5e35543-afd9-4ad1-8ad5-4faa40daf2d7	AÇÚCAR DEMERARA	8.00	1.00	kg	2026-05-21 17:04:38.374301	dlucio	8.00	kg
dfdc8518-a660-487e-aa4e-cc5aa5afccb9	MORANGO	4.99	1.00	unidades	2026-05-26 21:59:22.796269	dlucio	\N	\N
3761cecf-7474-4416-beaf-9474f31f6890	CREMOR DE TÁRTARO	72.00	1.00	kg	2026-05-26 22:09:21.842313	dlucio	\N	\N
feba4be5-8c69-4234-9116-51362b30af49	ÓLEO COCO	35.00	1.00	litro	2026-05-26 22:10:16.827565	dlucio	\N	\N
26bea5c4-877f-482e-bc72-4c6486a77000	LEITE DE AMÊNDOAS	15.00	1.00	litro	2026-05-26 22:15:52.522536	dlucio	\N	\N
8c338861-674d-4561-b28e-168a7523856a	CREAM CHEESE	11.00	0.15	g	2026-05-26 22:13:27.663996	dlucio	\N	\N
2a9acbc4-b995-4db4-a3d9-6a2a1be64c8f	ABACAXI	8.00	1.00	unidades	2026-05-27 11:37:26.264216	dlucio	\N	\N
a8b1aa0f-eca8-4397-968c-7b62d1d3aa8e	COCO RALADO	14.00	1.00	unidades	2026-05-27 11:38:18.881337	dlucio	\N	\N
29155966-d0d9-4d4e-ad9b-ccb153add450	CENOURA	6.00	1.00	kg	2026-05-27 21:19:20.79163	dlucio	\N	\N
d89fe958-5149-40fa-a12a-67f4713e72ba	LEITE DE COCO  PÓ VEGANO	52.00	1.00	kg	2026-05-27 21:25:46.56215	dlucio	\N	\N
dd9e7f40-e373-41a3-889e-22a8deba910c	LEITE CONDENSADO S/L	9.00	0.40	g	2026-05-27 21:38:54.308912	dlucio	\N	\N
1e14def6-81d7-410c-9726-adf433cead09	OVOS	16.00	30.00	unidades	2026-06-01 15:06:11.268289	dlucio	\N	\N
378fc102-b4d1-436d-9515-9a5ec2b3e901	BANANA	4.00	1.00	kg	2026-06-01 15:48:34.373263	dlucio	\N	\N
5afbc8dd-0044-4a9f-bfc8-bb8fd5e06b2c	MANTEIGA S/LACTOSE	10.00	0.50	g	2026-06-01 15:51:28.598848	dlucio	\N	\N
06a6ec77-adea-4565-80a5-956e93e235bb	FARINHA TRIGO INTEGRAL	6.00	1.00	kg	2026-06-01 15:53:00.282897	dlucio	\N	\N
981af06f-9316-4dad-8dd4-d9e77cf4a92f	CREME DE LEITE S/L	5.00	1.00	unidades	2026-05-27 21:39:39.325527	dlucio	\N	\N
78d9c9e7-2476-4a04-a1ec-98c7a7492d46	FRANGO DESFIADO	20.00	0.40	g	2026-06-01 16:02:24.265517	dlucio	\N	\N
61511175-7ef5-4a6a-ba04-6b0a2b920bf6	ÓLEO GIRASSOL	12.00	1.00	litro	2026-06-01 16:16:49.524285	dlucio	\N	\N
0a26a73b-4328-4909-b301-ef195b64a95c	FARINHA CASTANHA DE CAJU	50.00	1.00	kg	2026-06-01 17:09:36.24237	dlucio	\N	\N
78ec605d-55a9-4945-b1a7-989b1312d0a5	NESCAFÉ	9.00	0.04	g	2026-06-29 00:36:21.264937	dlucio	\N	\N
d60be825-e492-4a03-9132-0e2d588cfcb3	BROWNIE NESTLÉ	12.00	1.00	g	2026-07-08 18:14:03.791306	dlucio	\N	\N
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1779410185509	InitialSchema1779410185509
2	1779411934515	CreateUsers1779411934515
3	1779464953162	AddUsuarioToDespesas1779464953162
4	1779472920144	AddUsuarioToIngredientesReceitas1779472920144
5	1779561835270	CreateClientes1779561835270
6	1779564144838	AddClienteToVendas1779564144838
7	1779574475022	AddNomeNegocioToUsers1779574475022
8	1779736241293	AddCamposAdicionaisToUsers1779736241293
9	1781500000000	CreateFeatureFlags1781500000000
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

COPY public.receitas (id, nome, descricao, rendimento, "maoDeObra", "createdAt", usuario, "unidadeRendimento", "custosFixosPorcentagem", "custoIngredientes", "precoVendaFinal", "precoVendaParceiro", ingredientes) FROM stdin;
f99cbd23-b17f-4848-9219-8023618529ad	TORTA LIMÃO		6.00	50.00	2026-05-23 17:06:44.464727	teste	fatias	10.00	0.00	150.00	135.00	[]
81c7ed05-5e22-4ded-b855-4553a6989678	BROWNIE TRADICIONAL	Nosso brownie tradicional super cremoso, sem glúten, sem lactose  Sem conservantes! Sensacional.	12.00	2.00	2026-05-21 19:21:04.717445	dlucio	unidades	10.00	40.73	13.00	9.99	[{"unidade": "unidades", "custoTotal": 2.1333, "quantidade": 4, "ingredienteId": "0973d0c4-1704-42ee-a8f7-f6e8301312d0"}, {"unidade": "kg", "custoTotal": 1.35, "quantidade": 0.03, "ingredienteId": "ad940d99-0a02-4412-aab4-b574cc2d60a5"}, {"unidade": "kg", "custoTotal": 29.6, "quantidade": 0.37, "ingredienteId": "316ac971-0ac2-4494-9035-5b96e1428102"}, {"unidade": "litro", "custoTotal": 1.2, "quantidade": 0.15, "ingredienteId": "c692ebb1-7d68-49fb-96d1-3a6b48651259"}, {"unidade": "kg", "custoTotal": 5.11, "quantidade": 0.07, "ingredienteId": "b305030e-ae3e-43aa-b0ec-3ab6940d1831"}, {"unidade": "kg", "custoTotal": 0.14, "quantidade": 0.01, "ingredienteId": "4e6972ec-009d-44c5-8ef7-2628390d7419"}, {"unidade": "kg", "custoTotal": 1.2, "quantidade": 0.15, "ingredienteId": "b5e35543-afd9-4ad1-8ad5-4faa40daf2d7"}]
010b6db4-54e4-4492-b46b-612aee574268	BROWNIE SUGAR FREE		12.00	50.00	2026-05-23 14:20:26.558465	dlucio	unidades	15.00	44.61	14.00	9.99	[{"unidade": "unidades", "custoTotal": 2.1333, "quantidade": 4, "ingredienteId": "0973d0c4-1704-42ee-a8f7-f6e8301312d0"}, {"unidade": "kg", "custoTotal": 31.45, "quantidade": 0.37, "ingredienteId": "a46db8ad-c3ce-4ea4-95a1-31b04e5e3ae6"}, {"unidade": "kg", "custoTotal": 0.14, "quantidade": 0.01, "ingredienteId": "4e6972ec-009d-44c5-8ef7-2628390d7419"}, {"unidade": "litro", "custoTotal": 1.2, "quantidade": 0.15, "ingredienteId": "c692ebb1-7d68-49fb-96d1-3a6b48651259"}, {"unidade": "kg", "custoTotal": 3.225, "quantidade": 0.15, "ingredienteId": "19eb8482-993b-4cdb-ac87-c498e666754e"}, {"unidade": "kg", "custoTotal": 1.35, "quantidade": 0.03, "ingredienteId": "ad940d99-0a02-4412-aab4-b574cc2d60a5"}, {"unidade": "kg", "custoTotal": 5.11, "quantidade": 0.07, "ingredienteId": "b305030e-ae3e-43aa-b0ec-3ab6940d1831"}]
5760fe9b-1fb4-48ff-aeab-5444a67e7260	BOLO PÃO DE MEL	BOLO DE PÃO DE MEL COM RECHEIO DE DOCE DE LEITE SEM LACTOSE	10.00	100.00	2026-05-23 22:42:01.77213	dlucio	Bolo M	10.00	21.81	230.00	160.00	[{"unidade": "kg", "custoTotal": 3.44, "quantidade": 0.16, "ingredienteId": null}, {"unidade": "kg", "custoTotal": 0.56, "quantidade": 0.07, "ingredienteId": null}, {"unidade": "kg", "custoTotal": 3.65, "quantidade": 0.05, "ingredienteId": null}, {"unidade": "g", "custoTotal": 11.49, "quantidade": 0.35, "ingredienteId": null}, {"unidade": "unidades", "custoTotal": 2.6667, "quantidade": 5, "ingredienteId": "0973d0c4-1704-42ee-a8f7-f6e8301312d0"}]
1b7ffdbf-de38-493d-a8f7-6aa04c5885c8	BOLO ABACAXI		12.00	100.00	2026-05-23 17:05:52.186487	teste	Bolo P	10.00	39.20	290.00	214.00	[{"unidade": "litro", "custoTotal": 1.2, "quantidade": 0.15, "ingredienteId": "c692ebb1-7d68-49fb-96d1-3a6b48651259"}, {"unidade": "unidades", "custoTotal": 3.2, "quantidade": 6, "ingredienteId": "0973d0c4-1704-42ee-a8f7-f6e8301312d0"}, {"unidade": "unidades", "custoTotal": 8, "quantidade": 1, "ingredienteId": "2a9acbc4-b995-4db4-a3d9-6a2a1be64c8f"}, {"unidade": "kg", "custoTotal": 7.3, "quantidade": 0.1, "ingredienteId": "b305030e-ae3e-43aa-b0ec-3ab6940d1831"}, {"unidade": "kg", "custoTotal": 4.3, "quantidade": 0.2, "ingredienteId": "19eb8482-993b-4cdb-ac87-c498e666754e"}, {"unidade": "kg", "custoTotal": 1.2, "quantidade": 0.15, "ingredienteId": "41d95da8-0c36-447f-a4f0-889b6ed3dd1b"}, {"unidade": "unidades", "custoTotal": 14, "quantidade": 1, "ingredienteId": "a8b1aa0f-eca8-4397-968c-7b62d1d3aa8e"}]
f02850a0-f7b6-42a9-8f68-52c4589c60f8	BOLO DE MORANGO SUGAR FREE		10.00	150.00	2026-05-26 22:52:29.694384	dlucio	Bolo P	10.00	84.05	379.00	300.00	[{"unidade": "kg", "custoTotal": 1.12, "quantidade": 0.14, "ingredienteId": null}, {"unidade": "kg", "custoTotal": 0.6944, "quantidade": 0.07, "ingredienteId": null}, {"unidade": "kg", "custoTotal": 0.545, "quantidade": 0.05, "ingredienteId": null}, {"unidade": "kg", "custoTotal": 0.2244, "quantidade": 0.03, "ingredienteId": null}, {"unidade": "unidades", "custoTotal": 5.3333, "quantidade": 10, "ingredienteId": "0973d0c4-1704-42ee-a8f7-f6e8301312d0"}, {"unidade": "kg", "custoTotal": 17.2, "quantidade": 0.8, "ingredienteId": "19eb8482-993b-4cdb-ac87-c498e666754e"}, {"unidade": "unidades", "custoTotal": 14.97, "quantidade": 3, "ingredienteId": "dfdc8518-a660-487e-aa4e-cc5aa5afccb9"}, {"unidade": "g", "custoTotal": 36.6667, "quantidade": 0.5, "ingredienteId": "8c338861-674d-4561-b28e-168a7523856a"}, {"unidade": "kg", "custoTotal": 7.3, "quantidade": 0.1, "ingredienteId": "b305030e-ae3e-43aa-b0ec-3ab6940d1831"}]
663b517f-bd89-4f76-bcb3-5cd8ba1d4d10	BOLO FORMIGUEIRO		10.00	100.00	2026-05-27 20:56:29.685768	dlucio	Bolo M	15.00	13.70	230.00	173.00	[{"unidade": "unidades", "custoTotal": 1.6, "quantidade": 3, "ingredienteId": "0973d0c4-1704-42ee-a8f7-f6e8301312d0"}, {"unidade": "kg", "custoTotal": 3.225, "quantidade": 0.15, "ingredienteId": "19eb8482-993b-4cdb-ac87-c498e666754e"}, {"unidade": "litro", "custoTotal": 0.8, "quantidade": 0.1, "ingredienteId": "c692ebb1-7d68-49fb-96d1-3a6b48651259"}, {"unidade": "litro", "custoTotal": 3.6, "quantidade": 0.24, "ingredienteId": "26bea5c4-877f-482e-bc72-4c6486a77000"}, {"unidade": "kg", "custoTotal": 1.92, "quantidade": 0.24, "ingredienteId": "41d95da8-0c36-447f-a4f0-889b6ed3dd1b"}, {"unidade": "kg", "custoTotal": 2.55, "quantidade": 0.03, "ingredienteId": "a46db8ad-c3ce-4ea4-95a1-31b04e5e3ae6"}]
6c1761d3-48bf-4a64-8bda-29a803e207c3	BOLO BEM CASADO	Sem Glutem, Sem lactose, Sem Açúcar, Low Carb	8.00	100.00	2026-05-27 20:43:22.815119	dlucio	Bolo P	15.00	25.04	260.00	193.00	[{"unidade": "unidades", "custoTotal": 2.1333, "quantidade": 4, "ingredienteId": "0973d0c4-1704-42ee-a8f7-f6e8301312d0"}, {"unidade": "kg", "custoTotal": 8.03, "quantidade": 0.11, "ingredienteId": "b305030e-ae3e-43aa-b0ec-3ab6940d1831"}, {"unidade": "kg", "custoTotal": 0.16, "quantidade": 0.02, "ingredienteId": "41d95da8-0c36-447f-a4f0-889b6ed3dd1b"}, {"unidade": "kg", "custoTotal": 3.225, "quantidade": 0.15, "ingredienteId": "19eb8482-993b-4cdb-ac87-c498e666754e"}, {"unidade": "g", "custoTotal": 11.49, "quantidade": 0.35, "ingredienteId": "6cec8ac4-a4f5-4e54-9012-ce40296a179d"}]
e65a5980-0521-4a12-b347-a8b508cbb864	BOLO CENOURA	Sugar  Free	10.00	100.00	2026-05-27 21:23:52.064816	dlucio	Bolo M	17.00	34.49	250.00	200.00	[{"unidade": "unidades", "custoTotal": 2.1333, "quantidade": 4, "ingredienteId": "0973d0c4-1704-42ee-a8f7-f6e8301312d0"}, {"unidade": "kg", "custoTotal": 5.805, "quantidade": 0.27, "ingredienteId": "19eb8482-993b-4cdb-ac87-c498e666754e"}, {"unidade": "kg", "custoTotal": 1.65, "quantidade": 0.275, "ingredienteId": "29155966-d0d9-4d4e-ad9b-ccb153add450"}, {"unidade": "litro", "custoTotal": 1.52, "quantidade": 0.19, "ingredienteId": "c692ebb1-7d68-49fb-96d1-3a6b48651259"}, {"unidade": "kg", "custoTotal": 2.475, "quantidade": 0.11, "ingredienteId": "1c8e2aef-c4f6-4bc4-98e9-7fcda676a6e9"}, {"unidade": "kg", "custoTotal": 0.73, "quantidade": 0.01, "ingredienteId": "b305030e-ae3e-43aa-b0ec-3ab6940d1831"}, {"unidade": "kg", "custoTotal": 15.6, "quantidade": 0.3, "ingredienteId": "d89fe958-5149-40fa-a12a-67f4713e72ba"}, {"unidade": "kg", "custoTotal": 1.35, "quantidade": 0.03, "ingredienteId": "ad940d99-0a02-4412-aab4-b574cc2d60a5"}, {"unidade": "kg", "custoTotal": 3.225, "quantidade": 0.15, "ingredienteId": "19eb8482-993b-4cdb-ac87-c498e666754e"}]
f1475986-7a13-4640-ab95-97523298dc55	BRIGADEIRO		500.00	0.00	2026-05-27 21:45:51.693848	dlucio	gramas	15.00	15.24	17.52	0.00	[{"unidade": "g", "custoTotal": 8.8875, "quantidade": 0.395, "ingredienteId": "dd9e7f40-e373-41a3-889e-22a8deba910c"}, {"unidade": "g", "custoTotal": 5, "quantidade": 0.2, "ingredienteId": "981af06f-9316-4dad-8dd4-d9e77cf4a92f"}, {"unidade": "kg", "custoTotal": 1.35, "quantidade": 0.03, "ingredienteId": "ad940d99-0a02-4412-aab4-b574cc2d60a5"}]
09e9ecf8-4dac-4e79-897b-16d48be5dae3	100 BRIGADEIROS	Sem Lactose, Sem Glutem	100.00	200.00	2026-05-27 21:52:13.120998	dlucio	unidades	10.00	45.71	520.00	380.00	[{"unidade": "g", "custoTotal": 26.6625, "quantidade": 1.185, "ingredienteId": "dd9e7f40-e373-41a3-889e-22a8deba910c"}, {"unidade": "g", "custoTotal": 15, "quantidade": 0.6, "ingredienteId": "981af06f-9316-4dad-8dd4-d9e77cf4a92f"}, {"unidade": "kg", "custoTotal": 4.05, "quantidade": 0.09, "ingredienteId": "ad940d99-0a02-4412-aab4-b574cc2d60a5"}]
702ddf22-dac1-435a-af0c-19c917280ed3	CHEESECAKE MORANGO		1000.00	100.00	2026-06-01 17:05:31.193588	dlucio	gramas	10.00	69.15	350.00	260.00	[{"unidade": "kg", "custoTotal": 10.95, "quantidade": 0.15, "ingredienteId": "b305030e-ae3e-43aa-b0ec-3ab6940d1831"}, {"unidade": "kg", "custoTotal": 1.125, "quantidade": 0.05, "ingredienteId": "1c8e2aef-c4f6-4bc4-98e9-7fcda676a6e9"}, {"unidade": "g", "custoTotal": 0.6, "quantidade": 0.03, "ingredienteId": "5afbc8dd-0044-4a9f-bfc8-bb8fd5e06b2c"}, {"unidade": "kg", "custoTotal": 3.225, "quantidade": 0.15, "ingredienteId": "19eb8482-993b-4cdb-ac87-c498e666754e"}, {"unidade": "g", "custoTotal": 36.6667, "quantidade": 0.5, "ingredienteId": "8c338861-674d-4561-b28e-168a7523856a"}, {"unidade": "unidades", "custoTotal": 5, "quantidade": 1, "ingredienteId": "981af06f-9316-4dad-8dd4-d9e77cf4a92f"}, {"unidade": "unidades", "custoTotal": 1.6, "quantidade": 3, "ingredienteId": "1e14def6-81d7-410c-9726-adf433cead09"}, {"unidade": "unidades", "custoTotal": 9.98, "quantidade": 2, "ingredienteId": "dfdc8518-a660-487e-aa4e-cc5aa5afccb9"}]
7538a4af-1706-4945-813c-e6864facce42	TORTA TRUFADA CHOCOLATE Z/AÇÚCAR		10.00	100.00	2026-06-01 17:22:59.043926	dlucio	fatias	20.00	32.15	270.00	200.00	[{"unidade": "kg", "custoTotal": 15, "quantidade": 0.3, "ingredienteId": "0a26a73b-4328-4909-b301-ef195b64a95c"}, {"unidade": "kg", "custoTotal": 0.8, "quantidade": 0.1, "ingredienteId": "41d95da8-0c36-447f-a4f0-889b6ed3dd1b"}, {"unidade": "g", "custoTotal": 1, "quantidade": 0.05, "ingredienteId": "5afbc8dd-0044-4a9f-bfc8-bb8fd5e06b2c"}, {"unidade": "g", "custoTotal": 9, "quantidade": 0.4, "ingredienteId": "dd9e7f40-e373-41a3-889e-22a8deba910c"}, {"unidade": "kg", "custoTotal": 1.35, "quantidade": 0.03, "ingredienteId": "ad940d99-0a02-4412-aab4-b574cc2d60a5"}, {"unidade": "unidades", "custoTotal": 5, "quantidade": 1, "ingredienteId": "981af06f-9316-4dad-8dd4-d9e77cf4a92f"}]
9472bbf1-7869-4bfc-97f6-071a714e0c14	BOLO AMOR AMOR		12.00	100.00	2026-06-01 17:34:45.756205	dlucio	Bolo M	10.00	67.28	350.00	260.00	[{"unidade": "litro", "custoTotal": 1.8, "quantidade": 0.15, "ingredienteId": "61511175-7ef5-4a6a-ba04-6b0a2b920bf6"}, {"unidade": "kg", "custoTotal": 0.8, "quantidade": 0.1, "ingredienteId": "41d95da8-0c36-447f-a4f0-889b6ed3dd1b"}, {"unidade": "kg", "custoTotal": 0.327, "quantidade": 0.03, "ingredienteId": "b5718a4a-f771-4dd1-9e20-6bc9f15a89e4"}, {"unidade": "kg", "custoTotal": 0.2244, "quantidade": 0.03, "ingredienteId": "906e9e95-a148-486b-a6b7-4fcfb436a7ab"}, {"unidade": "kg", "custoTotal": 6.57, "quantidade": 0.09, "ingredienteId": "b305030e-ae3e-43aa-b0ec-3ab6940d1831"}, {"unidade": "g", "custoTotal": 2.25, "quantidade": 0.1, "ingredienteId": "dd9e7f40-e373-41a3-889e-22a8deba910c"}, {"unidade": "unidades", "custoTotal": 9.98, "quantidade": 2, "ingredienteId": "dfdc8518-a660-487e-aa4e-cc5aa5afccb9"}, {"unidade": "g", "custoTotal": 33, "quantidade": 0.45, "ingredienteId": "8c338861-674d-4561-b28e-168a7523856a"}, {"unidade": "kg", "custoTotal": 8.6, "quantidade": 0.4, "ingredienteId": "19eb8482-993b-4cdb-ac87-c498e666754e"}, {"unidade": "unidades", "custoTotal": 3.7333, "quantidade": 7, "ingredienteId": "1e14def6-81d7-410c-9726-adf433cead09"}]
3a35b905-fde0-4a95-82cb-58e3841bf029	BOLO ABACAXI		10.00	100.00	2026-06-01 15:05:49.177493	dlucio	Bolo P	15.00	60.23	320.00	250.00	[{"unidade": "litro", "custoTotal": 1.2, "quantidade": 0.15, "ingredienteId": "c692ebb1-7d68-49fb-96d1-3a6b48651259"}, {"unidade": "unidades", "custoTotal": 4.8, "quantidade": 9, "ingredienteId": "1e14def6-81d7-410c-9726-adf433cead09"}, {"unidade": "kg", "custoTotal": 7.525, "quantidade": 0.35, "ingredienteId": "19eb8482-993b-4cdb-ac87-c498e666754e"}, {"unidade": "kg", "custoTotal": 2, "quantidade": 0.25, "ingredienteId": "41d95da8-0c36-447f-a4f0-889b6ed3dd1b"}, {"unidade": "kg", "custoTotal": 7.3, "quantidade": 0.1, "ingredienteId": "b305030e-ae3e-43aa-b0ec-3ab6940d1831"}, {"unidade": "unidades", "custoTotal": 8, "quantidade": 1, "ingredienteId": "2a9acbc4-b995-4db4-a3d9-6a2a1be64c8f"}, {"unidade": "unidades", "custoTotal": 14, "quantidade": 1, "ingredienteId": "a8b1aa0f-eca8-4397-968c-7b62d1d3aa8e"}, {"unidade": "kg", "custoTotal": 10.4, "quantidade": 0.2, "ingredienteId": "d89fe958-5149-40fa-a12a-67f4713e72ba"}, {"unidade": "unidades", "custoTotal": 5, "quantidade": 1, "ingredienteId": "981af06f-9316-4dad-8dd4-d9e77cf4a92f"}]
6d3f3365-0fca-4727-ad11-5ed41803026f	QUICHE		15.00	100.00	2026-06-01 15:52:25.07381	dlucio	unidades	15.00	27.13	17.00	13.12	[{"unidade": "g", "custoTotal": 3, "quantidade": 0.15, "ingredienteId": "5afbc8dd-0044-4a9f-bfc8-bb8fd5e06b2c"}, {"unidade": "unidades", "custoTotal": 10, "quantidade": 2, "ingredienteId": "981af06f-9316-4dad-8dd4-d9e77cf4a92f"}, {"unidade": "g", "custoTotal": 10, "quantidade": 0.2, "ingredienteId": "78d9c9e7-2476-4a04-a1ec-98c7a7492d46"}, {"unidade": "unidades", "custoTotal": 2.1333, "quantidade": 4, "ingredienteId": "1e14def6-81d7-410c-9726-adf433cead09"}, {"unidade": "kg", "custoTotal": 2, "quantidade": 0.25, "ingredienteId": "41d95da8-0c36-447f-a4f0-889b6ed3dd1b"}]
9ae83c88-c773-459c-81bf-74b25466db16	BOLO DA BANANA		12.00	100.00	2026-06-01 16:14:50.251988	dlucio	Bolo M	10.00	19.91	200.00	150.00	[{"unidade": "kg", "custoTotal": 0.8, "quantidade": 0.2, "ingredienteId": "378fc102-b4d1-436d-9515-9a5ec2b3e901"}, {"unidade": "unidades", "custoTotal": 2.1333, "quantidade": 4, "ingredienteId": "1e14def6-81d7-410c-9726-adf433cead09"}, {"unidade": "litro", "custoTotal": 1.32, "quantidade": 0.11, "ingredienteId": "61511175-7ef5-4a6a-ba04-6b0a2b920bf6"}, {"unidade": "kg", "custoTotal": 1.935, "quantidade": 0.09, "ingredienteId": "19eb8482-993b-4cdb-ac87-c498e666754e"}, {"unidade": "kg", "custoTotal": 2, "quantidade": 0.25, "ingredienteId": "41d95da8-0c36-447f-a4f0-889b6ed3dd1b"}, {"unidade": "kg", "custoTotal": 6.57, "quantidade": 0.09, "ingredienteId": "b305030e-ae3e-43aa-b0ec-3ab6940d1831"}, {"unidade": "kg", "custoTotal": 4.25, "quantidade": 0.05, "ingredienteId": "a46db8ad-c3ce-4ea4-95a1-31b04e5e3ae6"}, {"unidade": "kg", "custoTotal": 0.9, "quantidade": 0.02, "ingredienteId": "ad940d99-0a02-4412-aab4-b574cc2d60a5"}]
a8cc8f2c-5d7c-4185-9182-166bee5f94a6	PÃO NOSSO CASEIRO	Sem Glúten, sem lactose. Saudável  	1.00	5.83	2026-06-15 14:33:13.814606	dlucio	unidades	20.00	4.86	35.00	0.00	[{"unidade": "unidades", "custoTotal": 1.6, "quantidade": 3, "ingredienteId": "1e14def6-81d7-410c-9726-adf433cead09"}, {"unidade": "litro", "custoTotal": 0.6, "quantidade": 0.05, "ingredienteId": "61511175-7ef5-4a6a-ba04-6b0a2b920bf6"}, {"unidade": "kg", "custoTotal": 0.08, "quantidade": 0.01, "ingredienteId": "b5e35543-afd9-4ad1-8ad5-4faa40daf2d7"}, {"unidade": "kg", "custoTotal": 1.12, "quantidade": 0.14, "ingredienteId": "41d95da8-0c36-447f-a4f0-889b6ed3dd1b"}, {"unidade": "kg", "custoTotal": 0.6944, "quantidade": 0.07, "ingredienteId": "d6232e9e-5725-44d4-95a3-149c383957df"}, {"unidade": "kg", "custoTotal": 0.763, "quantidade": 0.07, "ingredienteId": "b5718a4a-f771-4dd1-9e20-6bc9f15a89e4"}]
364f3dc9-3a4c-49b6-9cd2-ceb35d534be8	BOLO MAÇÃ 		6.00	20.00	2026-06-28 23:27:11.453976	dlucio	Bolo P	15.00	7.26	0.00	0.00	[{"unidade": "kg", "custoTotal": 1.6, "quantidade": 0.2, "ingredienteId": "b5e35543-afd9-4ad1-8ad5-4faa40daf2d7"}, {"unidade": "kg", "custoTotal": 1.04, "quantidade": 0.13, "ingredienteId": "41d95da8-0c36-447f-a4f0-889b6ed3dd1b"}, {"unidade": "litro", "custoTotal": 1.04, "quantidade": 0.13, "ingredienteId": "c692ebb1-7d68-49fb-96d1-3a6b48651259"}, {"unidade": "kg", "custoTotal": 0.5952, "quantidade": 0.06, "ingredienteId": "d6232e9e-5725-44d4-95a3-149c383957df"}, {"unidade": "kg", "custoTotal": 0.654, "quantidade": 0.06, "ingredienteId": "b5718a4a-f771-4dd1-9e20-6bc9f15a89e4"}, {"unidade": "unidades", "custoTotal": 1.6, "quantidade": 3, "ingredienteId": "1e14def6-81d7-410c-9726-adf433cead09"}, {"unidade": "kg", "custoTotal": 0.73, "quantidade": 0.01, "ingredienteId": "b305030e-ae3e-43aa-b0ec-3ab6940d1831"}]
b63abc25-455b-47d3-a060-9fbcafc2f9f4	BOLO COCO C/COCADA	Marmita 	4.00	10.00	2026-06-28 23:40:18.883433	dlucio	unidades	15.00	74.13	0.00	0.00	[{"unidade": "kg", "custoTotal": 1.6, "quantidade": 0.2, "ingredienteId": "b5e35543-afd9-4ad1-8ad5-4faa40daf2d7"}, {"unidade": "unidades", "custoTotal": 14, "quantidade": 1, "ingredienteId": "a8b1aa0f-eca8-4397-968c-7b62d1d3aa8e"}, {"unidade": "kg", "custoTotal": 9.49, "quantidade": 0.13, "ingredienteId": "b305030e-ae3e-43aa-b0ec-3ab6940d1831"}, {"unidade": "kg", "custoTotal": 13.5, "quantidade": 0.6, "ingredienteId": "1c8e2aef-c4f6-4bc4-98e9-7fcda676a6e9"}, {"unidade": "litro", "custoTotal": 1.04, "quantidade": 0.13, "ingredienteId": "c692ebb1-7d68-49fb-96d1-3a6b48651259"}, {"unidade": "kg", "custoTotal": 1.6, "quantidade": 0.2, "ingredienteId": "41d95da8-0c36-447f-a4f0-889b6ed3dd1b"}, {"unidade": "kg", "custoTotal": 10.4, "quantidade": 0.2, "ingredienteId": "d89fe958-5149-40fa-a12a-67f4713e72ba"}, {"unidade": "g", "custoTotal": 22.5, "quantidade": 1, "ingredienteId": "dd9e7f40-e373-41a3-889e-22a8deba910c"}]
9c3d551a-ef2f-4101-a753-cb297a5a8128	CAPPUCCINO 		16.00	0.00	2026-06-29 00:43:08.441803	dlucio	unidades	15.00	23.00	0.00	0.00	[{"unidade": "g", "custoTotal": 11.25, "quantidade": 0.05, "ingredienteId": "78ec605d-55a9-4945-b1a7-989b1312d0a5"}, {"unidade": "kg", "custoTotal": 1.35, "quantidade": 0.03, "ingredienteId": "ad940d99-0a02-4412-aab4-b574cc2d60a5"}, {"unidade": "kg", "custoTotal": 10.4, "quantidade": 0.2, "ingredienteId": "d89fe958-5149-40fa-a12a-67f4713e72ba"}]
\.


--
-- Data for Name: user_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_preferences (id, "userId", "trialRemindersEnabled", "reportFrequency") FROM stdin;
43f2149a-fbfe-4865-aaf0-b60372c0d6a6	5b54b623-d353-421f-831c-658ed80a02cd	t	monthly
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, "createdAt", "nomeNegocio", nome, email, telefone, "enderecoOrigem", "bairroOrigem", "cidadeOrigem", "estadoOrigem", "cepOrigem", "latitudeOrigem", "longitudeOrigem", "taxaFreteKm", "trialEndsAt", cnpj, logo, plano, tema, "stripeCustomerId", "stripeSubscriptionId", "stripeSubscriptionStatus", "onboardingSteps", "updatedAt", "whatsappNumber", "whatsappEnabled") FROM stdin;
5b54b623-d353-421f-831c-658ed80a02cd	dlucio	$2b$10$vyfp1l.KWK0d26H/Js8Gs.tFf1.ILsgBPV29dsa1jH3wWU36mzwUC	2026-05-22 01:41:12.290618	ISABELA MOURA SAUDÁVEIS ARTESANAIS 	Douglas Gonçalves Lucio	dlucio.douglas@gmail.com	5548996126202	Rua Maria Turnês Becker, 41	Vila Becker	Santo Amaro da Imperatriz	SC	88140842	-27.6802173	-48.7562425	1.50	\N	65.951.726/0001-55	data:image/jpeg;base64,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AAABfWQd0/I0oCIMAnLyfbz2gAAAAAAAAAAB/wB/9xjjaUKAAUwefIWTofCAAAAAAAAAAO3h/R4tsldAAzSa5jA07yCAAAAAAAAAAKU4il8fyGsu1SwV1fc0y+CAAAAAAAAAAH/SO0xzJfU2zli3i/pY1tAAAAAAAAAAACe5SRe5oG91HgapkCnGOWAAAAAAAAAAACVR5+SoWCrWNUQKv63OCrAAAAAAAAAAAAnxhe0UKoysUWpNVBAOOhAAAAAAAAAAAARANrRXtTDBisHgJCRBhAAAAAAAAAAAAAAFs0jElTt05JLYMGTHAAAAAAAAAAAAAAAASxZ/WCmcvICIzIDiAAAAAAAAAAAAAAAAAAy+WiRTppfyxZAAAAAAAAAAAAAAAAAAAAAiqCmpDKZBhAAAAAAAAAAAAAAAAAAAAAAAAAiDzBAAAAAAAAAAAAAAAAVVWCCJMEGRWAELCLAFPLmAhtCBAAAAAAABBrOiUZSCUCWKAnHuBpJXAMFiDAAAAARBXwh2iQSjQHAqCzxRHzkBiCjCgAAAAAAAAADDBGPLNDGHGMBOJPNJAAAAAAAAAAAAAARDTQQwxzSzSxghTxRgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8QAAv/aAAwDAQACAAMAAAAQ8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888887+IpV888888888888888888888888888/Hglb1888888888888888888888888887eNqb+8888888888888888888m277888WXyJJ2889y9s188888888888u/jyK508oQ1f785kl/Eev8APPPPPPPPPPO7HpxTXY//AB3/AMo1kf0xI588888888888O4GmEV5CF/88hJt2GY165/8888888888AvGYMVUguQ88mrgo1yNhJ98888888888wrri2fWk8L1WmrntiZ2f798888888888uj/AOyWtzANnPOo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	premium	dark	cus_Ufb2kIX2xq0tqo	\N	\N	{}	2026-08-15 18:37:45.146897	5548996126202	t
\.


--
-- Data for Name: vendas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendas (id, produto, quantidade, "precoUnitario", "valorTotal", "canalVenda", "dataVenda", "createdAt", usuario, "clienteId", "clienteNome", "clienteTelefone", "updatedAt") FROM stdin;
89a48b7c-4f6b-4c01-85fc-67f35eb816fd	BOLO PÃO DE MEL	1	13.00	13.00	Balcão	2026-05-27 00:00:00	2026-05-27 10:21:19.094375	teste	2220f356-3e00-478e-89e1-1016ca3f0a3e	DAYANE MONTEMEZZO	\N	2026-08-15 02:49:38.158257
a28f2708-2fa0-457a-af2c-61552765536f	100 BRIGADEIROS	1	520.00	520.00	Encomenda	2026-05-01 00:00:00	2026-06-01 14:56:03.394261	dlucio	e5a75be9-8599-4f34-9d5f-6a4b822a08a6	Monique	\N	2026-08-15 02:49:38.158257
dd51a62a-eb71-4bd3-bb3c-6b53bdfcd34a	BOLO FORMIGUEIRO	1	150.00	150.00	Encomenda	2026-05-01 00:00:00	2026-06-01 14:57:12.025963	dlucio	e5a75be9-8599-4f34-9d5f-6a4b822a08a6	Monique	\N	2026-08-15 02:49:38.158257
33405d42-7813-4f20-a88b-ddd6c883f401	BOLO DE MORANGO SUGAR FREE	1	550.00	550.00	Encomenda	2026-05-01 00:00:00	2026-06-01 14:57:48.960377	dlucio	ad8d5c47-7865-4d6c-a9ae-8c9eae7d48a6	Bianca (Grupo Leonora)	\N	2026-08-15 02:49:38.158257
57abc0fa-ef76-4f00-b3ab-41e29f9e67d0	BOLO DE MORANGO SUGAR FREE	1	270.00	270.00	Encomenda	2026-05-05 00:00:00	2026-06-01 14:59:27.847654	dlucio	14e5331f-dae5-4bce-a3f9-a7a57f616b25	Juliana Lemos Prado Advogada	\N	2026-08-15 02:49:38.158257
cdaf1e0b-4193-4b1a-a7ad-62cd794881db	BOLO CENOURA	1	200.00	200.00	Encomenda	2026-05-20 00:00:00	2026-06-01 15:38:42.627319	dlucio	91aa790b-bbfb-4d69-a02d-af8961fde31a	Fabi (Café Buleba)	\N	2026-08-15 02:49:38.158257
91f7e173-7d94-462c-a584-b85a75dcd0e1	BOLO ABACAXI	1	185.00	185.00	Encomenda	2026-05-20 00:00:00	2026-06-01 15:39:07.227132	dlucio	91aa790b-bbfb-4d69-a02d-af8961fde31a	Fabi (Café Buleba)	\N	2026-08-15 02:49:38.158257
f534f57f-0bec-49a3-9d84-340b6f4ab70a	BROWNIE SUGAR FREE	10	9.94	99.40	Encomenda	2026-05-20 00:00:00	2026-06-01 15:40:24.388446	dlucio	91aa790b-bbfb-4d69-a02d-af8961fde31a	Fabi (Café Buleba)	\N	2026-08-15 02:49:38.158257
694b1f9d-9fbb-4ba7-acd2-3c9d39e5982b	BROWNIE TRADICIONAL	10	9.94	99.40	Encomenda	2026-05-20 00:00:00	2026-06-01 15:41:20.707876	dlucio	91aa790b-bbfb-4d69-a02d-af8961fde31a	Fabi (Café Buleba)	\N	2026-08-15 02:49:38.158257
4a5e220e-cd96-47c5-b34b-10d756f78a17	BOLO ABACAXI	1	165.00	165.00	Encomenda	2026-05-13 00:00:00	2026-06-01 15:42:11.25191	dlucio	54143c93-518f-4058-bf25-88db118024a4	Sabrina (Floricultura Sakura)	\N	2026-08-15 02:49:38.158257
c82bff23-82f8-4784-a625-8614159915da	BOLO BEM CASADO	1	150.00	150.00	Encomenda	2026-05-27 00:00:00	2026-06-01 15:43:01.859911	dlucio	5ac187d5-96f5-447a-b3d3-b967404a4e96	Dayane Montemezzo	\N	2026-08-15 02:49:38.158257
f057e6c0-b227-4dac-9573-35b5b1e0be35	BOLO BEM CASADO	1	267.00	267.00	Encomenda	2026-05-24 00:00:00	2026-06-01 15:44:41.400285	dlucio	e5a75be9-8599-4f34-9d5f-6a4b822a08a6	Monique	\N	2026-08-15 02:49:38.158257
0ff15152-fc6c-413b-b526-4415d7e9090b	BROWNIE TRADICIONAL	10	15.00	150.00	Encomenda	2026-05-20 00:00:00	2026-06-01 15:46:49.755074	dlucio	e5a75be9-8599-4f34-9d5f-6a4b822a08a6	Monique	\N	2026-08-15 02:49:38.158257
c04c8a88-7c6a-4219-8e8f-f6799e2f1558	BROWNIE SUGAR FREE	10	15.00	150.00	Encomenda	2026-05-20 00:00:00	2026-06-01 15:47:02.980382	dlucio	e5a75be9-8599-4f34-9d5f-6a4b822a08a6	Monique	\N	2026-08-15 02:49:38.158257
98e74147-314b-4b6c-8948-0f8b5c833c70	QUICHE	40	6.50	260.00	Encomenda	2026-05-07 00:00:00	2026-06-01 16:45:32.75452	dlucio	29fb5388-70bc-4ef7-9629-2801d96e0486	Francisco Imperador | Café 	\N	2026-08-15 02:49:38.158257
9443088b-5def-44ef-a9a6-3fc204939603	BOLO DA BANANA	1	48.00	48.00	Encomenda	2026-05-07 00:00:00	2026-06-01 16:46:17.903779	dlucio	29fb5388-70bc-4ef7-9629-2801d96e0486	Francisco Imperador | Café 	\N	2026-08-15 02:49:38.158257
0d337906-7e24-4220-ae06-21e7a52d341f	TORTA TRUFADA CHOCOLATE Z/AÇÚCAR	1	170.00	170.00	Encomenda	2026-05-05 00:00:00	2026-06-01 17:25:45.1873	dlucio	8a7bd519-a1f0-4444-bf2c-e90437d49df4	Maria Emilia	\N	2026-08-15 02:49:38.158257
6e886c65-0e94-4fd2-8c21-e3e6c9718843	CHEESECAKE MORANGO	1	170.00	170.00	Encomenda	2026-05-05 00:00:00	2026-06-01 17:27:35.446104	dlucio	8a7bd519-a1f0-4444-bf2c-e90437d49df4	Maria Emilia	\N	2026-08-15 02:49:38.158257
78ced53f-28a4-4089-95cd-8bcd958cfe5b	BOLO AMOR AMOR	1	389.00	389.00	Encomenda	2026-05-05 00:00:00	2026-06-01 17:35:41.204032	dlucio	0cc6a22d-daaf-4a16-b2c9-654dc05c3c9d	Iolanda	\N	2026-08-15 02:49:38.158257
e5deeca2-c8cd-44db-b85d-77eb662544ea	BROWNIE TRADICIONAL	4	13.00	52.00	WhatsApp	2026-05-31 00:00:00	2026-06-01 17:39:25.720668	dlucio	\N	\N	\N	2026-08-15 02:49:38.158257
36b0b37b-e02f-4adf-a122-de21feb49d47	BROWNIE TRADICIONAL	25	13.00	325.00	Encomenda	2026-05-31 00:00:00	2026-06-01 17:45:05.259899	dlucio	90c28410-30eb-400f-8f1b-3c56c8ee6065	Marina Academia (Master Form)	\N	2026-08-15 02:49:38.158257
44c38dd4-13ae-43ec-ad8c-1e17cd8c516c	BROWNIE SUGAR FREE	15	13.00	195.00	Balcão	2026-05-30 00:00:00	2026-06-01 17:50:27.737243	dlucio	0cb790b9-d4ce-4c42-9fc0-fb6f143de465	DAVI LUCIO	\N	2026-08-15 02:49:38.158257
a76a6a2a-de43-433c-acf6-d14b984f3eb9	BROWNIE TRADICIONAL	3	14.00	42.00	iFood	2026-05-15 00:00:00	2026-06-01 18:02:54.015727	dlucio	\N	\N	\N	2026-08-15 02:49:38.158257
0726d3d6-e975-4cb7-a4a6-90af632fac42	100 BRIGADEIROS	20	11.00	220.00	WhatsApp	2026-07-19 00:00:00	2026-07-19 18:27:43.432085	dlucio	e5a75be9-8599-4f34-9d5f-6a4b822a08a6	Monique	\N	2026-08-15 02:49:38.158257
e841340a-9374-484e-aabc-0d4c840adf20	QUICHE	10	23.00	230.00	WhatsApp	2026-07-19 00:00:00	2026-07-19 18:28:46.096542	dlucio	e5a75be9-8599-4f34-9d5f-6a4b822a08a6	Monique	\N	2026-08-15 02:49:38.158257
e8beba1a-69d4-4dff-8182-03036eff05b9	QUICHE	5	23.00	115.00	Balcão	2026-07-19 00:00:00	2026-07-19 18:31:03.921421	dlucio	e5a75be9-8599-4f34-9d5f-6a4b822a08a6	Monique	\N	2026-08-15 02:49:38.158257
400448ba-c381-4ef6-869a-529d259f4bc2	100 BRIGADEIROS	100	3.50	350.00	Balcão	2026-08-16 00:00:00	2026-08-10 15:33:48.303868	dlucio	b1f8e9af-a714-4c91-8c66-23949161cac3	Luciana Silva de Jesus	\N	2026-08-15 02:49:38.158257
f99d4aef-e514-40b2-8c6d-25dc0175a26e	BOLO MAÇÃ 	1	150.00	150.00	Balcão	2026-08-11 00:00:00	2026-08-11 19:05:28.743305	dlucio	470fc55e-1d87-4676-85e2-252e9f825848	Margaret Biasi	\N	2026-08-15 02:49:38.158257
0e18f752-61dd-4b53-b875-1c6ddb23a75e	PÃO NOSSO CASEIRO	1	39.00	39.00	Balcão	2026-08-11 00:00:00	2026-08-11 19:06:22.099816	dlucio	470fc55e-1d87-4676-85e2-252e9f825848	Margaret Biasi	\N	2026-08-15 02:49:38.158257
a6b45fc4-2586-4894-8b70-bd92d5bc351d	QUICHE	1	275.00	275.00	Balcão	2026-08-11 00:00:00	2026-08-11 19:06:44.02461	dlucio	470fc55e-1d87-4676-85e2-252e9f825848	Margaret Biasi	\N	2026-08-15 02:49:38.158257
\.


--
-- Name: ingrediente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingrediente_id_seq', 19, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 9, true);


--
-- Name: receita_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.receita_id_seq', 3, true);


--
-- Name: cliente PK_18990e8df6cf7fe71b9dc0f5f39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT "PK_18990e8df6cf7fe71b9dc0f5f39" PRIMARY KEY (id);


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
-- Name: clientes PK_d76bf3571d906e4e86470482c08; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT "PK_d76bf3571d906e4e86470482c08" PRIMARY KEY (id);


--
-- Name: users UQ_fe0bb3f6520ee0469504521e710; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);


--
-- Name: despesa despesa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.despesa
    ADD CONSTRAINT despesa_pkey PRIMARY KEY (id);


--
-- Name: feature_flags feature_flags_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_name_key UNIQUE (name);


--
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- Name: user_preferences user_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (id);


--
-- Name: user_preferences user_preferences_userId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT "user_preferences_userId_key" UNIQUE ("userId");


--
-- Name: user_preferences user_preferences_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict DGvP0rk0PLPSh8iMfL3o0mRdRcX5V6MFfig8p0MdvaN1elUTU4mRg3l6etQ77WY

