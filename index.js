const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require('./database/database');
const seed = require('./database/seed');

// Importação dos controllers e rotas
const authRouter = require("./routes/authRoutes");
const boletimRouter = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const frequenciaRoutes = require('./routes/frequenciaRoutes');
const professorRoutes = require('./routes/professorRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

// Middlewares essenciais (segurança e parsing)
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middlewares de aplicação
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Rota de teste única (mantida no início)
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: "Backend funcionando!",
    timestamp: new Date(),
    routes: {
      textReport: "/api/reports/text/:email",
      graphReport: "/api/reports/graph/:email"
    }
  });
});

// Rotas principais (mantidas exatamente como estavam)
app.use("/auth", authRouter);

app.use('/api/boletim', boletimRouter);
app.use('/api/reports', reportRoutes);
app.use('/api/grades', authMiddleware,  gradeRoutes);
app.use('/api/frequencia', authMiddleware, frequenciaRoutes);
app.use('/api/professor', professorRoutes);


// Rota de erros 404 (mantida igual)
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Rota não encontrada' });
});

// Conexão com banco de dados (mantida igual)
connectDB();

const PORT = 8080;
app.listen(PORT, '0.0.0.0', () => { // Adicione '0.0.0.0'
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('Teste com:');
  console.log(`curl http://localhost:${PORT}/api/ping`);
});