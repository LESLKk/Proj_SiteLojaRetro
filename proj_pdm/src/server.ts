//api da loja: sevidor express crud produtos aaaaassdlkjhasdflkjhasdlkfjh sdfalkj

import express from 'express';

const app = express();

const PORT = 3000;

app.use(express.json());

app.use(express.static('public'));

app.listen(PORT, (erro) => {
    if (erro) {
        console.log(`Não foi possível iniciar o servidor: a porta ${PORT} já está em uso.`);
        process.exit(1);
    } else {
        console.log(`Servidor rodando em HTTP://localhost:${PORT}`);
    }
});