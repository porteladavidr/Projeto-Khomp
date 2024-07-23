document.addEventListener('DOMContentLoaded', () => {
  const inputArquivoLog = document.querySelector('#logFileInput');
  const resultado = document.querySelector('#result');
  const contarFalhasButton = document.querySelector('#contarFalhasButton');

  contarFalhasButton.addEventListener('click', contarFalhas);

  // Array com significados das falhas SIP
  const falhasSIP = [
    { codigo: 100, significado: "Trying - Tentando estabelecer a chamada" },
    { codigo: 180, significado: "Ringing - Chamada está tocando" },
    { codigo: 181, significado: "Call Is Being Forwarded - Chamada está sendo encaminhada" },
    { codigo: 182, significado: "Queued - Chamada na fila" },
    { codigo: 183, significado: "Session Progress - Progresso da sessão" },
    { codigo: 200, significado: "OK - Chamada bem-sucedida" },
    { codigo: 202, significado: "Accepted - Aceito" },
    { codigo: 204, significado: "No Notification - Sem notificação" },
    { codigo: 300, significado: "Multiple Choices - Múltiplas escolhas" },
    { codigo: 301, significado: "Moved Permanently - Movido permanentemente" },
    { codigo: 302, significado: "Moved Temporarily - Movido temporariamente" },
    { codigo: 305, significado: "Use Proxy - Use o proxy" },
    { codigo: 380, significado: "Alternative Service - Serviço alternativo" },
    { codigo: 400, significado: "Bad Request - Solicitação incorreta" },
    { codigo: 401, significado: "Unauthorized - Não autorizado" },
    { codigo: 402, significado: "Payment Required - Pagamento necessário" },
    { codigo: 403, significado: "Forbidden - Proibido" },
    { codigo: 404, significado: "Not Found - Não encontrado" },
    { codigo: 405, significado: "Method Not Allowed - Método não permitido" },
    { codigo: 406, significado: "Not Acceptable - Não aceitável" },
    { codigo: 407, significado: "Proxy Authentication Required - Autenticação de proxy necessária" },
    { codigo: 408, significado: "Request Timeout - Tempo de solicitação esgotado" },
    { codigo: 409, significado: "Conflict - Conflito" },
    { codigo: 410, significado: "Gone - Não disponível" },
    { codigo: 411, significado: "Length Required - Comprimento necessário" },
    { codigo: 412, significado: "Conditional Request Failed - Solicitação condicional falhou" },
    { codigo: 413, significado: "Request Entity Too Large - Entidade de solicitação muito grande" },
    { codigo: 414, significado: "Request-URI Too Long - URI de solicitação muito longa" },
    { codigo: 415, significado: "Unsupported Media Type - Tipo de mídia não suportado" },
    { codigo: 416, significado: "Unsupported URI Scheme - Esquema de URI não suportado" },
    { codigo: 420, significado: "Bad Extension - Extensão incorreta" },
    { codigo: 421, significado: "Extension Required - Extensão necessária" },
    { codigo: 422, significado: "Session Interval Too Small - Intervalo de sessão muito pequeno" },
    { codigo: 423, significado: "Interval Too Brief - Intervalo muito breve" },
    { codigo: 424, significado: "Bad Location Information - Informação de localização incorreta" },
    { codigo: 428, significado: "Use Identity Header - Use o cabeçalho de identidade" },
    { codigo: 429, significado: "Provide Referrer Identity - Forneça a identidade do referenciador" },
    { codigo: 430, significado: "Flow Failed - Fluxo falhou" },
    { codigo: 433, significado: "Anonymity Disallowed - Anonimato não permitido" },
    { codigo: 436, significado: "Bad Identity-Info - Informação de identidade incorreta" },
    { codigo: 437, significado: "Unsupported Certificate - Certificado não suportado" },
    { codigo: 438, significado: "Invalid Identity Header - Cabeçalho de identidade inválido" },
    { codigo: 439, significado: "First Hop Lacks Outbound Support - Primeiro salto sem suporte de saída" },
    { codigo: 440, significado: "Max-Breadth Exceeded - Máxima abrangência excedida" },
    { codigo: 469, significado: "Bad Info Package - Pacote de informações incorreto" },
    { codigo: 470, significado: "Consent Needed - Consentimento necessário" },
    { codigo: 480, significado: "Temporarily Unavailable - Temporariamente indisponível" },
    { codigo: 481, significado: "Call/Transaction Does Not Exist - Chamada/transação não existe" },
    { codigo: 482, significado: "Loop Detected - Loop detectado" },
    { codigo: 483, significado: "Too Many Hops - Muitos saltos" },
    { codigo: 484, significado: "Address Incomplete - Endereço incompleto" },
    { codigo: 485, significado: "Ambiguous - Ambíguo" },
    { codigo: 486, significado: "Busy Here - Ocupado aqui" },
    { codigo: 487, significado: "Request Terminated - Solicitação terminada" },
    { codigo: 488, significado: "Not Acceptable Here - Não aceitável aqui" },
    { codigo: 489, significado: "Bad Event - Evento incorreto" },
    { codigo: 491, significado: "Request Pending - Solicitação pendente" },
    { codigo: 493, significado: "Undecipherable - Indecifrável" },
    { codigo: 494, significado: "Security Agreement Required - Acordo de segurança necessário" },
    { codigo: 500, significado: "Server Internal Error - Erro interno do servidor" },
    { codigo: 501, significado: "Not Implemented - Não implementado" },
    { codigo: 502, significado: "Bad Gateway - Gateway incorreto" },
    { codigo: 503, significado: "Service Unavailable - Serviço indisponível" },
    { codigo: 504, significado: "Server Time-out - Tempo esgotado do servidor" },
    { codigo: 505, significado: "Version Not Supported - Versão não suportada" },
    { codigo: 513, significado: "Message Too Large - Mensagem muito grande" },
    { codigo: 555, significado: "Push Notification Service Not Supported - Serviço de notificação por push não suportado" },
    { codigo: 580, significado: "Precondition Failure - Falha de pré-condição" },
    { codigo: 600, significado: "Busy Everywhere - Ocupado em todos os lugares" },
    { codigo: 603, significado: "Decline - Recusar" },
    { codigo: 604, significado: "Does Not Exist Anywhere - Não existe em nenhum lugar" },
    { codigo: 606, significado: "Not Acceptable - Não aceitável" }
  ];

  function contarFalhas() {
    resultado.textContent = ''; // Limpar resultados anteriores

    if (!inputArquivoLog.files.length) {
      alert('Selecione um arquivo de log.');
      return;
    }

    const arquivoLog = inputArquivoLog.files[0];
    const leitor = new FileReader();

    leitor.onload = function(evento) {
      const conteudoLog = evento.target.result;
      let falhas = {};
      let totalFalhas = 0;
      let totalLigacoes = 0;

      try {
        // Tentar analisar o arquivo de log
        const linhas = conteudoLog.split('\n');
        const regexFalha = /EV_CALL_FAIL\((\d{3})\)/;
        const regexLigacao = /CM_MAKE_CALL|EV_NEW_CALL/;

        linhas.forEach(linha => {
          const matchFalha = linha.match(regexFalha);
          const matchLigacao = linha.match(regexLigacao);

          if (matchFalha) {
            const codigoFalha = matchFalha[1];
            if (falhas[codigoFalha]) {
              falhas[codigoFalha]++;
            } else {
              falhas[codigoFalha] = 1;
            }
            totalFalhas++;
          }

          if (matchLigacao) {
            totalLigacoes++;
          }
        });

        if (totalFalhas === 0) {
          resultado.textContent = 'Nenhuma falha encontrada no arquivo de log.';
        } else {
          let resultadoTexto = `De <b>${totalLigacoes}</b> ligações, <b>${totalFalhas}</b> apresentaram falha.\n`;
          for (const [codigo, quantidade] of Object.entries(falhas)) {
            const significado = buscarSignificadoFalha(codigo);
            resultadoTexto += `<b>SIP ${codigo}:</b> ${quantidade} - ${significado}\n`;
          }
          resultado.innerHTML = resultadoTexto;
        }
      } catch (error) {
        console.error('Erro ao analisar o arquivo de log:', error);
        resultado.textContent = 'Erro ao processar o arquivo de log.';
      }
    };

    leitor.readAsText(arquivoLog);
  }

  function buscarSignificadoFalha(codigo) {
    const falha = falhasSIP.find(falha => falha.codigo == codigo);
    return falha ? falha.significado : 'Significado desconhecido';
  }
});