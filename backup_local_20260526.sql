--
-- PostgreSQL database dump
--

\restrict 7EsdjaYKMZLt5MpXAIhGtiV58kFqeZFt82e3l27IpLRupbfKVcvneW4pGEkzOzY

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
-- Name: despesa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.despesa (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    descricao character varying(200) NOT NULL,
    valor numeric(10,2) NOT NULL,
    data date NOT NULL,
    categoria character varying(50),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
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
    rendimento integer NOT NULL,
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
    telefone character varying
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
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cliente (id, nome, email, telefone, endereco, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: despesa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.despesa (id, descricao, valor, data, categoria, "createdAt", "updatedAt") FROM stdin;
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
47e18eb1-d0a0-4132-b5a9-8d6b3834fdf1	Brounie Tradicional		12	2.00	2026-05-21 18:24:31.531112	\N	unidades	10.00	68.23	13.00	9.99	[{"unidade": "kg", "custoTotal": 65.7, "quantidade": 0.9, "ingredienteId": null}, {"unidade": "un", "custoTotal": 2.5333, "quantidade": 4, "ingredienteId": null}]
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, "createdAt", nome, email, "nomeNegocio", telefone) FROM stdin;
\.


--
-- Data for Name: vendas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendas (id, produto, quantidade, "precoUnitario", "valorTotal", "canalVenda", "dataVenda", "createdAt", usuario) FROM stdin;
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 2, true);


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
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
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

\unrestrict 7EsdjaYKMZLt5MpXAIhGtiV58kFqeZFt82e3l27IpLRupbfKVcvneW4pGEkzOzY

