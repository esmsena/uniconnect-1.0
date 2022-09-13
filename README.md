
<img src="https://github.com/izabellaalves/uniconnect-1.0/blob/master/public/imagens/rose.png" width="100" height="100">


# 🌹 Uniconnect

Uniconnect é uma rede social destinada aos estudantes da Universidade de Brasília. Através de interesses em comum, os alunos podem se conhecer, ter acesso às redes sociais e entrar em contato com outro aluno que possui interesses parecidos, além de poder conversar em salas de chat separadas por áreas.




## 🤝 Autores

Este projeto foi desenvolvido para a disciplina Desenvolvimento de Software por estudantes do 2° e do 3° semestre do curso de Engenharia de Software e Engenharia Aeroespacial da Universidade de Brasília.
- Esther Sena | [@esmsena](https://github.com/esmsena)
- Izabella Alves | [@izabellaalves](https://github.com/izabellaalves)
- Lucas Oliveira | [@LucasOliveiraDiasMarquesFerreira](https://github.com/LucasOliveiraDiasMarquesFerreira)
- Paulo Renato | [@Lizdtre](https://github.com/Lizdtre)




## 💻 Demonstração

<img src="https://github.com/izabellaalves/uniconnect-1.0/blob/master/public/imagens/Captura%20de%20Tela%20(1).png">
<img src="https://github.com/izabellaalves/uniconnect-1.0/blob/master/public/imagens/Captura%20de%20Tela%20(2).png">
<img src="https://github.com/izabellaalves/uniconnect-1.0/blob/master/public/imagens/Captura%20de%20Tela%20(3).png">
<img src="https://github.com/izabellaalves/uniconnect-1.0/blob/master/public/imagens/Captura%20de%20Tela%20(4).png">



## 📚 Stack utilizada

- Node JS
- HTML
- CSS
- MYSQL
- Sequelize
- Socket IO
- Multer
- Handlebars
- Express
- Bcrypt


## 🧑‍💻 Instalação

1. Certifique-se de que possui o Node JS e o MySQL instalados e configurados em seu computador.

2. Clone este repositório usando 
```bash
  git clone https://github.com/izabellaalves/uniconnect-1.0.git
```

3. Abra o prompt de comando na pasta em que se encontram os arquivos e instale as dependências usando

```bash
  npm install 
```
4. Dirija-se até models/Usuarios.js e remova as barras na linha 60 para criar a tabela no banco de dados
Isso 
```bash
  //Usuarios.sync({force: true})
```
Deve ficar assim
```bash
  Usuarios.sync({force: true})
```
Depois execute usando node app.js, e adicione novamente as barras

5. Execute digitando 
```bash
  node app.js
```
no prompt de comando. A aplicação estará disponível na porta 8081.

## 💌 

Obrigado por chegar até aqui. 
