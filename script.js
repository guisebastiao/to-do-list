const task = document.querySelectorAll('.task');
const tasks = document.querySelector('.tasks');
const paragrafo = document.querySelector('p');
const days = document.querySelector('#days');
const graus = document.querySelector('#graus');
const imgTemp = document.querySelector('#img-temp')
const hoursMinutes = document.querySelector('#hours-minutes');
const datecreate = document.querySelector('#date-create');
const divisao2 = document.querySelector('.divisao-2');
const botaoExpand = document.querySelector('#expand');
const buttonAdd = document.querySelector('#add');
const containerTodoList = document.querySelector('.container-todo-list');
const adicionarTask = document.querySelector('.adicionar-task');
const editarTask = document.querySelector('.editar-task');
const tituloAdicionar = document.querySelector('#titulo-adicionar');
const conteudoAdicionar = document.querySelector('#conteudo-adicionar');
const tituloEditar = document.querySelector('#titulo-editar');
const conteudoEditar = document.querySelector('#conteudo-editar');
const buttonNaoExcluir = document.querySelector('#button-nao-excluir');
const buttonExcluir = document.querySelector('#button-excluir');
const containerExcluir = document.querySelector('.container-excluir');
const key = '359bb316017535ca9c0b9bcb3a7381c9';

function coordenadas(){
    if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition((position) => {
            try {
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${key}`).then((res) => res.json()).then((res) => {
                    graus.innerHTML = `${Math.floor(res.main.temp)} C°`;
                    imgTemp.src = `http://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`;
                });
            } catch(error){
                console.log(error)
            }
        }, function(error){
            console.log(error)
        })
    } else {
        console.log('local não encontrado!');
    }
}

document.addEventListener('click', (event) => {
    const el = event.target

    if(el.alt === 'expandir'){
        const parent1 = el.parentNode
        const parent2 = parent1.parentNode;
        const parent3 = parent2.parentNode;
        const parent4 = parent3.parentNode; 
        const div2 = parent4.children[1];
        const paragrafoA = div2.children[0];
        const dat4 = div2.children[1].children[0]

        parent4.classList.toggle('active');
        div2.classList.toggle('active');
        parent1.classList.toggle('active');
        paragrafoA.classList.toggle('active');
        dat4.classList.toggle('active');
    }

    if(el.alt === 'concluir'){
        const tarefa = el.parentNode.parentNode.parentNode.parentNode;
        const title = tarefa.children[0].children[0]

        tarefa.children[0].children[1].children[2].children[0].src = 'img/close.svg';

        if(tarefa.classList.contains('concluida')){
            tarefa.children[0].children[1].children[2].children[0].src = 'img/check.svg';
        }

        concluirTask(tarefa, title);
    }

    if(el.alt === 'deletar'){
        const tarefa = el.parentNode.parentNode.parentNode.parentNode;

        containerExcluir.classList.add('active');
        containerTodoList.classList.add('active');

        buttonNaoExcluir.addEventListener('click', () => {
            containerExcluir.classList.remove('active');
            containerTodoList.classList.remove('active');
            return;
        });

        buttonExcluir.addEventListener('click', () => {
            containerExcluir.classList.remove('active');
            containerTodoList.classList.remove('active');
            deleteTask(tarefa);
        });
    }

    if(el.alt === 'editar'){
        const tarefa = el.parentNode.parentNode.parentNode.parentNode;
        const title = tarefa.children[0].children[0]

        editartask(el.parentNode.parentNode.parentNode.parentNode.children[1].children[0], title);
    }
});

function date(){
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let day = date.getDate();
    let month = date.getMonth() + 1;
        
    hours < 10 ? hours = '0' + hours : 'err';
    minutes < 10 ? minutes = '0' + minutes : 'err';
    day < 10 ? day = '0' + day : 'err';
    month < 10 ? month = '0' + month : 'err';
        
    const hour = `${hours}:${minutes}`;
    const data = `${day}/${month}`;
    
    hoursMinutes.innerHTML = hour;
    days.innerHTML = data;
    hoursMinutes.innerHTML = hour;
    days.innerHTML = data;
}

function addtask(){
    const adicionar = document.querySelector('#adicionar');
    const buttonClose = document.querySelector('#close-adicionar');

    containerTodoList.classList.add('active');
    adicionarTask.classList.add('active');
    
    buttonClose.addEventListener('click', () => {
        containerTodoList.classList.remove('active');
        adicionarTask.classList.remove('active');
    });

    adicionar.addEventListener('click', () => {
        if(tituloAdicionar.value.trim() === '' && conteudoAdicionar.value.trim() === ''){
            return;
        }

        containerTodoList.classList.remove('active');
        adicionarTask.classList.remove('active');

        criaTask(tituloAdicionar.value, conteudoAdicionar.value);

        atualizaLocalStorage();

        tituloAdicionar.value = '';
        conteudoAdicionar.value = '';
    });
}

function editartask(tarefa, title){
    const salvar = document.querySelector('#salvar');
    const buttonClose = document.querySelector('#close-editar');

    containerTodoList.classList.add('active');
    editarTask.classList.add('active');
    
    buttonClose.addEventListener('click', () => {
        containerTodoList.classList.remove('active');
        editarTask.classList.remove('active');
    });

    tituloEditar.value = title.innerHTML;
    conteudoEditar.value = tarefa.innerHTML;

    salvar.addEventListener('click', () => {
        if(tituloEditar.value.trim() === '' && conteudoEditar.value.trim() === ''){
            return;
        }

        title.innerHTML = tituloEditar.value;
        tarefa.innerHTML = conteudoEditar.value;

        containerTodoList.classList.remove('active');
        editarTask.classList.remove('active');

        atualizaLocalStorage();
    });
}

function criaTask(titulo, conteudo){
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    day < 10 ? day = '0' + day : 'err';
    month < 10 ? month = '0' + month : 'err';

    const task = document.createElement('div');
    task.setAttribute('class', 'task');

    const divisao_1 = document.createElement('div');
    divisao_1.setAttribute('class', 'divisao-1');

    const span = document.createElement('span');
    span.setAttribute('id', 'title');

    const funcoes = document.createElement('div');
    funcoes.setAttribute('class', 'funcoes');  

    const img_edit = document.createElement('img');
    img_edit.src = 'img/edit.svg';
    img_edit.setAttribute('class', 'img-funcoes');
    img_edit.setAttribute('alt', 'editar');

    const img_delete = document.createElement('img');
    img_delete.src = 'img/delete.svg';
    img_delete.setAttribute('class', 'img-funcoes');
    img_delete.setAttribute('alt', 'deletar');

    const img_check = document.createElement('img');
    img_check.src = 'img/check.svg';
    img_check.setAttribute('class', 'img-funcoes');
    img_check.setAttribute('alt', 'concluir');

    const img_expand = document.createElement('img');
    img_expand.src = 'img/expand.svg';
    img_expand.setAttribute('class', 'img-funcoes img-expand');
    img_expand.setAttribute('alt', 'expandir');

    const button_edit = document.createElement('button');
    button_edit.setAttribute('id', 'edit'); 
    button_edit.appendChild(img_edit);

    const button_delete = document.createElement('button');
    button_delete.setAttribute('id', 'delete'); 
    button_delete.appendChild(img_delete);

    const button_check = document.createElement('button');
    button_check.setAttribute('id', 'check'); 
    button_check.appendChild(img_check);

    const button_expand = document.createElement('button');
    button_expand.setAttribute('id', 'expand'); 
    button_expand.appendChild(img_expand);

    const divisao_2 = document.createElement('div');
    divisao_2.setAttribute('class', 'divisao-2');

    const paragrafoTask = document.createElement('p');

    const create = document.createElement('div');
    create.setAttribute('class', 'create');

    const date_create = document.createElement('span');
    date_create.setAttribute('id', 'date-create');
    date_create.innerHTML = `criado em ${day}/${month}/${year}`;

    task.appendChild(divisao_1);
    divisao_1.appendChild(span);
    divisao_1.appendChild(funcoes);

    funcoes.appendChild(button_edit);
    funcoes.appendChild(button_delete);
    funcoes.appendChild(button_check);
    funcoes.appendChild(button_expand);

    task.appendChild(divisao_2);
    divisao_2.appendChild(paragrafoTask);

    create.appendChild(date_create);
    divisao_2.appendChild(create);

    span.innerHTML = titulo;
    paragrafoTask.innerHTML = conteudo;

    tasks.appendChild(task);
}

function concluirTask(tarefa, title){
    tarefa.classList.toggle('concluida');
    title.classList.toggle('concluida');

    atualizaLocalStorage();
}

function deleteTask(tarefa){
    tasks.removeChild(tarefa);
    atualizaLocalStorage();
}

function atualizaLocalStorage(){
    const tarefas = tasks.children;

    const valorLocalStorage = [...tarefas].map((valor) => {
        const titulo = valor.children[0].children[0].innerHTML;
        const conteudo = valor.children[1].children[0].innerHTML;
        const concluida = valor.classList.contains('concluida');

        return {titulo: titulo, conteudo: conteudo, concluida: concluida}
    });

    localStorage.setItem('tasks', JSON.stringify(valorLocalStorage));
}

function pegaValorStorage(){
    const valorStorage = JSON.parse(localStorage.getItem('tasks'));

    if(valorStorage === null){
        return;
    }
    
    for(let i = 0; i < valorStorage.length; i++){
        if(valorStorage[i].concluida === true){
            setTimeout(() => {
                tasks.children[i].classList.add('concluida');
                tasks.children[i].children[0].children[0].classList.add('concluida');
                tasks.children[i].children[0].children[1].children[2].children[0].src = 'img/close.svg';
            }, 1);
        }
    }

    valorStorage.forEach(valor => {
        criaTask(valor.titulo, valor.conteudo);
    });  
}

setInterval(() => {
    date();
});

buttonAdd.addEventListener('click', addtask);

window.addEventListener('load', pegaValorStorage);

coordenadas();