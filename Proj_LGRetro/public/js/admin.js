// Painel do administrador com o CRUD de produtos

// Seleção dos elementos do DOM
const menuListar = document.querySelector("#menu-listar");
const menuCadastrar = document.querySelector("#menu-cadastrar");

const telaLista = document.querySelector("#tela-lista");
const telaFormulario = document.querySelector("#tela-formulario");

const mensagem = document.querySelector("#mensagem");
const lista = document.querySelector("#lista-produtos");
const aviso = document.querySelector("#aviso");
const modelo = document.querySelector("#modelo-item");

const formulario = document.querySelector("#form-produto");
const tituloForm = document.querySelector("#titulo-form");
const botaoSalvar = document.querySelector("#botao-salvar");
const botaoCancelar = document.querySelector("#botao-cancelar");

// null indica que estamos cadastrando um produto novo.
// Se estiver editando, guardará o ID do produto em edição.
let emEdicao = null;

// Função concentrada para chamadas à API
async function chamarAPI(metodo, caminho, dados = null) {
    const opcoes = {
        method: metodo,
        headers: { "Content-Type": "application/json" }
    };
    if (dados) {
        opcoes.body = JSON.stringify(dados);
    }
    const resposta = await fetch(caminho, opcoes);
    const resultado = await resposta.json();

    if (resultado.erro) {
        throw new Error(resultado.erro);
    }
    return resultado;
}

// Exibe mensagem de erro ou sucesso
function mostrarMensagem(texto, erro = false) {
    mensagem.textContent = texto;
    if (erro) {
        mensagem.className = "mensagem mensagem-erro";
    } else {
        mensagem.className = "mensagem";
    }
    mensagem.hidden = false;
}

// Alterna a exibição entre as telas (lista ou formulário)
function mostrarTela(nome) {
    telaLista.hidden = (nome !== "lista");
    telaFormulario.hidden = (nome !== "formulario");

    const cadastrando = (nome === "formulario") && (emEdicao === null);
    menuCadastrar.classList.toggle("ativo", cadastrando);
    menuListar.classList.toggle("ativo", !cadastrando);
}

// Limpa e reseta o formulário para o modo "Novo produto"
function limparFormulario() {
    emEdicao = null;
    formulario.reset();
    tituloForm.textContent = "Novo produto";
    botaoSalvar.textContent = "Cadastrar produto";
}

// Carrega os produtos da API e renderiza na lista
async function carregarProdutos() {
    try {
        const produtos = await chamarAPI("GET", "/api/produtos");
        lista.replaceChildren();

        if (produtos.length > 0) {
            aviso.hidden = true;
            produtos.forEach(produto => {
                const clone = modelo.content.cloneNode(true);
                clone.querySelector(".item-foto").src = produto.fotoUrl || produto.foto;
                clone.querySelector(".item-nome").textContent = produto.nome;
                clone.querySelector(".item-detalhes").textContent = `R$ ${produto.preco} | Qtd: ${produto.quantidade}`;

                // Botão Editar
                clone.querySelector(".botao-editar").addEventListener("click", () => {
                    emEdicao = produto.id;
                    tituloForm.textContent = "Atualizar produto";
                    botaoSalvar.textContent = "Salvar alterações";
                    formulario.nome.value = produto.nome;
                    formulario.descricao.value = produto.descricao;
                    formulario.preco.value = produto.preco;
                    formulario.quantidade.value = produto.quantidade;
                    formulario["foto-url"].value = produto.fotoUrl || produto.foto;
                    mostrarTela("formulario");
                });

                // Botão Excluir
                clone.querySelector(".botao-excluir").addEventListener("click", async () => {
                    if (confirm("Deseja realmente excluir este produto?")) {
                        await chamarAPI("DELETE", `/api/produtos/${produto.id}`);
                        mostrarMensagem("Produto excluído com sucesso");
                        carregarProdutos();
                    }
                });

                lista.appendChild(clone);
            });
        } else {
            aviso.textContent = "Nenhum produto cadastrado.";
            aviso.hidden = false;
        }
    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}

// Navegação do menu
menuListar.addEventListener("click", () => {
    limparFormulario();
    mostrarTela("lista");
});

menuCadastrar.addEventListener("click", () => {
    limparFormulario();
    mostrarTela("formulario");
});

botaoCancelar.addEventListener("click", () => {
    limparFormulario();
    mostrarTela("lista");
});

// Envio do formulário (Cadastrar ou Editar)
formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    const produto = {
        nome: formulario.nome.value,
        descricao: formulario.descricao.value,
        preco: parseFloat(formulario.preco.value),
        quantidade: parseInt(formulario.quantidade.value, 10),
        fotoUrl: formulario["foto-url"].value
    };

    try {
        if (emEdicao === null) {
            await chamarAPI("POST", "/api/produtos", produto);
            mostrarMensagem("Produto cadastrado");
        } else {
            await chamarAPI("PUT", `/api/produtos/${emEdicao}`, produto);
            mostrarMensagem("Produto atualizado");
        }
        limparFormulario();
        mostrarTela("lista");
        carregarProdutos();
    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
});

// Inicialização: busca os produtos ao carregar a página
carregarProdutos();