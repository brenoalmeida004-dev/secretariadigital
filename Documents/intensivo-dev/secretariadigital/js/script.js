 // ================================================
// SCRIPT.JS — Lógica de agendamento
// ================================================
// Este arquivo cuida de:
// 1. Gerar os botões de horário quando o usuário escolhe uma data
// 2. Marcar horários ocupados (futuramente virão do Firebase)
// 3. Habilitar o botão de confirmar quando tudo estiver preenchido
// ================================================


// ------------------------------------------------
// CONFIGURAÇÕES
// Edite aqui para mudar os horários disponíveis
// ------------------------------------------------
const HORARIO_INICIO = 8;   // 08:00
const HORARIO_FIM = 18;     // até 17:00 (não inclui 18:00)
const DURACAO_MINUTOS = 60; // intervalo entre horários


// ------------------------------------------------
// HORÁRIOS OCUPADOS (simulação)
// Futuramente esses dados virão do Firebase
// Por enquanto estamos simulando alguns ocupados
// ------------------------------------------------
const horariosOcupados = {
  // Formato: "YYYY-MM-DD": ["HH:MM", "HH:MM"]
  // Exemplo:
  // "2024-03-15": ["09:00", "11:00", "14:00"]
};


// ------------------------------------------------
// FUNÇÃO: Gerar todos os horários do dia
// Retorna um array com os horários: ["08:00", "09:00", ...]
// ------------------------------------------------
function gerarHorarios() {
  const horarios = [];

  for (let hora = HORARIO_INICIO; hora < HORARIO_FIM; hora++) {
    const horaFormatada = hora.toString().padStart(2, "0") + ":00";
    horarios.push(horaFormatada);
  }

  return horarios;
}


// ------------------------------------------------
// FUNÇÃO: Verificar se um horário está ocupado
// Recebe a data e o horário, retorna true ou false
// ------------------------------------------------
function estaOcupado(data, horario) {
  if (horariosOcupados[data]) {
    return horariosOcupados[data].includes(horario);
  }
  return false;
}


// ------------------------------------------------
// FUNÇÃO: Renderizar os botões de horário na tela
// Chamada toda vez que o usuário muda a data
// ------------------------------------------------
function renderizarHorarios(dataSelecionada) {
  const container = document.getElementById("container-horarios");
  const horarios = gerarHorarios();

  // Limpa o conteúdo anterior
  container.innerHTML = "";

  horarios.forEach(function (horario) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = horario;

    if (estaOcupado(dataSelecionada, horario)) {
      // Horário ocupado: desabilita o botão
      btn.classList.add("btn-horario", "ocupado");
      btn.disabled = true;
    } else {
      // Horário disponível: habilita o botão
      btn.classList.add("btn-horario", "disponivel");

      // Quando clicar, seleciona esse horário
      btn.addEventListener("click", function () {
        selecionarHorario(horario, btn);
      });
    }

    container.appendChild(btn);
  });
}


// ------------------------------------------------
// FUNÇÃO: Selecionar um horário
// Marca o botão como selecionado e habilita o confirmar
// ------------------------------------------------
function selecionarHorario(horario, btnClicado) {
  // Remove a seleção anterior
  const botoes = document.querySelectorAll(".btn-horario");
  botoes.forEach(function (btn) {
    btn.classList.remove("selecionado");
  });

  // Marca o botão clicado como selecionado
  btnClicado.classList.add("selecionado");

  // Guarda o horário no campo oculto
  document.getElementById("horario-selecionado").value = horario;

  // Habilita o botão de confirmar
  const btnConfirmar = document.getElementById("btn-confirmar");
  btnConfirmar.disabled = false;

  // Atualiza a mensagem do botão
  document.getElementById("msg-botao").textContent =
    "Horário " + horario + " selecionado ✅";
}


// ------------------------------------------------
// EVENTO: Quando o usuário muda a data
// ------------------------------------------------
document.getElementById("data").addEventListener("change", function () {
  const dataSelecionada = this.value;

  if (dataSelecionada) {
    renderizarHorarios(dataSelecionada);

    // Reseta o horário selecionado
    document.getElementById("horario-selecionado").value = "";
    document.getElementById("btn-confirmar").disabled = true;
    document.getElementById("msg-botao").textContent =
      "Selecione um horário para continuar";
  }
});


// ------------------------------------------------
// EVENTO: Envio do formulário
// ------------------------------------------------
document.getElementById("form-agendamento").addEventListener("submit", function (e) {
  e.preventDefault(); // Impede o envio padrão do formulário

  // Coleta os dados preenchidos
  const nome = document.getElementById("nome").value;
  const contato = document.getElementById("contato").value;
  const data = document.getElementById("data").value;
  const horario = document.getElementById("horario-selecionado").value;

  // Validação básica
  if (!nome || !contato || !data || !horario) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  // Monta o objeto do agendamento
  const agendamento = {
    nome: nome,
    contato: contato,
    data: data,
    horario: horario,
    status: "confirmado"
  };

  // Por enquanto só exibe no console
  // Futuramente aqui vai salvar no Firebase
  console.log("Agendamento:", agendamento);

  // Redireciona para a página de confirmação
  // Passa os dados pela URL para exibir na próxima página
  const params = new URLSearchParams(agendamento);
  window.location.href = "confirmacao.html?" + params.toString();
});
