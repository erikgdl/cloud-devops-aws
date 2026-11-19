export default function Challenge() {
  return (
    <section className="context" id="projeto">
      <div className="wrap problem">
        <p className="caption" data-reveal>
          01 / Problema
        </p>
        <h2 data-reveal>Como reproduzir um ambiente configurado à mão?</h2>
        <div className="problem-notes" data-reveal>
          <p>
            Uma versão de pacote escolhida no terminal, uma permissão ajustada à mão, um processo
            iniciado após o boot. O servidor guarda o efeito dessas decisões. Repeti-las exige
            conhecer sua origem.
          </p>
          <p>
            O trabalho distribui essas decisões entre três artefatos versionáveis: a definição da
            infraestrutura, o playbook de configuração e a imagem da aplicação.
          </p>
        </div>
      </div>
    </section>
  )
}
