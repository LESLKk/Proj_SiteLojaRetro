//API da LOJA: sevidor express com o CRUD

import express from "express";
import { db } from "./firebase";

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const produtos = db.collection("produtos");

interface Produto {
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
    fotoUrl: string;
}

// ----- Funcoes de apoio -----

function validar(produto: Produto): string {
    if (typeof produto.nome !== "string" || produto.nome.trim() === "") {
        return "Informe um nome válido para o produto.";
    }
    if (typeof produto.descricao !== "string" || produto.descricao.trim() === "") {
        return "Informe uma descrição válida para o produto.";
    }
    if (typeof produto.preco !== "number" || produto.preco < 0) {
        return "Informe um preço válido para o produto.";
    }
    if (typeof produto.quantidade !== "number" || produto.quantidade < 0) {
        return "Informe uma quantidade válida para o produto.";
    }
    if (typeof produto.fotoUrl !== "string" || !produto.fotoUrl.startsWith("http")) {
        return "Informe uma URL de foto válida para o produto.";
    }

    return "";
}

// ----- Rotas de leitura -----

// ----- Rotas de escrita -----

//CREATE - cadastrar um novo produto

app.post("/api/produtos", async (req, res) => {
    const { nome, descricao, preco, quantidade, fotoUrl } = req.body ?? {};
    const produto = {
        nome,
        descricao,
        preco,
        quantidade,
        fotoUrl,
    };

    const erro = validar(produto);

    if (erro) {
        res.status(400).json({ erro });
        return;
    }

    const doc = await produtos.add({ ...produto, criadoEm: Date.now() });
    res.status(201).json({ id: doc.id, ...produto });
});

app.listen(PORT, (erro) => {
    if (erro) {
        console.log(`Não foi possível iniciar o servidor: a porta ${PORT} já está em uso.`);
        process.exit(1);
    } else {
        console.log(`Servidor rodando em HTTP://localhost:${PORT}`);
    }
});
