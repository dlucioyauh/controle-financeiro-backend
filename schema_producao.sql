--
-- PostgreSQL database dump
--

\restrict kv1259zCx8Xoxl3vW2dxHkHilCv8q4i8ytJsQvXeFvKQnL4JkboO9hlLeie27c5

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
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
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
    usuario character varying
);


ALTER TABLE public.despesa OWNER TO postgres;

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
    usuario character varying,
    "clienteId" character varying,
    "clienteNome" character varying
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
-- PostgreSQL database dump complete
--

\unrestrict kv1259zCx8Xoxl3vW2dxHkHilCv8q4i8ytJsQvXeFvKQnL4JkboO9hlLeie27c5

