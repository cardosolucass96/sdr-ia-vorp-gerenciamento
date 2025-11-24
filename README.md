# SDR IA VORP - Gerenciamento

Sistema de gerenciamento de instâncias WhatsApp com Evolution API.

## 🚀 Deploy no Cloudflare Pages

### Configurações de Build

- **Framework preset**: Vite
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node version**: 18 ou superior

### Variáveis de Ambiente

Configure as seguintes variáveis no Cloudflare Pages:

```
VITE_EVOLUTION_API_URL=https://evolution-api.grupovorp.com
VITE_EVOLUTION_API_KEY=sua-chave-api-aqui
```

## 🛠️ Desenvolvimento Local

### Instalação

```bash
npm install
```

### Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure suas credenciais:

```bash
cp .env.example .env
```

### Executar em desenvolvimento

```bash
npm run dev
```

### Build para produção

```bash
npm run build
```

### Preview do build

```bash
npm run preview
```

## 📦 Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui
- React Router
- Axios
- Evolution API

## 🎨 Tema

O projeto utiliza a cor primária `#ff4b10` (laranja) como tema principal.
