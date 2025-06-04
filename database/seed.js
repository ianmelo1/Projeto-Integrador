const mongoose = require('mongoose'); // Adicionado para usar mongoose.connection.close()
const connectDB = require('./database'); // Importa a função de conexão
const User = require('../models/User'); // Model mongoose
const Boletim = require("../models/Boletim"); // Model mongoose Boletim

async function seed() {
  try {
    await connectDB(); // Conecta ao MongoDB antes de fazer qualquer operação

    console.log('--- Iniciando Seed de Usuários ---');
    await User.deleteMany({});    
    const usersData = [
      {
        nome: "Eduardo",
        email: "eduardo@gmail.com",
        password: "171172",
        role: "aluno",
        matricula: "2412130074",
        curso: "Segurança da Informação",
        telefone: "(61)0000-0000",
        cargaHoraria: 3600,
        semestre: 1,
      },
      {
        nome: "Amanda",
        email: "amanda@gmail.com",
        password: "171172",
        role: "aluno",
        matricula: "2412130074",
        curso: "Segurança da Informação",
        telefone: "(61)0000-0000",
        cargaHoraria: 3600,
        semestre: 1,
      },
      {
        nome: "Carol",
        email: "carolinelopes@gmail.com",
        password: "123456",
        role: "aluno",
        matricula: "2412130073",
        curso: "Inteligência Artificial",
        telefone: "(61)0000-0000",
        cargaHoraria: 3000,
        semestre: 5,
      },
      {
        nome: "Ian",
        email: "ianmelo@gmail.com",
        password: "010203",
        role: "aluno",
        matricula: "2412130071",
        curso: "Desenvolvimento Web",
        telefone: "(61)0000-0000",
        cargaHoraria: 3200,
        semestre: 5,
      },
      {
        nome: "Miguel",
        email: "miguel@gmail.com",
        password: "121314",
        role: "aluno",
        matricula: "2412130072",
        curso: "Ciência de Dados",
        telefone: "(61)0000-0000",
        cargaHoraria: 3600,
        semestre: 6,
      },
      // Professores
      {
        nome: "Prof. Ana Silva",
        email: "ana.silva@prof.com",
        password: "prof123",
        role: "professor",
        matricula: "PROF001",
        curso: "Docente",
        telefone: "(61)9999-1111",
        cargaHoraria: 4000,
        semestre: null,
      },
      {
        nome: "Prof. Carlos Santos",
        email: "carlos.santos@prof.com",
        password: "prof456",
        role: "professor",
        matricula: "PROF002",
        curso: "Docente",
        telefone: "(61)9999-2222",
        cargaHoraria: 4000,
        semestre: null,
      },
      {
        nome: "Prof. Maria Oliveira",
        email: "maria.oliveira@prof.com",
        password: "prof789",
        role: "professor",
        matricula: "PROF003",
        curso: "Docente",
        telefone: "(61)9999-3333",
        cargaHoraria: 4000,
        semestre: null,
      },
    ];

    const createdUserIdsAndNames = {};

    for (const userData of usersData) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = await User.create(userData);
        console.log(`✅ Usuário ${user.nome} foi criado com sucesso! ID: ${user._id}`);
      } else {
        console.log(`⚠️ Usuário com email ${user.email} já existe. ID: ${user._id}`);
      }
      createdUserIdsAndNames[user.email] = { id: user._id, nome: user.nome };
    }



    console.log('--- Seed de Usuários Concluída ---');

    console.log('\n--- Iniciando Seed de Boletins ---');
    await Boletim.deleteMany({});


    const estruturaCursos = {
      'Segurança da Informação': [
        { nomeMateria: 'Criptografia', turma: 'A1', diaDaSemana: 'Segunda-Feira' },
        { nomeMateria: 'Gestão de Riscos', turma: 'A1', diaDaSemana: 'Quarta-Feira' },
        { nomeMateria: 'Segurança de Redes', turma: 'A1', diaDaSemana: 'Sexta-Feira' },
      ],
      'Inteligência Artificial': [
        { nomeMateria: 'Introdução à IA', turma: 'B1', diaDaSemana: 'Segunda-Feira' },
        { nomeMateria: 'Machine Learning', turma: 'B1', diaDaSemana: 'Quarta-Feira' },
        { nomeMateria: 'Redes Neurais', turma: 'B1', diaDaSemana: 'Sexta-Feira' },
      ],
      'Desenvolvimento Web': [
        { nomeMateria: 'HTML e CSS Avançado', turma: 'E1', diaDaSemana: 'Segunda-Feira' },
        { nomeMateria: 'JavaScript e Frameworks', turma: 'E1', diaDaSemana: 'Quarta-Feira' },
        { nomeMateria: 'Banco de Dados para Web', turma: 'E1', diaDaSemana: 'Sexta-Feira' },
      ],
      'Ciência de Dados': [
        { nomeMateria: 'Estatística Aplicada', turma: 'D1', diaDaSemana: 'Segunda-Feira' },
        { nomeMateria: 'Big Data', turma: 'D1', diaDaSemana: 'Quarta-Feira' },
        { nomeMateria: 'Visualização de Dados', turma: 'D1', diaDaSemana: 'Sexta-Feira' },
      ]
    };

    const boletinsParaCriar = [];

    for (const userData of usersData) {
      const userInfo = createdUserIdsAndNames[userData.email];
      if (!userInfo || !userInfo.id) {
        console.log(`⚠️ Aluno com email ${userData.email} não encontrado para criar boletim.`);
        continue;
      }

      const materiasDoCursoDefinido = estruturaCursos[userData.curso];

      if (materiasDoCursoDefinido) {
        boletinsParaCriar.push({
          aluno: userInfo.id,         // O ObjectId do aluno
          nomeAluno: userInfo.nome,   // O nome do aluno, pego do 
          curso: userData.curso,
          semestre: userData.semestre,
          materias: materiasDoCursoDefinido.map((materia, index) => {
            if (!materia.diaDaSemana) {
              console.warn(`❌ Matéria sem diaDaSemana no índice ${index}:`, materia);
            }
            const n_passos = Math.floor(Math.random() * 11);
            const frequenciaAleatoria = 50 + n_passos * 5;
            return {
              nomeMateria: materia?.nomeMateria,
              diaDaSemana: materia?.diaDaSemana,
              turma: materia?.turma,
              nota: Math.random() < 0.1 ? null : parseFloat((Math.random() * 5 + 5).toFixed(1)),
              frequenciaPercentual: frequenciaAleatoria
            };
          })
        });
      } else {
        console.log(`⚠️ Matérias para o curso "${userData.curso}" (aluno ${userData.nome}) não definidas na estruturaCursos. Boletim não criado.`);
      }
    }

    if (boletinsParaCriar.length > 0) {
      await Boletim.insertMany(boletinsParaCriar);
      console.log(`✅ ${boletinsParaCriar.length} Boletins foram criados com sucesso!`);
    } else {
      console.log('⚠️ Nenhum boletim foi criado (verifique a definição dos cursos e matérias).');
    }
    console.log('--- Seed de Boletins Concluída ---');

  } catch (error) {
    console.error('❌ Erro durante a execução da seed:', error);
  } finally {
    // É uma boa prática fechar a conexão após a seed.
    console.log('\n--- Processo de Seed Finalizado ---');
  }
}

seed();
