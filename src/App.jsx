import React, { useState, useEffect } from "react";
import { Package2, Plus, Minus, PackageCheck, PackageX } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const MODELOS_TAMPAS = [
  "Push Pull 20/410",
  "Push Pull 24/410",
  "Push Pull 28/410",
  "Push Pull 28/410 DS",
  "Flip Top standard 18/410",
  "Flip Top standard 20/410",
  "Flip Top Ômega 20/410",
  "Flip Top Ômega 24/410",
  "Flip Top Ômega 24/415",
  "Flip Top Ômega 28/410",
  "Disc Top rosca 24/410",
  "Disc Top rosca 24/410 com anel",
  "Disc Top rosca 24/415",
  "Disc Top rosca 24/415 com anel",
  "Disc Top rosca 28/410",
  "Disc Top rosca 28/410 com anel",
  "Batoque Bolha 13mm",
  "Batoque com furo 13mm",
  "Batoque 30mm",
  "Catraca com batoque",
  "Tampa Lisa",
  "Tampa para rosca aletada",
  "Tampa Cheirinho",
  "Baleiro rosca 35mm",
  "Refil rosca 18mm",
  "Refil rosca 20/410",
  "Refil rosca 24/410",
  "Refil rosca 28/410",
  "Tampa para pote 250g / 500g",
  "Tampa para pote 1Kg - r87",
  "Tampa Inserto",
  "Tampa Coroa",
  "Sobretampa V. Pressão",
  "Bico",
  "Anel",
  "Bico Push Pull 28/410",
  "Bico Push Pull 20/410",
];

const CORES_COMUNS = [
  "Branco",
  "Preto",
  "Vermelho",
  "Verde",
  "Azul",
  "Amarelo",
  "Natural",
  "Transparente",
];

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [caps, setCaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [novoMovimento, setNovoMovimento] = useState({
    tipo: "",
    cor: "",
    peso: 0,
    quantidade: 0,
    operacao: "entrada",
  });

  useEffect(() => {
    fetchCaps();
  }, []);

  async function fetchCaps() {
    try {
      const response = await fetch(`${API_URL}/api/tampas`);
      if (!response.ok) throw new Error("Erro ao buscar dados");
      const data = await response.json();
      setCaps(data);
    } catch (error) {
      console.error("Erro ao buscar tampas:", error);
      toast.error("Erro ao carregar o estoque");
    } finally {
      setLoading(false);
    }
  }

  async function handleMovimento(e) {
    e.preventDefault();
    try {
      const { tipo, cor, peso, quantidade, operacao } = novoMovimento;
      const quantidadeFinal = operacao === "entrada" ? quantidade : -quantidade;

      const existingCap = caps.find(
        (cap) => cap.tipo === tipo && cap.cor === cor
      );

      if (existingCap) {
        const novaQuantidade = existingCap.quantidade + quantidadeFinal;
        if (novaQuantidade < 0) {
          toast.error("Quantidade insuficiente em estoque!");
          return;
        }

        const response = await fetch(`${API_URL}/api/tampas/movimento`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tipo,
            cor,
            peso: existingCap.peso, // ou um valor fixo se não for relevante na saída
            quantidade,
            operacao,
          }),
        });

        if (!response.ok) throw new Error("Erro ao atualizar quantidade");
      } else if (operacao === "entrada") {
        const response = await fetch(`${API_URL}/api/tampas/movimento`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tipo, cor, peso, quantidade, operacao }),
        });

        if (!response.ok) throw new Error("Erro ao inserir nova tampa");
      } else {
        toast.error("Não é possível realizar saída de um item inexistente!");
        return;
      }

      toast.success(
        `${
          operacao === "entrada" ? "Entrada" : "Saída"
        } registrada com sucesso!`
      );
      fetchCaps();
      setNovoMovimento({
        tipo: "",
        cor: "",
        peso: 0,
        quantidade: 0,
        operacao: "entrada",
      });
    } catch (error) {
      console.error("Erro ao processar movimento:", error);
      toast.error("Erro ao processar movimento");
    }
  }

  return (
    <div className="min-vh-100 bg-light">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-primary text-white shadow">
        <div className="container py-4">
          <div className="d-flex align-items-center gap-3">
            <Package2 size={32} />
            <div>
              <h1 className="h3 mb-0">Technoveda Tampas e Moldes Ltda</h1>
              <p className="mb-0 text-white-50">
                Sistema de Controle de Estoque
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-4">
        {/* Formulário de Movimento */}
        <div className="card mb-4">
          <div className="card-body">
            <h2 className="card-title mb-4">Registrar Movimento</h2>
            <form onSubmit={handleMovimento}>
              <div className="row g-3">
                <div className="col-md-4 col-lg-2">
                  <label className="form-label">Tipo da Tampa</label>
                  <select
                    className="form-select"
                    value={novoMovimento.tipo}
                    onChange={(e) =>
                      setNovoMovimento({
                        ...novoMovimento,
                        tipo: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Selecione o modelo</option>
                    {MODELOS_TAMPAS.map((modelo) => (
                      <option key={modelo} value={modelo}>
                        {modelo}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4 col-lg-2">
                  <label className="form-label">Cor</label>
                  <select
                    className="form-select"
                    value={novoMovimento.cor}
                    onChange={(e) =>
                      setNovoMovimento({
                        ...novoMovimento,
                        cor: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Selecione a cor</option>
                    {CORES_COMUNS.map((cor) => (
                      <option key={cor} value={cor}>
                        {cor}
                      </option>
                    ))}
                    <option value="Outro">Outra cor</option>
                  </select>
                </div>
                <div className="col-md-4 col-lg-2">
                  <label className="form-label">Peso (g)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={novoMovimento.peso}
                    onChange={(e) =>
                      setNovoMovimento({
                        ...novoMovimento,
                        peso: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="col-md-4 col-lg-2">
                  <label className="form-label">Quantidade</label>
                  <input
                    type="number"
                    className="form-control"
                    value={novoMovimento.quantidade}
                    onChange={(e) =>
                      setNovoMovimento({
                        ...novoMovimento,
                        quantidade: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="col-md-4 col-lg-2">
                  <label className="form-label">Operação</label>
                  <select
                    className="form-select"
                    value={novoMovimento.operacao}
                    onChange={(e) =>
                      setNovoMovimento({
                        ...novoMovimento,
                        operacao: e.target.value,
                      })
                    }
                  >
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                </div>
                <div className="col-md-4 col-lg-2">
                  <label className="form-label">&nbsp;</label>
                  <button
                    type="submit"
                    className={`btn w-100 ${
                      novoMovimento.operacao === "entrada"
                        ? "btn-success"
                        : "btn-danger"
                    }`}
                  >
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      {novoMovimento.operacao === "entrada" ? (
                        <>
                          <Plus size={20} />
                          <span>Registrar Entrada</span>
                        </>
                      ) : (
                        <>
                          <Minus size={20} />
                          <span>Registrar Saída</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Tabela de Estoque */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title mb-0">Estoque Atual</h2>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Cor</th>
                  <th>Peso (g)</th>
                  <th>Quantidade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                    </td>
                  </tr>
                ) : caps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">
                      Nenhuma tampa cadastrada no estoque
                    </td>
                  </tr>
                ) : (
                  caps.map((cap) => (
                    <tr key={cap.id}>
                      <td>{cap.tipo}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="color-preview"
                            style={{ backgroundColor: cap.cor.toLowerCase() }}
                          />
                          {cap.cor}
                        </div>
                      </td>
                      <td>{cap.peso}g</td>
                      <td>{cap.quantidade}</td>
                      <td>
                        {cap.quantidade > 100 ? (
                          <span className="text-success d-flex align-items-center">
                            <PackageCheck size={20} className="status-icon" />
                            Em estoque
                          </span>
                        ) : cap.quantidade > 0 ? (
                          <span className="text-warning d-flex align-items-center">
                            <Package2 size={20} className="status-icon" />
                            Estoque baixo
                          </span>
                        ) : (
                          <span className="text-danger d-flex align-items-center">
                            <PackageX size={20} className="status-icon" />
                            Sem estoque
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
