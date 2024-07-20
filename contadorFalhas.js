function contarFalhas() {
    const inputArquivoLog = document.getElementById('logFileInput');
    const resultado = document.getElementById('result');
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
  
      try {
        // Tentar analisar o arquivo de log
        const linhas = conteudoLog.split('\n');
        const regexFalha = /EV_CALL_FAIL\((\d{3})\)/;
  
        linhas.forEach(linha => {
          const matchFalha = linha.match(regexFalha);
          if (matchFalha) {
            const codigoFalha = matchFalha[1];
            if (falhas[codigoFalha]) {
              falhas[codigoFalha]++;
            } else {
              falhas[codigoFalha] = 1;
            }
            totalFalhas++;
          }
        });
  
        if (totalFalhas === 0) {
          resultado.textContent = 'Nenhuma falha encontrada no arquivo de log.';
        } else {
          let resultadoTexto = `Total de falhas: ${totalFalhas}\n`;
          for (const [codigo, quantidade] of Object.entries(falhas)) {
            resultadoTexto += `${quantidade} ${codigo}\n`;
          }
          resultado.textContent = resultadoTexto;
        }
      } catch (error) {
        console.error('Erro ao analisar o arquivo de log:', error);
        resultado.textContent = 'Erro ao processar o arquivo de log.';
      }
    };
  
    leitor.readAsText(arquivoLog);
}
