'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';

// Sample article data - in a real app, this would come from an API or database
// Dados dos artigos com conteúdo expandido
const articlesData: { [key: string]: {
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  content: string;
} } = {
  'checklist-manutencao-preventiva': {
    title: 'Checklist de Manutenção Preventiva para Seu Veículo',
    category: 'Manutenção',
    date: '28 de Janeiro, 2025',
    readTime: '5 min de leitura',
    author: 'Equipe Spagnol',
    image: '/images/img-blog/cheklist-blog1.jpg',
    content: `
      <h2>Por que a manutenção preventiva é importante?</h2>
      
      <p>A manutenção preventiva é fundamental para garantir a segurança, economia e longevidade do seu veículo. Ao realizar verificações regulares, você pode identificar e corrigir pequenos problemas antes que se tornem grandes e caros reparos.</p>
      
            
      <h2>Checklist Completo de Manutenção</h2>
      
      <h3>Verificações Diárias</h3>
      
      <ul>
        <li>Nível de combustível</li>
        <li>Pressão dos pneus (incluindo o estepe)</li>
        <li>Funcionamento das luzes (faróis, lanternas, setas)</li>
        <li>Espelhos retrovisores</li>
      </ul>
      
            
      <h3>Verificações Semanais</h3>
      
      <ul>
        <li>Nível do óleo do motor</li>
        <li>Nível do fluido de arrefecimento</li>
        <li>Nível do fluido de freio</li>
        <li>Limpador de para-brisa (palhetas e reservatório de água)</li>
      </ul>
      
            
      <h3>Verificações Mensais</h3>
      
      <ul>
        <li>Estado dos pneus (desgaste irregular, cortes, bolhas)</li>
        <li>Bateria (terminais e carga)</li>
        <li>Correias do motor</li>
        <li>Sistema de ar-condicionado</li>
      </ul>
      
            
      <h2>Dicas Extras</h2>
      
      <p>Mantenha sempre um registro das manutenções realizadas. Isso ajuda a manter o histórico do veículo e pode valorizar na hora da revenda. Além disso, siga sempre as recomendações do fabricante quanto aos intervalos de troca de óleo, filtros e outros componentes.</p>
      
            
      <h2>Quando procurar ajuda profissional?</h2>
      
      <p>Alguns sinais indicam que é hora de procurar um profissional especializado:</p>
      
      <ul>
        <li>Luzes de advertência no painel</li>
        <li>Ruídos estranhos no motor ou transmissão</li>
        <li>Perda de potência ou consumo excessivo</li>
        <li>Vazamentos de fluidos</li>
        <li>Dificuldade na partida</li>
      </ul>
      
            
      <h2>Economia a longo prazo</h2>
      
      <p>A manutenção preventiva pode parecer um gasto desnecessário, mas na verdade é um investimento. Veículos bem mantidos:</p>
      
      <ul>
        <li>Consomem menos combustível</li>
        <li>Têm maior vida útil</li>
        <li>Apresentam menos quebras inesperadas</li>
        <li>Mantêm melhor valor de revenda</li>
        <li>São mais seguros para dirigir</li>
      </ul>
      
            
      <h2>Conclusão</h2>
      
      <p>A manutenção preventiva é essencial para garantir a segurança, economia e longevidade do seu veículo. Com este checklist em mãos, você está preparado para cuidar melhor do seu patrimônio.</p>
      
            
      <p>Na Mecânica Spagnol, oferecemos serviços completos de manutenção preventiva para todos os tipos de veículos pesados. Nossa equipe especializada está pronta para ajudar você a manter seu veículo em perfeitas condições. Entre em contato conosco e agende sua revisão!</p>
    `
  },
  'sistema-freios-guia-completo': {
    title: 'Sistema de Freios: Guia Completo de Cuidados',
    category: 'Segurança',
    date: '25 de Janeiro, 2025',
    readTime: '7 min de leitura',
    author: 'Equipe Spagnol',
    image: '/images/img-blog/freio-blog2.png',
    content: `
      <h2>Como funciona o sistema de freios?</h2>
      
      <p>O sistema de freios é um dos componentes mais importantes para a segurança do seu veículo. Ele é responsável por reduzir a velocidade e parar o veículo de forma segura e controlada.</p>
      
            
      <h2>Componentes principais do sistema</h2>
      
      <ul>
        <li><strong>Pedal de freio:</strong> Transmite a força do motorista para o sistema</li>
        <li><strong>Cilindro mestre:</strong> Converte a força mecânica em pressão hidráulica</li>
        <li><strong>Fluido de freio:</strong> Transmite a pressão através do sistema</li>
        <li><strong>Pastilhas e discos:</strong> Criam o atrito necessário para parar o veículo</li>
      </ul>
      
            
      <h2>Sinais de desgaste no sistema de freios</h2>
      
      <h3>Ruídos anormais</h3>
      
      <p>Chiados, rangidos ou ruídos metálicos ao frear indicam desgaste das pastilhas ou problemas nos discos.</p>
      
            
      <h3>Vibração no pedal</h3>
      
      <p>Se o pedal vibra ao frear, pode indicar discos empenados ou desgaste irregular.</p>
      
            
      <h3>Pedal baixo ou esponjoso</h3>
      
      <p>Pode indicar ar no sistema, vazamento de fluido ou desgaste excessivo das pastilhas.</p>
      
      <h2>Manutenção preventiva dos freios</h2>
      <ul>
        <li>Verifique o nível do fluido de freio mensalmente</li>
        <li>Troque o fluido conforme recomendação do fabricante (geralmente a cada 2 anos)</li>
        <li>Inspecione visualmente as pastilhas a cada 10.000 km</li>
        <li>Faça a manutenção completa a cada 30.000 km</li>
      </ul>
      
      <h2>Tipos de freios em veículos pesados</h2>
      <p>Veículos pesados podem ter diferentes tipos de sistemas de freio:</p>
      <ul>
        <li><strong>Freio a tambor:</strong> Mais comum em eixos traseiros e reboques</li>
        <li><strong>Freio a disco:</strong> Oferece melhor dissipação de calor</li>
        <li><strong>Freio motor:</strong> Sistema auxiliar que usa o motor para frear</li>
        <li><strong>Retarder:</strong> Sistema hidráulico ou eletromagnético adicional</li>
      </ul>
      
      <h2>Cuidados especiais para veículos pesados</h2>
      <p>Caminhões e ônibus requerem atenção especial ao sistema de freios devido ao peso e às cargas transportadas:</p>
      <ul>
        <li>Verificação diária do sistema pneumático</li>
        <li>Drenagem regular dos reservatórios de ar</li>
        <li>Inspeção das lonas e tambores</li>
        <li>Ajuste correto das sapatas</li>
        <li>Verificação do funcionamento do ABS</li>
      </ul>
      
      <h2>Economia com manutenção preventiva</h2>
      <p>A manutenção regular do sistema de freios pode economizar muito dinheiro a longo prazo:</p>
      <ul>
        <li>Evita desgaste prematuro de componentes caros</li>
        <li>Reduz o consumo de combustível</li>
        <li>Previne acidentes e suas consequências</li>
        <li>Mantém o veículo dentro das normas de segurança</li>
      </ul>
      
      <h2>Nossa expertise em freios</h2>
      <p>A Mecânica Spagnol conta com mais de 50 anos de experiência em sistemas de freio para veículos pesados. Nossos técnicos são constantemente treinados nas mais novas tecnologias e procedimentos de segurança.</p>
      
      <p>Lembre-se: freios em bom estado salvam vidas. Não hesite em procurar a Mecânica Spagnol ao primeiro sinal de problema no sistema de freios. Sua segurança é nossa prioridade!</p>
    `
  },
  'tecnologia-motores-diesel': {
    title: 'A Tecnologia dos Motores Diesel Modernos',
    category: 'Tecnologia',
    date: '22 de Janeiro, 2025',
    readTime: '10 min de leitura',
    author: 'Equipe Spagnol',
    image: '/images/img-blog/motordiesel-blog3.jpg',
    content: `
      <h2>Evolução dos motores diesel</h2>
      <p>Os motores diesel modernos são muito diferentes dos modelos antigos. Com avanços tecnológicos significativos, tornaram-se mais eficientes, potentes e ecológicos.</p>
      
      <h2>Principais tecnologias modernas</h2>
      
      <h3>Common Rail</h3>
      <p>Sistema de injeção direta de alta pressão que permite controle preciso da quantidade e momento da injeção de combustível. Resulta em melhor desempenho e menor consumo.</p>
      
      <h3>Turbocompressor com geometria variável</h3>
      <p>Ajusta automaticamente o fluxo de gases de escape, otimizando a pressão de turbo em diferentes rotações do motor.</p>
      
      <h3>Sistema SCR (Redução Catalítica Seletiva)</h3>
      <p>Utiliza ARLA 32 para reduzir as emissões de óxidos de nitrogênio (NOx), tornando o motor mais limpo e adequado às normas ambientais.</p>
      
      <h3>Filtro de partículas (DPF)</h3>
      <p>Captura e queima as partículas de fuligem, reduzindo drasticamente as emissões de material particulado.</p>
      
      <h2>Vantagens dos motores diesel modernos</h2>
      <ul>
        <li>Maior eficiência energética (até 40% mais econômicos)</li>
        <li>Maior torque em baixas rotações</li>
        <li>Durabilidade superior</li>
        <li>Menores emissões de CO2</li>
        <li>Menor custo operacional por quilômetro</li>
      </ul>
      
      <h2>Cuidados especiais</h2>
      <p>Os motores diesel modernos requerem alguns cuidados especiais:</p>
      <ul>
        <li>Use sempre diesel S-10 (baixo teor de enxofre)</li>
        <li>Mantenha o sistema de filtragem em dia</li>
        <li>Abasteça com ARLA 32 quando necessário</li>
        <li>Respeite os intervalos de manutenção</li>
      </ul>
      
      <h2>Diagnóstico eletrônico</h2>
      <p>Os motores diesel modernos contam com sistemas eletrônicos sofisticados que requerem equipamentos especializados para diagnóstico:</p>
      <ul>
        <li>Scanner automotivo profissional</li>
        <li>Análise de parâmetros em tempo real</li>
        <li>Leitura e interpretação de códigos de falha</li>
        <li>Calibração de sistemas eletrônicos</li>
        <li>Atualização de software da ECU</li>
      </ul>
      
      <h2>Combustível e aditivos</h2>
      <p>A qualidade do combustível é fundamental para o bom funcionamento dos motores diesel modernos:</p>
      <ul>
        <li>Use sempre diesel S-10 de distribuidoras confiáveis</li>
        <li>Evite deixar o tanque na reserva frequentemente</li>
        <li>Considere o uso de aditivos melhoradores de cetano</li>
        <li>Drene a água do filtro separador regularmente</li>
        <li>Troque os filtros de combustível nos intervalos recomendados</li>
      </ul>
      
      <h2>Mitos sobre motores diesel</h2>
      <p>Vamos esclarecer alguns mitos comuns:</p>
      <ul>
        <li><strong>Mito:</strong> Motores diesel são sempre barulhentos            <strong>Verdade:</strong> Motores modernos são muito mais silenciosos</li>
        <li><strong>Mito:</strong> Diesel polui mais que gasolina            <strong>Verdade:</strong> Com as tecnologias atuais, as emissões são comparáveis</li>
        <li><strong>Mito:</strong> Motores diesel são lentos            <strong>Verdade:</strong> O alto torque proporciona excelente desempenho</li>
      </ul>
      
      <h2>O futuro dos motores diesel</h2>
      <p>As tendências para os próximos anos incluem:</p>
      <ul>
        <li>Hibridização diesel-elétrica</li>
        <li>Uso de biocombustíveis</li>
        <li>Sistemas de pós-tratamento ainda mais eficientes</li>
        <li>Conectividade e telemetria avançada</li>
        <li>Manutenção preditiva baseada em IA</li>
      </ul>
      
      <p>Na Mecânica Spagnol, somos especialistas em motores diesel modernos. Nossa equipe está constantemente atualizada com as últimas tecnologias para oferecer o melhor serviço. Conte conosco para manter seu motor diesel sempre em perfeitas condições!</p>
    `
  },
  'pecas-originais-vs-paralelas': {
    title: 'Peças Originais vs Paralelas: Qual Escolher?',
    category: 'Peças',
    date: '18 de Janeiro, 2025',
    readTime: '6 min de leitura',
    author: 'Equipe Spagnol',
    image: '/images/pecas-originais-blog5.jpg',
    content: `
      <h2>Entendendo as diferenças</h2>
      <p>Quando seu veículo precisa de manutenção, uma das principais dúvidas é sobre qual tipo de peça utilizar. Vamos esclarecer as diferenças entre peças originais e paralelas para ajudar você a tomar a melhor decisão.</p>
      
      <h2>Peças Originais (OEM)</h2>
      <p>As peças originais são fabricadas pelos mesmos fornecedores que abastecem as montadoras:</p>
      <ul>
        <li><strong>Qualidade garantida:</strong> Atendem às especificações exatas do fabricante</li>
        <li><strong>Durabilidade:</strong> Projetadas para durar conforme o esperado</li>
        <li><strong>Garantia:</strong> Geralmente acompanham garantia estendida</li>
        <li><strong>Valor de revenda:</strong> Mantêm o valor do veículo</li>
        <li><strong>Custo:</strong> Geralmente mais caras</li>
      </ul>
      
      <h2>Peças Paralelas de Qualidade</h2>
      <p>Nem todas as peças paralelas são iguais. Existem fabricantes sérios que produzem peças de excelente qualidade:</p>
      <ul>
        <li><strong>Custo-benefício:</strong> Preço mais acessível</li>
        <li><strong>Disponibilidade:</strong> Mais fáceis de encontrar</li>
        <li><strong>Variedade:</strong> Múltiplas opções de fabricantes</li>
        <li><strong>Qualidade variável:</strong> Importante escolher marcas confiáveis</li>
      </ul>
      
      <h2>Quando usar cada tipo?</h2>
      <h3>Recomendamos peças originais para:</h3>
      <ul>
        <li>Componentes críticos de segurança (freios, suspensão)</li>
        <li>Veículos ainda na garantia</li>
        <li>Sistemas eletrônicos e sensores</li>
        <li>Motor e transmissão</li>
      </ul>
      
      <h3>Peças paralelas podem ser adequadas para:</h3>
      <ul>
        <li>Itens de desgaste regular (filtros, correias)</li>
        <li>Acessórios não críticos</li>
        <li>Veículos mais antigos</li>
        <li>Quando o custo-benefício justifica</li>
      </ul>
      
      <h2>Como identificar peças de qualidade?</h2>
      <p>Independentemente do tipo escolhido, observe:</p>
      <ul>
        <li>Certificações e selos de qualidade</li>
        <li>Reputação do fabricante</li>
        <li>Garantia oferecida</li>
        <li>Recomendação de profissionais confiáveis</li>
        <li>Embalagem e acabamento da peça</li>
      </ul>
      
      <h2>O papel da oficina na escolha</h2>
      <p>Uma oficina de confiança é fundamental neste processo:</p>
      <ul>
        <li>Orientação profissional sobre as opções</li>
        <li>Acesso a fornecedores confiáveis</li>
        <li>Garantia do serviço realizado</li>
        <li>Histórico de manutenção documentado</li>
      </ul>
      
      <h2>Nossa política na Spagnol</h2>
      <p>Na Mecânica Spagnol, trabalhamos com transparência total:</p>
      <ul>
        <li>Apresentamos todas as opções disponíveis</li>
        <li>Explicamos prós e contras de cada escolha</li>
        <li>Utilizamos apenas fornecedores certificados</li>
        <li>Garantimos tanto peças originais quanto paralelas de qualidade</li>
        <li>Respeitamos sempre a decisão do cliente</li>
      </ul>
      
      <p>A escolha entre peças originais e paralelas depende de diversos fatores. O importante é ter informação e orientação profissional para tomar a melhor decisão para seu veículo e seu bolso. Conte com a experiência da Mecânica Spagnol para fazer a escolha certa!</p>
    `
  },
  'economia-combustivel-diesel': {
    title: 'Dicas para Economizar Combustível em Veículos Diesel',
    category: 'Economia',
    date: '15 de Janeiro, 2025',
    readTime: '8 min de leitura',
    author: 'Equipe Spagnol',
    image: '/images/diesel-blog4.jpg',
    content: `
      <h2>A importância da economia de combustível</h2>
      <p>Com o diesel representando uma parcela significativa dos custos operacionais, economizar combustível é essencial para a rentabilidade de transportadores e empresas. Pequenas mudanças podem resultar em grandes economias.</p>
      
      <h2>Técnicas de condução econômica</h2>
      <h3>1. Mantenha rotação adequada</h3>
      <ul>
        <li>Opere na faixa verde do conta-giros</li>
        <li>Evite acelerações bruscas</li>
        <li>Use o torque do motor a seu favor</li>
        <li>Troque as marchas no momento certo</li>
      </ul>
      
      <h3>2. Velocidade constante</h3>
      <ul>
        <li>Use o piloto automático quando possível</li>
        <li>Evite variações bruscas de velocidade</li>
        <li>Mantenha distância segura para evitar frenagens</li>
        <li>Antecipe o tráfego à frente</li>
      </ul>
      
      <h2>Manutenção para economia</h2>
      <h3>Sistema de injeção</h3>
      <p>Um sistema de injeção bem regulado pode economizar até 10% de combustível:</p>
      <ul>
        <li>Limpeza regular dos bicos injetores</li>
        <li>Calibração correta da bomba injetora</li>
        <li>Uso de aditivos de qualidade</li>
        <li>Manutenção do sistema Common Rail</li>
      </ul>
      
      <h3>Filtros e fluidos</h3>
      <ul>
        <li>Troque filtros de ar no prazo - motor "respirando" bem consome menos</li>
        <li>Mantenha o óleo do motor no nível e viscosidade corretos</li>
        <li>Filtro de combustível limpo evita esforço extra da bomba</li>
        <li>Sistema de arrefecimento eficiente mantém temperatura ideal</li>
      </ul>
      
      <h2>Calibragem e alinhamento</h2>
      <p>Pneus e geometria corretos fazem grande diferença:</p>
      <ul>
        <li>Calibre os pneus semanalmente</li>
        <li>Pressão correta reduz resistência ao rolamento</li>
        <li>Alinhamento evita arrasto e desgaste irregular</li>
        <li>Balanceamento reduz vibrações e esforço</li>
      </ul>
      
      <h2>Aerodinâmica e carga</h2>
      <h3>Para caminhões e ônibus:</h3>
      <ul>
        <li>Use defletores de ar quando disponíveis</li>
        <li>Mantenha a carga bem distribuída</li>
        <li>Evite excesso de peso</li>
        <li>Cubra cargas abertas para reduzir arrasto</li>
      </ul>
      
      <h2>Tecnologias auxiliares</h2>
      <p>Aproveite a tecnologia a seu favor:</p>
      <ul>
        <li>Computador de bordo para monitorar consumo</li>
        <li>GPS para rotas mais eficientes</li>
        <li>Telemetria para identificar padrões de consumo</li>
        <li>Apps de gestão de frota</li>
      </ul>
      
      <h2>Combustível de qualidade</h2>
      <p>A qualidade do diesel influencia diretamente no consumo:</p>
      <ul>
        <li>Abasteça em postos confiáveis</li>
        <li>Evite combustível "batizado"</li>
        <li>Use aditivos apenas quando necessário</li>
        <li>Drene a água do tanque regularmente</li>
      </ul>
      
      <h2>Resultados práticos</h2>
      <p>Implementando estas dicas, é possível economizar:</p>
      <ul>
        <li>5-10% com técnicas de condução</li>
        <li>3-5% com manutenção adequada</li>
        <li>2-3% com calibragem correta</li>
        <li>2-5% com melhorias aerodinâmicas</li>
      </ul>
      
      <p>Na Mecânica Spagnol, oferecemos serviços especializados para otimizar o consumo do seu veículo diesel. Nossa equipe pode realizar diagnósticos completos e ajustes que resultam em economia real. Agende uma avaliação e comece a economizar hoje mesmo!</p>
    `
  },
  'manutencao-maquinas-agricolas': {
    title: 'Manutenção de Máquinas Agrícolas na Entressafra',
    category: 'Agricultura',
    date: '10 de Janeiro, 2025',
    readTime: '12 min de leitura',
    author: 'Equipe Spagnol',
    image: '/images/entressafra-blog6.jpeg',
    content: `
      <h2>A importância da manutenção na entressafra</h2>
      <p>O período de entressafra é o momento ideal para realizar a manutenção completa das máquinas agrícolas. Com planejamento adequado, você garante que seus equipamentos estarão prontos e confiáveis para a próxima safra.</p>
      
      <h2>Checklist completo de manutenção</h2>
      <h3>Motor</h3>
      <ul>
        <li>Troca de óleo e filtros</li>
        <li>Limpeza do sistema de arrefecimento</li>
        <li>Verificação de correias e mangueiras</li>
        <li>Análise do sistema de injeção</li>
        <li>Teste de compressão dos cilindros</li>
      </ul>
      
      <h3>Sistema hidráulico</h3>
      <ul>
        <li>Troca do fluido hidráulico</li>
        <li>Inspeção de cilindros e válvulas</li>
        <li>Verificação de vazamentos</li>
        <li>Limpeza dos filtros</li>
        <li>Teste de pressão do sistema</li>
      </ul>
      
      <h3>Transmissão</h3>
      <ul>
        <li>Troca de óleo da transmissão</li>
        <li>Ajuste de embreagem</li>
        <li>Verificação de sincronizadores</li>
        <li>Inspeção de juntas homocinéticas</li>
        <li>Lubrificação de cardans</li>
      </ul>
      
      <h2>Cuidados com implementos</h2>
      <h3>Colheitadeiras</h3>
      <p>Atenção especial para:</p>
      <ul>
        <li>Sistema de corte e alimentação</li>
        <li>Cilindro de trilha e côncavo</li>
        <li>Peneiras e sistema de limpeza</li>
        <li>Elevadores e transportadores</li>
        <li>Sistema de descarga</li>
      </ul>
      
      <h3>Plantadeiras</h3>
      <ul>
        <li>Discos de corte e deposição</li>
        <li>Sistema de distribuição de sementes</li>
        <li>Rodas compactadoras</li>
        <li>Sistema de adubação</li>
        <li>Marcadores de linha</li>
      </ul>
      
      <h2>Armazenamento adequado</h2>
      <p>Durante a entressafra, o armazenamento correto é fundamental:</p>
      <ul>
        <li>Local coberto e seco</li>
        <li>Proteção contra intempéries</li>
        <li>Máquinas limpas e lubrificadas</li>
        <li>Tanque de combustível cheio (evita condensação)</li>
        <li>Bateria desconectada ou em manutenção</li>
      </ul>
      
      <h2>Documentação e planejamento</h2>
      <h3>Registros importantes:</h3>
      <ul>
        <li>Histórico de manutenções</li>
        <li>Horas trabalhadas por equipamento</li>
        <li>Consumo de combustível</li>
        <li>Peças substituídas</li>
        <li>Custos de manutenção</li>
      </ul>
      
      <h2>Treinamento de operadores</h2>
      <p>A entressafra é momento ideal para:</p>
      <ul>
        <li>Capacitação em operação correta</li>
        <li>Treinamento em manutenção básica</li>
        <li>Atualização sobre novas tecnologias</li>
        <li>Revisão de procedimentos de segurança</li>
      </ul>
      
      <h2>Tecnologia e agricultura de precisão</h2>
      <p>Aproveite para atualizar:</p>
      <ul>
        <li>Software de gerenciamento</li>
        <li>Sistemas de GPS e piloto automático</li>
        <li>Sensores e monitores</li>
        <li>Mapas de produtividade</li>
      </ul>
      
      <h2>Investimento que vale a pena</h2>
      <p>A manutenção na entressafra oferece:</p>
      <ul>
        <li>Redução de quebras durante a safra</li>
        <li>Maior vida útil dos equipamentos</li>
        <li>Economia com reparos emergenciais</li>
        <li>Melhor desempenho e produtividade</li>
        <li>Maior valor de revenda</li>
      </ul>
      
      <h2>Parceria Spagnol no campo</h2>
      <p>A Mecânica Spagnol tem longa tradição no atendimento ao setor agrícola:</p>
      <ul>
        <li>Equipe especializada em máquinas agrícolas</li>
        <li>Atendimento em campo quando necessário</li>
        <li>Estoque de peças para principais marcas</li>
        <li>Diagnóstico computadorizado</li>
        <li>Planos de manutenção personalizados</li>
      </ul>
      
      <p>Não deixe para a última hora! Agende já a revisão completa das suas máquinas agrícolas. Com mais de 50 anos de experiência, a Mecânica Spagnol é sua parceira confiável para manter sua frota agrícola sempre produtiva. Entre em contato e solicite um orçamento!</p>
    `
  }
};

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const article = articlesData[slug];

  if (!article) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-[100px] sm:pt-[140px] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Artigo não encontrado</h1>
          <p className="text-gray-400 mb-8">O artigo que você procura não existe.</p>
          <Link href="/blog" className="bg-[#0252A7] text-white px-6 py-3 rounded-lg hover:bg-[#0252A7]/80 transition-colors">
            Voltar ao Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Article Header */}
      <div className="relative h-[200px] sm:h-[250px] md:h-[300px] flex items-center justify-center">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Link 
            href="/blog" 
            className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Blog
          </Link>
        </div>

        {/* Article Info */}
        <div className="relative z-10 text-center p-6 sm:p-8 md:p-12">
          <div className="container mx-auto max-w-4xl">
            <span className="bg-[#0252A7] text-white px-4 py-2 rounded-full text-sm font-semibold">
              {article.category}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-gray-300">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Por {article.author}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-gray-50">
        <div className="container mx-auto max-w-4xl px-6 sm:px-8 py-10 sm:py-16">
          <div 
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:border-b-2 prose-h2:border-gray-200 prose-h2:pb-4
              prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-6 prose-h3:text-gray-800
              prose-p:text-gray-700 prose-p:leading-loose prose-p:mb-8 prose-p:text-lg
              prose-ul:text-gray-700 prose-ul:my-8 prose-ul:ml-8 prose-ul:list-disc prose-ul:space-y-3
              prose-li:mb-3 prose-li:text-lg prose-li:leading-relaxed prose-li:pl-2
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-blockquote:border-l-4 prose-blockquote:border-[#0252A7] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-8
              prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
              [&_h2]:first-of-type:mt-0"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

        {/* CTA Section */}
        <div className="mt-12 p-8 bg-gradient-to-r from-[#1a1a1a] to-[#252525] rounded-lg border border-gray-800">
          <h3 className="text-2xl font-bold text-white mb-4">
            Precisa de ajuda com seu veículo?
          </h3>
          <p className="text-gray-400 mb-6">
            Nossa equipe especializada está pronta para atender você. Entre em contato e agende uma visita!
          </p>
          <a 
            href="https://wa.me/5551999999999?text=Olá! Li o artigo no blog e gostaria de mais informações."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#0252A7] text-white px-6 py-3 rounded-lg hover:bg-[#0252A7]/80 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Falar com Especialista
          </a>
        </div>
        </div>
      </div>
    </article>
  );
}