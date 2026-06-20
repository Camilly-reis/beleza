const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();


app.use(cors());


app.use(express.json());

const db = new sqlite3.Database("./database.db");


db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS atendimentos (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            idade INTEGER,

            cidade TEXT,

            tipo_violencia TEXT,

            descricao TEXT,

            risco TEXT,

            status TEXT
        )
    `);

});


app.post("/atendimentos", (req, res) => {

    const {
        idade,
        cidade,
        tipo_violencia,
        descricao,
        risco
    } = req.body;


    if(!idade || !cidade || !tipo_violencia){

        return res.status(400).json({

            sucesso:false,

            mensagem:"Dados obrigatórios não enviados."

        });

    }


    db.run(
        `
        INSERT INTO atendimentos
        (
            idade,
            cidade,
            tipo_violencia,
            descricao,
            risco,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            idade,
            cidade,
            tipo_violencia,
            descricao,
            risco,
            "Pendente"
        ],

        function(err){

            if(err){

                console.error(err);

                return res.status(500).json({

                    sucesso:false,

                    mensagem:"Erro ao cadastrar."

                });

            }


            res.status(201).json({

                sucesso:true,

                mensagem:"Atendimento cadastrado.",

                id:this.lastID

            });


        }

    );

});


app.get("/atendimentos", (req, res) => {

    db.all(
        "SELECT * FROM atendimentos ORDER BY id DESC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    sucesso: false,
                    mensagem: "Erro ao listar atendimentos."
                });
            }

            res.json(rows);
        }
    );

});

app.get("/atendimentos/:id", (req, res) => {

    db.get(
        "SELECT * FROM atendimentos WHERE id = ?",
        [req.params.id],

        (err, row) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (!row) {
                return res.status(404).json({
                    mensagem: "Atendimento não encontrado."
                });
            }

            res.json(row);
        }
    );

});


app.put("/atendimentos/:id", (req, res) => {

    const { status } = req.body;

    db.run(
        `
        UPDATE atendimentos
        SET status = ?
        WHERE id = ?
        `,
        [status, req.params.id],

        function(err){

            if(err){
                return res.status(500).json(err);
            }

            if(this.changes === 0){

                return res.status(404).json({
                    sucesso:false,
                    mensagem:"Atendimento não encontrado."
                });

            }

            res.json({
                sucesso:true,
                mensagem:"Status atualizado com sucesso."
            });

        }

    );

});


app.delete("/atendimentos/:id", (req, res) => {

    db.run(
        `
        DELETE FROM atendimentos
        WHERE id = ?
        `,
        [req.params.id],

        function(err){

            if(err){
                return res.status(500).json(err);
            }

            if(this.changes === 0){

                return res.status(404).json({
                    sucesso:false,
                    mensagem:"Atendimento não encontrado."
                });

            }

            res.json({
                sucesso:true,
                mensagem:"Atendimento excluído com sucesso."
            });

        }

    );

});

app.listen(3000, () => {

    console.log(
        "Servidor rodando em http://localhost:3000"
    );

});