const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./database.db');

db.run(`CREATE TABLE IF NOT EXISTS atendimentos(
id INTEGER PRIMARY KEY AUTOINCREMENT,
idade INTEGER,
cidade TEXT,
tipo_violencia TEXT,
descricao TEXT,
risco TEXT,
status TEXT)`);

app.post('/atendimentos',(req,res)=>{
 const {idade,cidade,tipo_violencia,descricao,risco}=req.body;
 db.run(`INSERT INTO atendimentos
 (idade,cidade,tipo_violencia,descricao,risco,status)
 VALUES(?,?,?,?,?,?)`,
 [idade,cidade,tipo_violencia,descricao,risco,'Pendente'],
 function(err){
   if(err) return res.status(500).json(err);
   res.json({id:this.lastID});
 });
});

app.get('/atendimentos',(req,res)=>{
 db.all('SELECT * FROM atendimentos',[],(err,rows)=>{
   if(err) return res.status(500).json(err);
   res.json(rows);
 });
});

app.put('/atendimentos/:id',(req,res)=>{
 db.run('UPDATE atendimentos SET status=? WHERE id=?',
 [req.body.status,req.params.id],
 ()=>res.json({ok:true}));
});

app.delete('/atendimentos/:id',(req,res)=>{
 db.run('DELETE FROM atendimentos WHERE id=?',
 [req.params.id],
 ()=>res.json({ok:true}));
});

app.listen(3000,()=>console.log('Servidor rodando'));
