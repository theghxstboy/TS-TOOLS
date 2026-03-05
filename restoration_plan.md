# Plano de Restauração TS TOOLS v2

## 1. Ativos e Identidade
- [ ] Substituir logo de texto por `logo.png` no `Header.tsx` e `login/page.tsx`.
- [ ] Centralizar logo na Home (conforme `index.html` original).
- [ ] Aplicar gradiente exato no Hero: `linear-gradient(to right, #f3f0ed, #a99d94)`.

## 2. Cores e Contraste
- [ ] Ajustar `globals.css`:
    - `muted-foreground` de `#a99d94` para algo mais claro se necessário, ou garantir que textos secundários usem a cor correta.
    - Garantir que componentes Shadcn (Dialog, Select) usem o fundo `--card` ou `--background` corretamente.
- [ ] Corrigir textos "invisíveis": remover classes fixas como `text-gray-900` em fundos escuros.

## 3. Migração de Conteúdo (Copy)
- [ ] **Home**: Adicionar 4º item no Patch Notes ("Refinamento Visual").
- [ ] **Niches**: Adicionar os 14 nichos faltantes ao `src/data/niches.ts`.
    - [ ] Cleaning
    - [ ] Roofing
    - [ ] Landscaping
    - [ ] Remodeling
    - [ ] Carpentry
    - [ ] Framing
    - [ ] Additions
    - [ ] Siding
    - [ ] Insulation
    - [ ] Countertops
    - [ ] Hardwood
    - [ ] LVP
    - [ ] Epoxy
    - [ ] Sand & Refinish
- [ ] **Geradores**: Validar se todos os labels e placeholders batem com o `script.js` original.

## 4. Estrutura de Páginas
- [ ] Garantir que a navegação lateral dos Docs (`[nicheId]/page.tsx`) reflita todos os novos nichos.
- [ ] Verificar links quebrados (ex: `.html` vs rotas Next).
