// vitrine: busca os produtos na api e monta os cards na vitrine

const lista = document.querySelector("#lista-produtos");
const aviso = document.querySelector("#aviso");
const modelo = document.querySelector("#modelo-produto");

// montar um cartao ded um produto a partir de um template do index.html

function criarCartao(produto) {
    const Cartao = modelo.content.cloneNode(true);

    Cartao.querySelector(".produto-foto").src = produto.fotoUrl;
    Cartao.querySelector(".produto-nome").textContent = produto.nome;
    Cartao.querySelector(".produto-descricao").textContent = produto.descricao;

    Cartao.querySelector(".preco").textContent = produto.preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    const etiqueta = Cartao.querySelector(".etiqueta");
    if(produto.quantidade>0)
    {
        etiqueta.textContent = `${produto.quantidade} em estoque`;
    }else{
        etiqueta.textContent = "Esgotado";
        etiqueta.classList.add("etiqueta-esgotado");
    }

    return Cartao;
}

async function carregarProdutos() {
    try {
        const resposta = await fetch("/api/produtos");
        const produtos = await resposta.json();

        if(produtos.length === 0) {
            aviso.textContent = "Nenhum produto cadastrado ainda.";
            return;
        }

        aviso.hidden = true;

        for(const produto of produtos) {
            lista.append(criarCartao(produto));
        }
    }catch{
        aviso.textContent = "Erro ao carregar os produtos. Tente novamente mais tarde.";
    }
}

carregarProdutos();
