![alt text](https://github.com/DiegoWebwork/estrutura-de-dados/blob/main/universidade%20de%20vassouras%20Vertical.png)

# Curso: Engenharia de Software
# Aluno: Diego Rios dos Santos (202010774)
# Disciplina: ENGENHARIA DE SOFTWARE CONTINUA 8º Periodo
# Professor: Fabricio Dias

# Plataforma

Um aplicativo web para gerenciamento de cursos, matrículas e progresso dos alunos.

## Pré-requisitos

- Node.js (v18 ou superior recomendado)
- npm ou yarn
- MongoDB (local instance or Atlas)

## Instalação

1. Clone o repositório:
   ```bash
   git clone <url_do_repositorio>
   cd <nome_da_pasta_do_projeto>
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto (ou `.env.local`).
   - Adicione sua string de conexão do MongoDB:
     ```
     MONGODB_URI="your_mongodb_connection_string"
     # Exemplo local: MONGODB_URI="mongodb://localhost:27017/coursenote_db"
     ```
   - Você pode usar o arquivo `.env.example` como template.

## Executando o Aplicativo

1. Certifique-se que sua instância MongoDB está rodando e acessível.
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

3. O aplicativo estará disponível na porta `http://localhost:9002`.

## Funcionalidades

- **Gerenciamento de Cursos:** Criar, editar, visualizar e excluir cursos.
- **Gerenciamento de Notas:** Adicionar, editar, visualizar e excluir notas associadas a cursos específicos.
- **Visualização de Notas por Curso:** Filtrar e visualizar notas pertencentes a um curso específico.
- **Relatórios:** Visualizar um resumo da quantidade de cursos e notas, e um gráfico de barras mostrando a distribuição de notas por curso.

## Estrutura do Projeto

```
/
├── public/             # Arquivos estáticos
├── src/
│   ├── app/            # Rotas e páginas principais da aplicação (Next.js App Router)
│   │   ├── (app)/      # Grupo de rotas para a área logada/principal
│   │   │   ├── courses/ # Páginas relacionadas a cursos
│   │   │   ├── notes/   # Página de visualização de todas as notas
│   │   │   └── reports/ # Página de relatórios
│   │   ├── api/        # (Opcional) Rotas de API, se necessário
│   │   ├── globals.css # Estilos globais
│   │   └── layout.tsx  # Layout raiz da aplicação
│   ├── components/     # Componentes React reutilizáveis
│   │   ├── course/     # Componentes específicos para cursos (Card, Dialog, Form)
│   │   ├── note/       # Componentes específicos para notas (Card, Dialog, Form)
│   │   ├── report/     # Componentes específicos para relatórios (Chart)
│   │   ├── ui/         # Componentes de UI (Shadcn/ui)
│   │   ├── app-sidebar.tsx # Componente da barra lateral
│   │   └── page-header.tsx # Componente do cabeçalho da página
│   ├── data/           # Funções de acesso e manipulação de dados (MongoDB)
│   │   ├── courses.ts
│   │   └── notes.ts
│   ├── hooks/          # Hooks React customizados
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/            # Funções utilitárias
│   │   ├── utils.ts
│   │   └── mongodb.ts  # Utilitário de conexão com MongoDB
│   └── types/          # Definições de tipos TypeScript
│       └── index.ts
├── .env                # Variáveis de ambiente (MONGODB_URI) - NÃO FAÇA COMMIT COM SEGREDOS
├── .env.example        # Exemplo de variáveis de ambiente
├── .eslintrc.json      # Configuração do ESLint
├── .gitignore          # Arquivos ignorados pelo Git
├── components.json     # Configuração do Shadcn/ui
├── next.config.ts      # Configuração do Next.js
├── package.json        # Dependências e scripts do projeto
├── README.md           # Este arquivo
└── tsconfig.json       # Configuração do TypeScript
```

## Rotas da API

Este projeto atualmente utiliza funções assíncronas diretamente nos componentes de página (`"use client"`) para buscar e manipular dados do MongoDB através das funções em `src/data/`. Não há rotas de API separadas implementadas para CRUD.

## Stack Tecnológico

- **Framework:** Next.js (com App Router)
- **Linguagem:** TypeScript
- **UI:** React
- **Componentes UI:** Shadcn/ui, Lucide Icons, Recharts
- **Estilização:** Tailwind CSS
- **Gerenciamento de Formulários:** React Hook Form
- **Validação de Schema:** Zod
- **Notificações (Toast):** Implementação customizada (baseada em `react-hot-toast`)
- **Manipulação de Datas:** date-fns
- **Persistência de Dados:** MongoDB (usando o driver `mongodb`)

## Diagrama UML

```mermaid
classDiagram
    class Course {
        +id: string  ~ MongoDB _id
        +title: string
        +description: string
        +startDate?: Date
        +endDate?: Date
    }

    class Note {
        +id: string  ~ MongoDB _id
        +title: string
        +content: string
        +courseId: string ~ Refers to Course's id (string version of _id)
        +createdAt: Date
    }

    Course "1" -- "0..*" Note : contains
```

## Modelo relacional e modelo de documentos

**Modelo de Documentos (MongoDB):**

*Coleção `courses`:*
```json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "startDate": "ISODate | null",
  "endDate": "ISODate | null"
}
```

*Coleção `notes`:*
```json
{
  "_id": "ObjectId",
  "title": "string",
  "content": "string",
  "createdAt": "ISODate",
  "courseId": "string" // String representation of the Course document's _id
}
```
