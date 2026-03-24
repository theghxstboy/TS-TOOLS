"use client";

import { useState, useEffect, Suspense, useId } from "react";
import {
    CheckSquare, Download, Upload, ListTodo, RotateCcw, Plus,
    MessageSquareText, Copy, Scale, Trash2, GripVertical, Check, Info, Rocket
} from "lucide-react";
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor,
    useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates,
    verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import { useGenerationHistory } from "@/hooks/useGenerationHistory";
import { useClipboard } from "@/hooks/useClipboard";
import { GenerationHistory } from "@/components/GenerationHistory";
import { HistoryItem } from "@/types/generator";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

// Types
type TaskItem = {
    id: string;
    text: string;
    done: boolean;
};

interface ChecklistFormState {
    clientName: string;
    siteUrl: string;
    clientGmail: string;
    emailMode: "prof" | "gmail";
    legalLang: "per" | "en" | "pt";
    legalType: "privacy" | "terms";
    legalView: "preview" | "code";
}

interface ChecklistPayload {
    tasks: TaskItem[];
    form: ChecklistFormState;
}

const DEFAULT_TASKS: TaskItem[] = [
    { id: 't1', text: 'Tirar o domínio da hospedagem do TS, fazer a transferência para conta da hostinger do cliente. Desativar todos os plugins (exceto All-in-One WP Migration).', done: false },
    { id: 't2', text: 'Configurar a hostinger do cliente para IMPORTAR o site no domínio do cliente.', done: false },
    { id: 't3', text: 'Criar um usuário (Admin) para o cliente acessar o painel do Wordpress, depois trocar a senha da conta do TS.', done: false },
    { id: 't4', text: 'Adicionar TERMOS DE USO e POLÍTICAS DE PRIVACIDADE site (privacidade.me). Incluir HTTPS / Cookies / Ads / Idioma. Inserir no FOOTER.', done: false },
    { id: 't5', text: 'Baixar WPS HIDE LOGIN, alterar URL e configurar página 404 para a HOME.', done: false },
    { id: 't6', text: 'Configurar Meta Description de todas as páginas de serviços para SEO, e definir a logo.', done: false },
    { id: 't7', text: 'Linkar todas as formas de contato (IG, FB, Email, Tel) no HEADER, FOOTER, THANKS, REDIRECT, ESTIMATE.', done: false },
    { id: 't8', text: 'Adicionar reviews da empresa (se houver). Se não tiver, remover seção.', done: false },
    { id: 't9', text: 'Adicionar o site no ManageWP Worker.', done: false },
    { id: 't10', text: 'Baixar Wordfence Security, configurar Firewall e baixar HTACSS para o drive.', done: false },
    { id: 't11', text: 'Adicionar Recaptcha V2 e V3 (Colocar o V3 no wordfence). INTEGRAÇÕES ELEMENTOR.', done: false },
    { id: 't12', text: 'Testar os formulários de Estimate e Contato para garantir funcionamento.', done: false },
    { id: 't13', text: 'Configurar a página de THANKS com parâmetro dinâmico para pegar o nome (ex: ?h1=[field id="name"]).', done: false },
    { id: 't14', text: 'Criar planilha no Make, vincular à conta do cliente e TS, configurar e-mail automático.', done: false },
    { id: 't15', text: 'Configurar LiteSpeedCache + CloudFlare, alterar Name Servers, instalar Clean Talk.', done: false },
    { id: 't16', text: 'Salvar todos os acessos no Bitwarden [PLATAFORMA - NOME DO CLIENTE - OPERAÇÃO].', done: false },
    { id: 't17', text: 'Indexar o sitemap.xml no Google Search Console', done: false },
    { id: 't18', text: 'Excluir completamente a instalação do subdomínio da Hospedagem do TS.', done: false },
    { id: 't19', text: 'Enviar os dados no canal da Operação com o modelo de mensagem gerado.', done: false }
];

const DEFAULT_FORM: ChecklistFormState = {
    clientName: "",
    siteUrl: "",
    clientGmail: "",
    emailMode: "prof",
    legalLang: "en",
    legalType: "privacy",
    legalView: "preview"
};

const STORAGE_KEY = 'ts_tools_checklist_tasks';
const FORM_STORAGE_KEY = 'ts_tools_checklist_form';

// --- Legal Generator Templates ---
const getLegalTemplates = (name: string, url: string) => {
    const defaultName = name === '{NOME DO CLIENTE}' || !name ? 'NOME DO SITE' : name;
    let defaultUrl = url === '{URL DO SITE}' || !url ? 'https://urldosite.com' : url;
    if (!defaultUrl.startsWith('http')) defaultUrl = 'https://' + defaultUrl;

    const dateEn = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const datePt = new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });

    return {
        privacy: {
            en: `<h2>Privacy Policy</h2> <p> Your privacy is important to us. It is <strong>${defaultName}'s</strong> policy to respect your privacy regarding any information we may collect from you across our website, <a href='${defaultUrl}'>${defaultName}</a>, and other sites we own and operate.</p> <p> We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used. </p> <p> We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent loss and theft, as well as unauthorised access, disclosure, copying, use or modification.</p> <p> We don't share any personally identifying information publicly or with third-parties, except when required to by law. </p> <p> Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies. </p> <p> You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services. </p> <p>Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us. </p><h2><strong>Cookie Policy</strong> for <strong>${defaultName}</strong> </h2> <p> This is the Cookie Policy for <strong>${defaultName}</strong>, accessible from ${defaultUrl} </p> <h3>What Are Cookies</h3> <p> As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or 'break' certain elements of the sites functionality. </p> <h3>How We Use Cookies</h3> <p> We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use. </p> <h3>Disabling Cookies</h3> <p> You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of the this site. Therefore it is recommended that you do not disable cookies. </p> <h3>The Cookies We Set</h3> <ul> <li>Account related cookies <br>If you create an account with us then we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out however in some cases they may remain afterwards to remember your site preferences when logged out.</li> <li>Login related cookies <br>We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page. These cookies are typically removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in.</li> <li>Email newsletters related cookies <br> <br>This site offers newsletter or email subscription services and cookies may be used to remember if you are already registered and whether to show certain notifications which might only be valid to subscribed/unsubscribed users.</li> <li>Orders processing related cookies <br>This site offers e-commerce or payment facilities and some cookies are essential to ensure that your order is remembered between pages so that we can process it properly.</li> <li>Surveys related cookies <br>From time to time we offer user surveys and questionnaires to provide you with interesting insights, helpful tools, or to understand our user base more accurately. These surveys may use cookies to remember who has already taken part in a survey or to provide you with accurate results after you change pages.</li> <li>Forms related cookies <br>When you submit data to through a form such as those found on contact pages or comment forms cookies may be set to remember your user details for future correspondence.</li> <li>Site preferences cookies <br>In order to provide you with a great experience on this site we provide the functionality to set your preferences for how this site runs when you use it. In order to remember your preferences we need to set cookies so that this information can be called whenever you interact with a page is affected by your preferences.</li> </ul> <h3>Third Party Cookies</h3> <p> In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site. </p> <ul> <li>This site uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content. For more information on Google Analytics cookies, see the official Google Analytics page. <li>Third party analytics are used to track and measure usage of this site so that we can continue to produce engaging content. These cookies may track things such as how long you spend on the site or pages you visit which helps us to understand how we can improve the site for you.</li> <li>From time to time we test new features and make subtle changes to the way that the site is delivered. When we are still testing new features these cookies may be used to ensure that you receive a consistent experience whilst on the site whilst ensuring we understand which optimisations our users appreciate the most.</li> <li>As we sell products it's important for us to understand statistics about how many of the visitors to our site actually make a purchase and as such this is the kind of data that these cookies will track. This is important to you as it means that we can accurately make business predictions that allow us to monitor our advertising and product costs to ensure the best possible price.</li> </li> <li>We also use social media buttons and/or plugins on this site that allow you to connect with your social network in various ways. For these to work the following social media sites including; {List the social networks whose features you have integrated with your site?:12}, will set cookies through our site which may be used to enhance your profile on their site or contribute to the data they hold for various purposes outlined in their respective privacy policies.</li> </ul><h2>More Information</h2> <p> Hopefully that has clarified things for you and as was previously mentioned if there is something that you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site. </p> <p> This policy is effective as of <strong>${dateEn}</strong>. </p>`,
            pt: `<h2>Política de Privacidade</h2> <p> A sua privacidade é importante para nós. É política do <strong>${defaultName}</strong> respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site <a href='${defaultUrl}'>${defaultName}</a>, e outros sites que possuímos e operamos.</p> <p> Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemos isso por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como os dados serão usados. </p> <p> Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, os protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p> <p> Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei. </p> <p> O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade. </p> <p> Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados. </p> <p>O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se tiver alguma dúvida sobre como lidamos com os dados do usuário e informações pessoais, entre em contato conosco. </p><h2><strong>Política de Cookies</strong> para o <strong>${defaultName}</strong> </h2> <p> Esta é a Política de Cookies para o <strong>${defaultName}</strong>, acessível a partir de ${defaultUrl} </p> <h3>O que são cookies</h3> <p> Como é prática comum com quase todos os sites profissionais, este site usa cookies, que são pequenos arquivos baixados no seu computador, para melhorar a sua experiência. Esta página descreve quais informações eles agrupam, como os usamos e por que às vezes precisamos armazenar esses cookies. Também compartilharemos como você pode impedir que esses cookies sejam armazenados, no entanto, isso pode fazer o downgrade ou 'quebrar' certos elementos da funcionalidade do site. </p> <h3>Como usamos cookies</h3> <p> Usamos cookies por vários motivos, detalhados abaixo. Infelizmente, na maioria dos casos, não existem opções padrão do setor para desativar os cookies sem desativar completamente a funcionalidade e os recursos que eles adicionam a este site. É recomendável que você deixe todos os cookies se não tiver certeza se precisa deles ou não, caso sejam usados para fornecer um serviço que você usa. </p> <h3>Desativando Cookies</h3> <p> Você pode evitar a configuração de cookies ajustando as configurações do seu navegador (consulte a Ajuda do navegador para saber como fazer isso). Esteja ciente de que a desativação de cookies afetará a funcionalidade deste e de muitos outros sites que você visita. A desativação de cookies geralmente resultará na desativação também de certas funcionalidades e recursos deste site. Portanto, é recomendável que você não desative os cookies. </p> <h3>Os cookies que definimos</h3> <ul> <li>Cookies relacionados à conta<br>Se você criar uma conta conosco, usaremos cookies para o gerenciamento do processo de inscrição e da administração geral. Esses cookies geralmente serão excluídos quando você sair; no entanto, em alguns casos, eles podem permanecer depois para lembrar as suas preferências de site quando não estiver logado.</li> <li>Cookies relacionados ao login<br>Usamos cookies quando você está logado para que possamos lembrar dessa ação. Isso evita que você precise fazer login sempre que visitar uma nova página. Esses cookies são normalmente removidos ou limpos quando você sai, para garantir que você só possa acessar recursos e áreas restritos quando estiver conectado.</li> <li>Cookies relacionados a boletins por e-mail<br>Este site oferece serviços de assinatura de boletim informativo ou e-mail e os cookies podem ser usados para lembrar se você já está registrado e se deve mostrar determinadas notificações válidas apenas para usuários inscritos/não inscritos.</li> <li>Pedidos de processamento de cookies relacionados<br>Este site oferece facilidades de comércio eletrônico ou pagamento e alguns cookies são essenciais para garantir que o seu pedido seja lembrado entre as páginas, para que possamos processá-lo adequadamente.</li> <li>Cookies relacionados a pesquisas<br>Periodicamente, oferecemos pesquisas e questionários de usuários para fornecer informações interessantes, ferramentas úteis ou para entender a nossa base de usuários com mais precisão. Essas pesquisas podem usar cookies para lembrar quem já participou de uma pesquisa ou para fornecer resultados precisos após a alteração das páginas.</li> <li>Cookies relacionados a formulários<br>Quando você envia dados por meio de um formulário, como aqueles encontrados nas páginas de contato ou nos formulários de comentários, os cookies podem ser configurados para lembrar os detalhes de usuário para correspondência futura.</li> <li>Cookies de preferências de site<br>Para fornecer uma ótima experiência neste site, fornecemos a funcionalidade de definir as suas preferências de como o site funciona quando você o usa. Para lembrar as suas preferências, precisamos definir cookies para que essas informações possam ser chamadas sempre que você interagir com uma página que for afetada pelas suas preferências.</li> </ul> <h3>Cookies de Terceiros</h3> <p> Em alguns casos especiais, também usamos cookies fornecidos por terceiros confiáveis. A seção a seguir detalha quais cookies de terceiros você pode encontrar neste site. </p> <ul> <li>Este site usa o Google Analytics, que é uma das soluções de análise mais difundidas e confiáveis da web para nos ajudar a entender como você usa o site e como podemos melhorar sua experiência. Esses cookies podem rastrear itens como quanto tempo você gasta no site e as páginas que visita, para que possamos continuar produzindo conteúdo atraente. Para obter mais informações sobre cookies do Google Analytics, consulte a página oficial do Google Analytics. <li>As análises de terceiros são usadas para rastrear e medir o uso deste site, para que possamos continuar produzindo conteúdo atrativo. Esses cookies podem rastrear itens como o tempo que você passa no site ou as páginas visitadas, o que nos ajuda a entender como podemos melhorar o site para você.</li> <li>Peridicamente, testamos novos recursos e fazemos mudanças sutis na maneira como o site é entregue. Quando ainda estamos testando novos recursos, esses cookies podem ser usados para garantir que você receba uma experiência consistente enquanto estiver no site, garantindo também que entendemos quais otimizações nossos usuários mais apreciam.</li> <li>À medida que vendemos produtos, é importante entendermos as estatísticas sobre quantos visitantes de nosso site realmente fazem uma compra e, portanto, esse é o tipo de dados que esses cookies rastrearão. Isso é importante para você porque significa que podemos fazer previsões de negócios com precisão, o que nos permite analisar nossos custos de publicidade e produtos para garantir o melhor preço possível.</li> </li> <li>Também usamos botões e/ou plug-ins de mídia social neste site que permitem conexões com sua rede social de várias maneiras. Para que eles funcionem, as seguintes redes sociais, incluindo: {Liste as redes sociais cujos recursos você integrou com o seu site?:12}, irão definir cookies no nosso site, que podem ser usados para melhorar seu perfil nos sites deles ou contribuir para os dados armazenados de acordo com os propósitos delineados em suas respectivas políticas de privacidade.</li> </ul><h2>Mais Informações</h2> <p> Esperemos que isso tenha esclarecido as coisas para você e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site. </p> <p> Esta política é efetiva a partir de <strong>${datePt}</strong>. </p>`
        },
        terms: {
            en: `<h2>1. Terms of Service</h2> <h3>1. Terms</h3> <p>By accessing the website at <a href='${defaultUrl}'>${defaultName}</a> you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p> <h3>2. Use License</h3> <ol> <li> Permission is granted to temporarily download one copy of the materials (information or software) on ${defaultName}'s website for personal, non-commercial transitory viewing only. This is the grant of a licence, not a transfer of title, and under this licence you may not: <ol> <li>modify or copy the materials;</li> <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li> <li>attempt to decompile or reverse engineer any software contained on ${defaultName} website;</li> <li>remove any copyright or other proprietary notations from the materials; or</li> <li>transfer the materials to another person or 'mirror' the materials on any other server.</li> </ol> </li> <li> 2. This licence shall automatically terminate if you violate any of these restrictions and may be terminated by ${defaultName} at any time. Upon terminating your viewing of these materials or upon the termination of this licence, you must destroy any downloaded materials in your possession whether in electronic or printed format. </li> </ol> <h3>3. Disclaimer</h3> <ol> <li>1. The materials on ${defaultName}'s website are provided on an 'as is' basis. ${defaultName} makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</li> <li>2. Further, ${defaultName} does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</li> </ol> <h3>4. Limitations</h3> <p>In no event shall ${defaultName} or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ${defaultName}'s website, even if ${defaultName} or a ${defaultName} authorised representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p> <h3>5. Accuracy of materials</h3> <p>The materials appearing on ${defaultName}'s website could include technical, typographical, or photographic errors. ${defaultName} does not warrant that any of the materials on its website are accurate, complete or current. ${defaultName} may make changes to the materials contained on its website at any time without notice. However ${defaultName} does not make any commitment to update the materials.</p> <h3>6. Links</h3> <p>${defaultName} has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by ${defaultName} of the site. Use of any such linked website is at the user's own risk.</p> <h3>7. Modifications</h3> <p>${defaultName} may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p> <h3>8. Governing Law</h3> <p>These terms and conditions are governed by and construed in accordance with the laws of ${defaultName} and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>`,
            pt: `<h2>1. Termos de Serviço</h2> <h3>1. Termos</h3> <p>Ao acessar o site do <a href='${defaultUrl}'>${defaultName}</a>, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.</p> <h3>2. Uso de Licença</h3> <ol> <li> É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site do ${defaultName}, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título, e sob esta licença você não pode: <ol> <li>modificar ou copiar os materiais;</li> <li>usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li> <li>tentar descompilar ou fazer engenharia reversa de qualquer software contido no site do ${defaultName};</li> <li>remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou</li> <li>transferir os materiais para outra pessoa ou 'espelhar' os materiais em qualquer outro servidor.</li> </ol> </li> <li> 2. Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por ${defaultName} a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve destruir todos os materiais baixados em sua posse, seja em formato eletrônico ou impresso. </li> </ol> <h3>3. Isenção de responsabilidade</h3> <ol> <li>1. Os materiais no site do ${defaultName} são fornecidos 'como estão'. O ${defaultName} não oferece garantias, expressas ou implícitas, e por este meio isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.</li> <li>2. Além disso, o ${defaultName} não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.</li> </ol> <h3>4. Limitações</h3> <p>Em nenhum caso o ${defaultName} ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais no site do ${defaultName}, mesmo que ${defaultName} ou a um representante autorizado do ${defaultName} tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos consequentes ou incidentais, essas limitações podem não se aplicar a você.</p> <h3>5. Precisão dos materiais</h3> <p>Os materiais exibidos no site do ${defaultName} podem incluir erros técnicos, tipográficos ou fotográficos. O ${defaultName} não garante que qualquer material em seu site seja preciso, completo ou atual. O ${defaultName} pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, o ${defaultName} não se compromete a atualizar os materiais.</p> <h3>6. Links</h3> <p>O ${defaultName} não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por ${defaultName} do site. O uso de qualquer site vinculado é por conta e risco do usuário.</p> <h3>7. Modificações</h3> <p>O ${defaultName} pode revisar estes termos de serviço do seu site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual destes termos de serviço.</p> <h3>8. Lei Aplicável</h3> <p>Estes termos e condições são regidos e interpretados de acordo com as leis do ${defaultName} e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.</p>`
        }
    };
};

// --- Sortable Task Component ---
function SortableTask({ task, index, onToggle, onEdit, onDelete }: {
    task: TaskItem;
    index: number;
    onToggle: (id: string) => void;
    onEdit: (id: string, text: string) => void;
    onDelete: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-start gap-3 p-4 rounded-xl border transition-all text-left bg-card relative group animate-fade-up",
                task.done ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30",
                isDragging ? "shadow-2xl border-primary scale-[1.02]" : ""
            )}
        >
            <button
                {...attributes}
                {...listeners}
                className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-primary transition-colors focus:outline-none"
            >
                <GripVertical size={18} />
            </button>

            <button
                onClick={() => onToggle(task.id)}
                className={cn(
                    "w-6 h-6 shrink-0 rounded-[6px] border-[2.5px] flex items-center justify-center transition-all mt-0.5 outline-none cursor-pointer",
                    task.done ? "bg-primary border-primary text-black" : "border-muted-foreground/30 group-hover:border-primary/50 bg-background"
                )}
            >
                {task.done && <Check size={14} />}
            </button>

            <div className="flex-1">
                <Textarea
                    className={cn(
                        "resize-none outline-none border-none p-0 h-auto min-h-[24px] rounded-none focus-visible:ring-0 shadow-none leading-relaxed overflow-hidden py-0.5",
                        task.done ? "text-muted-foreground line-through" : "text-foreground"
                    )}
                    value={task.text}
                    onChange={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                        onEdit(task.id, e.target.value);
                    }}
                    onFocus={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    rows={1}
                />
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onDelete(task.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors focus:outline-none"
                    title="Excluir Tarefa"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}

function ChecklistWebDesignContent() {
    // Basic states
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [formState, setFormState] = useState<ChecklistFormState>(DEFAULT_FORM);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskText, setNewTaskText] = useState("");
    const [mounted, setMounted] = useState(false);

    // Derived states
    const [messageModel, setMessageModel] = useState("");
    const [legalPreview, setLegalPreview] = useState("");

    const { isCopied: isMsgCopied, copy: copyMsg } = useClipboard();
    const { isCopied: isLegalCopied, copy: copyLegal } = useClipboard();
    const { history, saveHistory } = useGenerationHistory<ChecklistPayload>("checklist-webdesign");

    // DND Kit Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Load initial states from localStorage or defaults
    useEffect(() => {
        setMounted(true);
        const storedTasks = localStorage.getItem(STORAGE_KEY);
        if (storedTasks) {
            try { setTasks(JSON.parse(storedTasks)); } catch (e) { setTasks([...DEFAULT_TASKS]); }
        } else {
            setTasks([...DEFAULT_TASKS]);
        }

        const storedForm = localStorage.getItem(FORM_STORAGE_KEY);
        if (storedForm) {
            try { setFormState(JSON.parse(storedForm)); } catch (e) { }
        }
    }, []);

    // Effect for generating the Message Model
    useEffect(() => {
        const cleanUrl = (urlStr: string) => {
            if (!urlStr) return { full: '', domain: '', suffix: '' };
            let clean = urlStr.replace(/(^\w+:|^)\/\//, '').replace(/^www\./, '');
            if (clean.endsWith('/')) clean = clean.slice(0, -1);
            const domainParts = clean.split('.');
            const namePart = domainParts[0];

            let suffix = '/wp-admin';
            if (namePart.length > 0) {
                const first = namePart.charAt(0);
                const last = namePart.charAt(namePart.length - 1);
                suffix = `/${first}${last}-painel`;
            }

            return {
                full: urlStr.startsWith('http') ? urlStr : `https://${clean}`,
                domainOnly: clean,
                panelSuffix: suffix
            };
        };

        const { clientName, siteUrl, clientGmail, emailMode } = formState;
        const name = clientName || '{NOME DO CLIENTE}';
        const urlData = cleanUrl(siteUrl);
        const fullSiteUrl = urlData.full || '{URL DO SITE}';
        const redirectUrl = urlData.full ? `${urlData.full}/redirect` : '{URL DO SITE}/redirect';
        const wpLink = urlData.full ? `${urlData.full}${urlData.panelSuffix}` : '{URL DO SITE}/(sigla)-painel';
        const gmailText = clientGmail || '{GMAIL DO CLIENTE}';

        let emailProHeader = '';
        if (emailMode === 'prof') {
            const domainEmail = urlData.domainOnly ? `contact@${urlData.domainOnly}` : 'contact@dominio.com';
            emailProHeader = domainEmail;
        } else {
            emailProHeader = gmailText;
        }

        let msg = `Bom dia / Boa tarde @Sua Operação\n\n`;
        msg += `O site da empresa **${name}** está finalizado, e já se encontra disponível para acesso.\n\n`;
        msg += `**Home**: ${fullSiteUrl}\n`;
        msg += `**Redirect**: ${redirectUrl}\n`;
        msg += `**Email de Contato**: ${emailProHeader}\n\n`;

        msg += `Segue algumas informações:\n\n`;
        msg += `Link do site: ${fullSiteUrl}\n`;
        msg += `Acessos Wordpress\nLink: ${wpLink}\n`;
        msg += `Usuário e senha: **INFORMAÇÃO NO BITWARDEN**\n\n`;
        msg += `Email usado para a criação do usuário: ${gmailText}\n\n`;

        if (emailMode === 'prof') {
            msg += `E-mail profissional usado: ${emailProHeader}\n`;
            msg += `Onde acessar: https://hostinger.titan.email/mail/\n`;
            msg += `Usuário e Senha - **INFORMAÇÃO NO BITWARDEN**\n`;
            msg += `É nele que vocês vão receber os formulários do site.\n`;
        } else {
            msg += `E-mail usado: ${gmailText}\n(Cliente optou por usar Gmail pessoal/comercial existente, não criamos email Titan)\n`;
        }

        msg += `\nPlanilha de Estimates Make (Aba ESTIMATE): \n\n`;
        msg += `Acessos cloudflare (CDN que usamos para otimizar velocidade e segurança do website, é aqui que serão feitas quaisquer alterações dos registros DNS):\n`;
        msg += `**INFORMAÇÃO NO BITWARDEN**`;

        setMessageModel(msg);

        // Also generate legal model here
        const temps = getLegalTemplates(clientName, siteUrl);
        // Map "per" if previously selected as a fallback to a valid lang. Only en or pt exist in HTML
        const langKey = formState.legalLang === 'en' || formState.legalLang === 'pt' ? formState.legalLang : 'en';
        setLegalPreview(temps[formState.legalType][langKey]);

    }, [formState]);

    // Save states to local storage on change
    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formState));
    }, [tasks, formState, mounted]);

    // Handlers
    const updateForm = (key: keyof ChecklistFormState, value: any) => {
        setFormState(prev => ({ ...prev, [key]: value }));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        setTasks((items) => {
            const oldIndex = items.findIndex(t => t.id === active.id);
            const newIndex = items.findIndex(t => t.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
        });
    };

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const editTask = (id: string, text: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, text } : t));
    };

    const deleteTask = (id: string) => {
        if (confirm("Tem certeza que deseja remover esta tarefa?")) {
            setTasks(prev => prev.filter(t => t.id !== id));
        }
    };

    const handleSaveTask = () => {
        if (!newTaskText.trim()) return;
        const newTask: TaskItem = { id: `custom-${Date.now()}`, text: newTaskText, done: false };
        setTasks(prev => [...prev, newTask]);
        setNewTaskText("");
        setIsAddingTask(false);
    };

    const handleReset = () => {
        if (confirm("Isso apagará todas as tarefas atuais e voltará para o padrão. Continuar?")) {
            setTasks([...DEFAULT_TASKS]);
            setFormState({ ...DEFAULT_FORM });
        }
    };

    const handleCopyMsg = () => {
        copyMsg(messageModel);
        handleSaveSnapshot("Mensagem Copiada");
    };

    const handleCopyLegalHtml = () => {
        copyLegal(legalPreview);
        handleSaveSnapshot("Termos Copiados");
    };

    const handleSaveSnapshot = (actionName: string = "Salvo Manualmente") => {
        saveHistory({
            tasks,
            form: formState
        }, `[${actionName}] ${formState.clientName || 'Cliente Sem Nome'}`);
    };

    const handleRestore = (item: HistoryItem<ChecklistPayload>) => {
        const p = item.payload;
        if (!p) return;
        if (p.tasks) setTasks(p.tasks);
        if (p.form) setFormState(p.form);
    };

    const handleExport = () => {
        const payload: ChecklistPayload = { tasks, form: formState };
        const data = JSON.stringify(payload, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `checklist_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const f = (e.target as HTMLInputElement).files?.[0];
            if (!f) return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const j = JSON.parse(reader.result as string) as ChecklistPayload;
                    if (j.tasks) setTasks(j.tasks);
                    if (j.form) setFormState(j.form);
                    alert('Checklist importado com sucesso!');
                } catch (err) {
                    alert('Erro ao ler o arquivo JSON. Certifique-se que é o backup correto.');
                }
            };
            reader.readAsText(f);
        };
        input.click();
    };

    if (!mounted) return null;

    return (
        <div className="flex-1 w-full min-h-screen bg-background text-foreground selection:bg-cyan-500/30 pb-20 font-sans">
            {/* Hero Section */}
            <div className="max-w-[1400px] mx-auto px-6 py-8 md:py-12 text-center animate-fade-up">
                <div className="inline-flex items-center gap-3 mb-4">
                    <div className="size-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-black shadow-lg">
                        <CheckSquare size={28} />
                    </div>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
                    Checklist & <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Setup Web</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Acompanhe entregas e gere as mensagens e políticas para a Operação automaticamente.
                </p>
            </div>

            {/* Main Content */}
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex justify-end gap-3 mb-6">
                    <Button variant="outline" size="sm" onClick={handleExport} className="h-9 px-4">
                        <Download size={16} className="mr-2" /> Exportar
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleImport} className="h-9 px-4">
                        <Upload size={16} className="mr-2" /> Importar
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN: Checklist */}
                    <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-up" style={{ animationDelay: '80ms' }}>
                        <div className="bg-card rounded-[24px] border border-border shadow-xl p-6 lg:p-8">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <ListTodo size={24} className="text-cyan-500" />
                                    Tarefas da Migração
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive">
                                        <RotateCcw size={14} className="mr-1.5" /> Resetar
                                    </Button>
                                    <Button size="sm" onClick={() => { setIsAddingTask(true); }} className="h-8 bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
                                        <Plus size={16} className="mr-1.5" /> Novo
                                    </Button>
                                </div>
                            </div>

                            <div className="mb-6 flex items-center gap-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-4 py-3 rounded-lg text-sm">
                                <Info size={16} className="shrink-0" />
                                Todas as alterações são salvas automaticamente no navegador.
                            </div>

                            <div className="flex flex-col gap-3 min-h-[200px]">
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
                                    <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                                        {tasks.map((task, i) => (
                                            <SortableTask
                                                key={task.id} task={task} index={i}
                                                onToggle={toggleTask} onEdit={editTask} onDelete={deleteTask}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>

                                {tasks.length === 0 && (
                                    <div className="text-center py-10 opacity-50">
                                        <ListTodo size={48} className="mx-auto mb-4" />
                                        <p>Nenhuma tarefa restante.</p>
                                    </div>
                                )}
                            </div>

                            {isAddingTask && (
                                <div className="mt-4 flex gap-3 animate-fade-up border border-cyan-500/30 bg-cyan-500/5 p-4 rounded-xl">
                                    <Input
                                        placeholder="Escreva a nova tarefa..."
                                        value={newTaskText}
                                        onChange={e => setNewTaskText(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTask(); }}
                                        className="flex-1 bg-background"
                                        autoFocus
                                    />
                                    <Button onClick={handleSaveTask} className="bg-cyan-500 hover:bg-cyan-600 text-black">Salvar</Button>
                                    <Button variant="outline" onClick={() => { setIsAddingTask(false); setNewTaskText(""); }}>Cancelar</Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Output Generators */}
                    <div className="lg:col-span-5 animate-fade-up" style={{ animationDelay: '160ms' }}>
                        <div className="sticky top-6 flex flex-col gap-6">

                        {/* MESSAGE GENERATOR CARD */}
                        <div className="bg-card rounded-[24px] border border-border shadow-xl p-6 lg:p-8">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6 border-b border-border pb-4">
                                <MessageSquareText size={24} className="text-cyan-500" />
                                Mensagem Modelo
                            </h2>

                            <div className="space-y-5">
                                <div className="space-y-3">
                                    <Label className="text-muted-foreground font-semibold">Tipo do email WordPress</Label>
                                    <RadioGroup
                                        className="flex gap-4 p-3 bg-input/50 rounded-xl border border-border"
                                        value={formState.emailMode}
                                        onValueChange={(v: string) => updateForm("emailMode", v)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="prof" id="r-prof" className="text-cyan-500 border-cyan-500" />
                                            <Label htmlFor="r-prof" className="cursor-pointer text-sm font-medium">Email Titan/Hostinger</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="gmail" id="r-gmail" className="text-cyan-500 border-cyan-500" />
                                            <Label htmlFor="r-gmail" className="cursor-pointer text-sm font-medium">Gmail Pessoal</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div>
                                    <Label className="block mb-2 font-semibold">Nome do Cliente</Label>
                                    <Input
                                        placeholder="Ex: House Carpentry MA"
                                        value={formState.clientName}
                                        onChange={e => updateForm("clientName", e.target.value)}
                                        className="bg-input border-border"
                                    />
                                </div>

                                <div>
                                    <Label className="block mb-2 font-semibold">URL do Site Principal</Label>
                                    <Input
                                        placeholder="Ex: housecarpentryma.com"
                                        value={formState.siteUrl}
                                        onChange={e => updateForm("siteUrl", e.target.value)}
                                        className="bg-input border-border"
                                    />
                                </div>

                                <div>
                                    <Label className="block mb-2 font-semibold">Email / Gmail do Cliente</Label>
                                    <Input
                                        placeholder="Ex: joao@gmail.com"
                                        value={formState.clientGmail}
                                        onChange={e => updateForm("clientGmail", e.target.value)}
                                        className="bg-input border-border"
                                    />
                                </div>

                                <div className="pt-4 border-t border-border">
                                    <div className="flex items-center justify-between mb-3">
                                        <Label className="font-bold text-foreground">Resultado Gerado</Label>
                                    </div>
                                    <Textarea
                                        readOnly
                                        value={messageModel}
                                        className="h-[200px] bg-input border-border resize-y font-mono text-xs text-muted-foreground focus-visible:ring-cyan-500 custom-scrollbar mb-4"
                                    />
                                    <Button
                                        onClick={handleCopyMsg}
                                        className={cn("w-full font-bold transition-all shadow-md", isMsgCopied ? "bg-green-600 hover:bg-green-700 text-black" : "bg-cyan-500 hover:bg-cyan-600 text-black")}
                                    >
                                        {isMsgCopied ? <Check size={18} className="mr-2" /> : <Copy size={18} className="mr-2" />}
                                        Copiar Mensagem
                                    </Button>
                                    <div className="mt-2 text-center text-xs text-muted-foreground">
                                        Isso salvará um Snapshot da sua checklist no Histórico abaixo.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LEGAL GENERATOR CARD */}
                        <div className="bg-card rounded-[24px] border border-border shadow-xl p-6 lg:p-8">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6 border-b border-border pb-4">
                                <Scale size={24} className="text-cyan-500" />
                                Políticas e Termos
                            </h2>

                            <div className="grid grid-cols-2 gap-4 mb-5">
                                <div>
                                    <Label className="block mb-2 text-muted-foreground font-semibold">Idioma</Label>
                                    <RadioGroup
                                        className="flex flex-col gap-3 p-3 bg-input/50 rounded-xl border border-border"
                                        value={formState.legalLang}
                                        onValueChange={(v: string) => updateForm("legalLang", v)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="en" id="l-en" className="text-cyan-500 border-cyan-500" />
                                            <Label htmlFor="l-en" className="cursor-pointer text-sm">Inglês</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="pt" id="l-pt" className="text-cyan-500 border-cyan-500" />
                                            <Label htmlFor="l-pt" className="cursor-pointer text-sm">Português BR</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div>
                                    <Label className="block mb-2 text-muted-foreground font-semibold">Documento</Label>
                                    <RadioGroup
                                        className="flex flex-col gap-3 p-3 bg-input/50 rounded-xl border border-border"
                                        value={formState.legalType}
                                        onValueChange={(v: string) => updateForm("legalType", v)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="privacy" id="t-priv" className="text-cyan-500 border-cyan-500" />
                                            <Label htmlFor="t-priv" className="cursor-pointer text-sm">Privacidade</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="terms" id="t-term" className="text-cyan-500 border-cyan-500" />
                                            <Label htmlFor="t-term" className="cursor-pointer text-sm">Termos</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="flex items-center justify-between mb-3">
                                    <Label className="font-bold text-foreground">Apresentação</Label>
                                    <RadioGroup
                                        className="flex gap-4"
                                        value={formState.legalView}
                                        onValueChange={(v: string) => updateForm("legalView", v)}
                                    >
                                        <div className="flex items-center space-x-1.5">
                                            <RadioGroupItem value="preview" id="v-prev" className="text-cyan-500 border-cyan-500 w-3 h-3" />
                                            <Label htmlFor="v-prev" className="cursor-pointer text-xs">Preview</Label>
                                        </div>
                                        <div className="flex items-center space-x-1.5">
                                            <RadioGroupItem value="code" id="v-code" className="text-cyan-500 border-cyan-500 w-3 h-3" />
                                            <Label htmlFor="v-code" className="cursor-pointer text-xs">Código HTML</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {formState.legalView === "preview" ? (
                                    <div
                                        className="h-[200px] overflow-y-auto bg-input/50 border border-border p-4 rounded-xl text-sm prose prose-invert max-w-none custom-scrollbar mb-4"
                                        dangerouslySetInnerHTML={{ __html: legalPreview }}
                                    />
                                ) : (
                                    <Textarea
                                        readOnly
                                        value={legalPreview}
                                        className="h-[200px] bg-input border-border resize-none font-mono text-xs text-muted-foreground focus-visible:ring-cyan-500 custom-scrollbar mb-4"
                                    />
                                )}

                                <Button
                                    onClick={handleCopyLegalHtml}
                                    variant="secondary"
                                    className={cn("w-full transition-all border-none font-semibold", isLegalCopied ? "bg-green-600 hover:bg-green-700 text-black" : "bg-input hover:bg-muted-foreground/20")}
                                >
                                    {isLegalCopied ? <Check size={18} className="mr-2" /> : <Copy size={18} className="mr-2" />}
                                    Copiar HTML
                                </Button>
                            </div>

                        </div>
                        </div>
                    </div>
                </div>

                {/* History Section - Full Width */}
                <div className="mt-8">
                    <GenerationHistory
                        history={history}
                        onRestore={handleRestore}
                        generatorName="checklist-webdesign"
                    />
                </div>
            </div>
        </div>
    );
}

export default function ChecklistWebDesignPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">Carregando checklist...</div>}>
            <ChecklistWebDesignContent />
        </Suspense>
    );
}
