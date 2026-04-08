# GeradorContext — Guia de Padronização dos Geradores

> Documento de referência técnica e visual para o desenvolvimento e manutenção de todos os geradores da plataforma TS-TOOLS.
> Toda nova feature ou gerador deve seguir estritamente este guia.

---

## 1. Paleta de Cores por Departamento

Cada gerador pertence a um departamento principal. A cor de acento do gerador — aplicada nos ícones do header, badges, botões primários, bordas de seleção e glow effects — deve sempre refletir a cor do departamento ao qual pertence.

| Departamento       | Cor            | Tailwind Classes (referência)                              |
|--------------------|----------------|------------------------------------------------------------|
| Design             | Vermelho/Rosa  | `rose-500` / `#f43f5e`                                     |
| Audiovisual        | Azul Escuro    | `blue-700` / `#1d4ed8`                                     |
| Social Media       | Verde          | `emerald-500` / `#10b981`                                  |
| Tráfego Pago       | Laranja        | `orange-500` / `#f97316`                                   |
| Webdesign          | Azul Claro     | `cyan-500` · `blue-400` / `#06b6d4`                       |
| Ferramentas / Docs | Roxo           | `violet-500` / `#8b5cf6`                                   |

> **Regra:** A cor do departamento define visualmente o "tema" de toda a UI do gerador — gradientes do ícone hero, bordas de select ativo, cor dos badges e `shadow-[color]/20` dos cards.

---

## 2. Estrutura Obrigatória do Layout

Todo gerador deve seguir o seguinte layout, **sem exceções**:

```
[ Header Global + Breadcrumbs ]   ← vem do AppLayout
─────────────────────────────────
[ Hero Centralizado               ]   ← Ícone + Título + Subtítulo
─────────────────────────────────
[ Grid 12 cols (lg)               ]
│                                 │
│  col-span-7: Formulário (Forms) │  col-span-5: Resultado (Sticky)
│                                 │
─────────────────────────────────
[ Histórico (full-width)          ]   ← sempre abaixo do grid
─────────────────────────────────
[ Footer Padrão                   ]   ← sempre ao final
```

### 2.1 Breakpoints

- **Mobile (`< lg`):** columns empilhadas (1 coluna). Formulário aparece **antes** do resultado.
- **Desktop (`lg+`):** Grid de 12 colunas conforme acima.

---

## 3. Hero Section (Título)

O hero deve ser **sempre centralizado** (`text-center`). Estrutura obrigatória:

```tsx
<div className="text-center mb-12 animate-fade-up">
  <div className="flex items-center gap-4 justify-center mb-4">

    {/* Ícone do Gerador */}
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="size-14 rounded-2xl bg-gradient-to-tr from-[COR_A] to-[COR_B]
                          flex items-center justify-center text-white shadow-xl
                          transition-transform hover:scale-110 cursor-help">
            <IconeDoGerador size={32} />
          </div>
        </TooltipTrigger>
        <TooltipContent>[Descrição curta do gerador]</TooltipContent>
      </Tooltip>
    </TooltipProvider>

    {/* Título e subtítulo inline */}
    <div className="text-left">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        [Nome] <span className="bg-clip-text text-transparent bg-gradient-to-r from-[COR_A] to-[COR_B]">[Destaque]</span>
      </h1>
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mt-1">
        [SUBTÍTULO TÉCNICO EM CAIXA ALTA]
      </p>
    </div>
  </div>

  {/* Descrição curta */}
  <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
    [Descrição resumida do propósito do gerador.]
  </p>
</div>
```

> **Não use emojis** no título. Use apenas ícones `lucide-react` para manter consistência visual e profissionalismo.

---

## 4. Formulário — Coluna Esquerda (col-span-7)

### 4.1 Estrutura da Card do Formulário

```tsx
<Card className="rounded-[24px] border-border shadow-xl overflow-hidden">
  <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 relative">
    <Separator className="absolute bottom-0 left-0 right-0" />

    {/* Ícone + Título do bloco */}
    <div className="flex items-center gap-4">
      <div className="size-12 bg-[COR_DEPTO] rounded-2xl flex items-center justify-center text-white
                      shadow-lg shadow-[COR_DEPTO]/20">
        <IconeBloco size={28} />
      </div>
      <div>
        <CardTitle className="text-xl font-black tracking-tight leading-none uppercase">
          [Título do Bloco]
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-1 font-bold italic tracking-wider uppercase">
          [Subtítulo descritivo]
        </CardDescription>
      </div>
    </div>

    {/* Seletor de Modo */}
    [ver seção 4.2]

  </CardHeader>
  <CardContent className="p-6 md:p-8 space-y-8">
    [campos do formulário]
  </CardContent>
</Card>
```

### 4.2 Seletor de Modo (Básico / Avançado)

Todos os geradores com dois modos devem usar **exatamente** as labels **"Básico"** e **"Avançado"** (PT-BR), sem variações como "Smart", "Expert", "Automático" etc.

```tsx
<div className="flex bg-muted p-1 rounded-xl shadow-inner border border-border">
  <button
    onClick={() => setMode("basic")}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
      mode === "basic"
        ? "bg-card text-[COR_DEPTO] shadow-sm"
        : "text-muted-foreground hover:text-foreground"
    )}
  >
    <Zap size={16} /> Básico
  </button>
  <button
    onClick={() => setMode("advanced")}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
      mode === "advanced"
        ? "bg-card text-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground"
    )}
  >
    <Cpu size={16} /> Avançado
  </button>
</div>
```

> O toggle fica posicionado no **canto superior direito** do `CardHeader`.

### 4.3 Labels dos Campos

```tsx
<Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
  [Nome do Campo]
</Label>
```

### 4.4 Selects — Nicho / Indústria

**Todos os geradores devem conter os nichos padronizados do sistema.** Abaixo o template base:

```tsx
<Select value={niche} onValueChange={setNiche}>
  <SelectTrigger className="bg-card h-12">
    <SelectValue placeholder="Selecione o nicho..." />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel className="bg-muted uppercase text-[10px] font-black tracking-widest px-4 py-2">
        🇺🇸 Home Services (USA)
      </SelectLabel>
      <SelectItem value="construction">Construction / Remodeling</SelectItem>
      <SelectItem value="roofing">Roofing</SelectItem>
      <SelectItem value="painting">Painting</SelectItem>
      <SelectItem value="hvac">HVAC</SelectItem>
      <SelectItem value="plumbing">Plumbing</SelectItem>
      <SelectItem value="electrical">Electrical</SelectItem>
      <SelectItem value="cleaning">Cleaning / Maid Services</SelectItem>
      <SelectItem value="landscaping">Landscaping</SelectItem>
      <SelectItem value="flooring">Flooring (Geral)</SelectItem>
      <SelectItem value="hardwood-flooring">Hardwood Flooring</SelectItem>
      <SelectItem value="luxury-vinyl-plank">Luxury Vinyl Plank (LVP)</SelectItem>
      <SelectItem value="laminate-flooring">Laminate Flooring</SelectItem>
    </SelectGroup>
    <SelectGroup>
      <SelectLabel className="bg-muted uppercase text-[10px] font-black tracking-widest px-4 py-2 mt-2">
        🌎 Outros Mercados
      </SelectLabel>
      <SelectItem value="info-business">Infoprodutos / Mentorias</SelectItem>
      <SelectItem value="health-beauty">Saúde, Estética e Beleza</SelectItem>
      <SelectItem value="real-estate">Imóveis / Corretores</SelectItem>
      <SelectItem value="b2b-saas">B2B / Software (SaaS)</SelectItem>
      <SelectItem value="ecommerce">E-commerce / Físicos</SelectItem>
    </SelectGroup>
    {/* Obrigatório em todos os geradores */}
    <SelectItem value="other">Outro (Personalizado)</SelectItem>
  </SelectContent>
</Select>

{/* Campo de texto aparece quando "Outro" é selecionado */}
{niche === "other" && (
  <Input
    placeholder="Especifique o nicho..."
    value={nicheOther}
    onChange={(e) => setNicheOther(e.target.value)}
    className="mt-2 text-xs"
  />
)}
```

> **Regra crítica:** A opção `"Outro (Personalizado)"` é **obrigatória em todos os selects** de todos os geradores — não apenas no de nicho. Ela deve sempre revelar um `<Input>` inline para personalização.

---

## 5. Resultado — Coluna Direita (col-span-5)

### 5.1 Estrutura Básica

```tsx
<div className="lg:col-span-5 relative">
  <Card className="rounded-[24px] border-border shadow-xl overflow-hidden sticky top-24 animate-fade-up">
    <CardHeader className="px-6 py-5 bg-muted/50 relative border-none">
      <Separator className="absolute bottom-0 left-0 right-0" />
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
          <Terminal size={24} className="text-[COR_DEPTO]" />
          Resultado
        </CardTitle>
        <Badge className="bg-[COR_DEPTO]/20 text-[COR_DEPTO] border-none font-extrabold uppercase tracking-wider text-[0.65rem]">
          [LABEL DO BADGE]
        </Badge>
      </div>
    </CardHeader>

    <CardContent className="p-6 min-h-[400px] flex flex-col">
      {generatedPrompt ? (
        <div className="flex-1 flex flex-col">
          <Textarea
            className="flex-1 bg-input border-none text-foreground font-mono
                       text-[13px] p-4 focus-visible:ring-1 resize-none
                       focus-visible:ring-[COR_DEPTO]/50 rounded-xl custom-scrollbar leading-relaxed"
            readOnly
            value={generatedPrompt}
          />

          <div className="grid grid-cols-2 gap-3 mt-6">
            {/* Botão Favoritar */}
            <Button variant="secondary" onClick={handleFavorite} ...>
              <Star size={20} className="mr-2" />
              Favoritar
            </Button>

            {/* Botão Copiar — ver regra 5.2 */}
            <Button onClick={handleCopy} ...>
              <Copy size={20} className="mr-2" />
              Copiar
            </Button>
          </div>
        </div>
      ) : (
        /* Estado vazio */
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
          <IconeDepto size={48} className="text-[COR_DEPTO] mb-4" />
          <p className="text-muted-foreground max-w-[250px] text-sm font-medium">
            Configure os campos e gere seu prompt.
          </p>
        </div>
      )}
    </CardContent>
  </Card>
</div>
```

### 5.2 Regra do Botão Copiar — Direto vs. Popup

| Situação                                                                  | Comportamento do "Copiar"           |
|---------------------------------------------------------------------------|-------------------------------------|
| Gerador sem referência de arquivo/imagem a ser enviada junto ao prompt    | Copia direto para o clipboard       |
| Gerador **com** referência a arquivo ou imagem para envio junto ao prompt | **Abre popup** de workflow          |

**Exemplo de caso com popup:** `gerador-selos` (requer logo anexada) e `gerador-webdesign` (requer imagens de referência). Nesses casos, o popup deve guiar o usuário no processo de colar o prompt **e** enviar o arquivo/imagem para a IA.

### 5.3 Prompt Fixo ao Scrollar

O card de resultado **deve ser `sticky`**. Nunca remova `sticky top-24` do card de resultado.

---

## 6. Seção de Histórico

O histórico deve aparecer **após o grid de formulário + resultado**, ocupando toda a largura disponível. Use o componente `<GenerationHistory>` existente:

```tsx
<div className="mt-8 animate-fade-up" style={{ animationDelay: "450ms" }}>
  <GenerationHistory
    history={history}
    onRestore={handleRestore}
    generatorName="[id-do-gerador]"
  />
</div>
```

> **Layout:** O histórico ocupa `100%` da largura, cobrindo as colunas do formulário **e** do resultado — formando o "fundo" visual que une as duas colunas.

---

## 7. Footer Padrão

Todo gerador deve terminar com o footer institucional padrão:

```tsx
<footer className="py-12 text-center border-t border-border mt-auto animate-fade-up"
        style={{ animationDelay: "300ms" }}>
  <div className="flex flex-col items-center gap-4">
    <img
      src="/logo/TS-TOOLS-ALLWHITE.svg"
      alt="TS TOOLS"
      className="h-[25px] opacity-20 hover:opacity-50 transition-opacity grayscale"
    />
    <p className="text-[11px] text-muted-foreground/60 font-semibold uppercase tracking-widest leading-none">
      TS TOOLS &copy; {new Date().getFullYear()} &bull; CENTRAL DE FERRAMENTAS
    </p>
    <p className="text-[10px] text-muted-foreground/40 font-medium">
      A solução definitiva para escalar operações de Home Services.
    </p>
  </div>
</footer>
```

---

## 8. Navegação — Sem Botões de Voltar

**Proibido** adicionar botões de "Voltar" nos geradores. A navegação de retorno é responsabilidade **exclusiva** do `Breadcrumbs` global (já injetado pelo `AppLayout`) e do botão nativo do navegador.

```
✅ CORRETO — Usar: <Breadcrumbs /> (já incluso no AppLayout)
❌ ERRADO  — Não adicionar: <Button>← Voltar</Button> ou <Link href="/">← Início</Link>
```

---

## 9. Regras Gerais — Checklist de Conformidade

| # | Regra                                                                                                                    | Status Padrão |
|---|--------------------------------------------------------------------------------------------------------------------------|:-------------:|
| 1 | Título do hero **sempre centralizado**                                                                                   | Obrigatório   |
| 2 | Cor de acento derivada do **departamento** do gerador                                                                    | Obrigatório   |
| 3 | Toggle de modo com labels fixas: **"Básico"** / **"Avançado"** (exatamente, sem variações)                              | Obrigatório   |
| 4 | Toggle posicionado no **canto superior direito do CardHeader**                                                           | Obrigatório   |
| 5 | Todos os Selects contêm a opção **"Outro (Personalizado)"**                                                              | Obrigatório   |
| 6 | Todos os geradores contêm os **nichos padronizados** do sistema (seção 4.4)                                              | Obrigatório   |
| 7 | Resultado **fixo ao scroll** (`sticky top-24`)                                                                           | Obrigatório   |
| 8 | Copiar com referência de arquivo → **popup**; sem referência → **copia direto**                                          | Obrigatório   |
| 9 | Histórico ao final, **full-width** (cobrindo formulário + resultado)                                                     | Obrigatório   |
| 10| **Footer padrão** ao fim de cada gerador                                                                                 | Obrigatório   |
| 11| **Sem botões de Voltar** — apenas Breadcrumbs + navegador                                                                | Obrigatório   |
| 12| Usar ícones `lucide-react` — **sem emojis** na interface funcional                                                      | Obrigatório   |
| 13| Ferramentas, manuais e documentações usam **Roxo** (`violet-500`) como cor de acento                                     | Obrigatório   |
| 14| O botão circular de **ajuda `(?)` (`<FloatingHelpButton />`)** deve estar presente e funcional em todos os geradores         | Obrigatório   |
| 15| Todos os geradores **devem conter um link (`href`)** direcionando o usuário para o Flow/Gemini                          | Obrigatório   |
| 16| A presença do componente **`GenerationHistory` é absolutamente obrigatória** em todos os geradores                      | Obrigatório   |

---

## 10. Mapeamento de Geradores Existentes

| Gerador                 | Rota                  | Departamento     | Cor de Acento          |
|-------------------------|-----------------------|------------------|------------------------|
| Gerador de Imagens      | `/gerador`            | Social Media     | `emerald-500` (verde)  |
| Gerador de Vídeos       | `/gerador-video`      | Audiovisual      | `blue-700` (azul esc.) |
| Web Design Generator    | `/gerador-webdesign`  | Webdesign        | `cyan-500` (azul clar.)|
| Humanizador             | `/gerador-humano`     | Design           | `rose-500` (vermelho)  |
| Antes & Depois          | `/antes-depois`       | Design / Tráfego | `rose-500` (vermelho)  |
| Gerador de Banners      | `/gerador-banners`    | Webdesign        | `cyan-500`             |
| Seal Authority Generator| `/gerador-selos`      | Webdesign / Tráfego | `amber-500`         |
| Gerador de Criativos    | `/workflow`           | Tráfego Pago     | `orange-500`           |
| Manual dos Nichos       | `/docs/nichos`        | Docs             | `violet-500` (roxo)    |
| Prompt Academy          | `/docs`               | Docs             | `violet-500` (roxo)    |

> **Nota:** Geradores multi-departamento usam a cor do **departamento principal** (o primeiro listado).

---

## 11. Exemplo Visual do Fluxo Completo

```
┌─────────────────────────── AppLayout ────────────────────────────────┐
│  Header | Breadcrumbs: HUB > [Gerador]                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│           ╔══════════ HERO (centralizado) ═══════════╗               │
│           ║  [Ícone COR_DEPTO]  Nome do Gerador       ║               │
│           ║            subtítulo técnico               ║               │
│           ╚════════════════════════════════════════════╝               │
│                                                                        │
│  ┌─────────────── col-span-7 ──────────────┐ ┌─── col-span-5 ──────┐ │
│  │                                          │ │                      │ │
│  │  [Presets Gallery]                       │ │  RESULTADO           │ │
│  │                                          │ │  ┌────────────────┐  │ │
│  │  [Card: Formulário]                      │ │  │ Prompt gerado  │  │ │
│  │   ┌─ Título  [Básico] [Avançado] ─────┐  │ │  │ (sticky top)  │  │ │
│  │   │  Campos de input / selects        │  │ │  └────────────────┘  │ │
│  │   │  Nicho (com todos os nichos)      │  │ │  [Favoritar] [Copiar]│ │
│  │   │  + Outro (personalizado)          │  │ │                      │ │
│  │   └───────────────────────────────────┘  │ │                      │ │
│  │  [Botão: Gerar Prompt — COR_DEPTO]       │ │                      │ │
│  └──────────────────────────────────────────┘ └──────────────────────┘ │
│                                                                        │
│  ╔══════════════ HISTÓRICO (full-width) ════════════════════════════╗ │
│  ║  Histórico Recente  |  Ver Completo →                            ║ │
│  ║  [card] [card] [card] [card]                                      ║ │
│  ╚════════════════════════════════════════════════════════════════════╝ │
│                                                                        │
│  ─────────────────────── FOOTER PADRÃO ───────────────────────────── │
│       [Logo]  TS TOOLS © 2026 • CENTRAL DE FERRAMENTAS               │
└──────────────────────────────────────────────────────────────────────┘
```

---

*Última revisão: Abril 2026 — TS Internal Docs*
