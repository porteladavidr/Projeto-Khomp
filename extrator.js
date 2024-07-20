function extrairRegistrosDeChamada() {
  const inputArquivoLog = document.getElementById('logFileInput');
  const numeroTelefone = document.getElementById('phoneNumberInput').value;
  const resultado = document.getElementById('result');
  const selecaoChamada = document.getElementById('callSelection');
  resultado.textContent = ''; // Limpar resultados anteriores

  if (!inputArquivoLog.files.length) {
    alert('Selecione um arquivo de log.');
    return;
  }

  const arquivoLog = inputArquivoLog.files[0];
  const leitor = new FileReader();

  leitor.onload = function(evento) {
    const conteudoLog = evento.target.result;
    let chamadas = []; // Array para armazenar chamadas extraídas

    try {
      // Tentar analisar o arquivo de log
      const linhas = conteudoLog.split('\n');
      let chamadaAtual = null;
      let canalAtual = null;
      const regexAtivo = new RegExp(`CM_MAKE_CALL\\(dest_addr="(?:\\d{2,3})?${numeroTelefone}"`);
      const regexReceptivo = new RegExp(`EV_NEW_CALL.*orig_addr="(?:\\d{2,3})?${numeroTelefone}"`);

      linhas.forEach(linha => {
        const matchCanal = linha.match(/\|D\d{5} C\d{3}\|/);
        const matchHorario = linha.match(/T\|(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}):\d{2}\.\d{3}\|/);

        if (matchCanal) {
          const canal = matchCanal[0];
          if (regexAtivo.test(linha) || regexReceptivo.test(linha)) {
            if (chamadaAtual) {
              chamadas.push(chamadaAtual);
            }
            chamadaAtual = {
              tipo: regexAtivo.test(linha) ? 'Ativo' : 'Receptivo',
              horario: matchHorario ? matchHorario[1].split(' ')[1].slice(0, 5) : 'Horário não encontrado',
              data: matchHorario ? matchHorario[1].split(' ')[0] : 'Data não encontrada',
              linhas: []
            };
            canalAtual = canal;
          }
          if (chamadaAtual && canal === canalAtual) {
            chamadaAtual.linhas.push(linha);
            if (linha.includes('EV_CHANNEL_FREE')) {
              chamadas.push(chamadaAtual);
              chamadaAtual = null;
              canalAtual = null;
            }
          }
        }
      });

      if (chamadas.length === 0) {
        resultado.textContent = 'Nenhuma chamada encontrada para o número de telefone informado.';
      } else if (chamadas.length === 1) {
        exibirChamada(chamadas[0]);
      } else {
        // Lidar com várias chamadas
        selecaoChamada.innerHTML = '';
        selecaoChamada.style.display = 'block';
        chamadas.forEach((chamada, index) => {
          const opcao = document.createElement('option');
          opcao.value = index;
          opcao.textContent = `Chamada ${index + 1} (${chamada.tipo}) - ${chamada.data} ${chamada.horario}`;
          selecaoChamada.appendChild(opcao);
        });

        selecaoChamada.onchange = function() {
          exibirChamada(chamadas[selecaoChamada.value]);
        };

        exibirChamada(chamadas[0]); // Exibir a primeira chamada por padrão
      }
    } catch (error) {
      console.error('Erro ao analisar o arquivo de log:', error);
      resultado.textContent = 'Erro ao processar o arquivo de log.';
    }
  };

  leitor.readAsText(arquivoLog);
}

function exibirChamada(chamada) {
  const resultado = document.getElementById('result');
  resultado.textContent = chamada.linhas.join('\n');
}
