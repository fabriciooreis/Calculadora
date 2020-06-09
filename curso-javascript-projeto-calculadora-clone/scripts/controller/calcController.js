class CalcController{
    //DOM = document object model, BOM = browser object model
    /*Classe é um conjunto de atributos e métodos */
        /*functions e variáveis passam a se chamar métodos e atributos quando dentro de uma classe*/
    /*Uma classe vazia não serve para nada*/

    /*como em toda linguagem orientada à objetos, o javaScript também faz uso dos getters and setters
        *Um atributo private em todas a linguagens não pode ser acessado por outra classe
        *porém em Js ele pode sim ser acessado. (quiBisurdo)

        *Outra informação importante
            *os atributos private em js são referenciados com underline
            *this._atributo
        *
        * 
        * os métodos de encapsulamento getters and setters são usados com palavras reservadas da linguagem
             * get e set, por convvenção esses métodos recebem o mesmo nome dos atributos, porem sem o underline
        *
        * Outro ponto importante para as boas práticas de programação é
        * programar em inglês
        *   empresas multinacionais cobram programas em inglês
        *   empresas fora do país, usam somente o inglês
        *   é necessário treinar o idioma todos os dias, e isso já faz com que eu possa me acostumar
    */
    constructor(){
        this._lastOperator ="";
        this._lastNumber ="";
        this._operation =[];//usado para armazenar as operações da calc
        this._audioOnOf = false;
        this._audio = new Audio('click.mp3');
        this._locale = "pt-BR";
        //aqui estão selecionados os elementos- obs El no final das variáveis significa elements
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoard();
    }
    //Para ver no console
    showConsole(){
        console.log(this._operation);
    }
    //tudo o que eu quiser que aconteça assim que instanciar o calculadora
    initialize(){
        this.setLastNumberToDisplay();
        this.pasteFromClipBoard();
        this.setDisplayDataTime();
        //setInterval(function(){}); convertendo para uma arrow function
        //setInterval(()=>{}); retira a palavra function e dpois do () coloca =>
        setInterval(()=>{
            this.setDisplayDataTime();

        }, 1000);//1000 é o tempo em milissegundos da função setInterval(função, tempo em milessegundos)
        //a função setInterval realiza as operações no tempo delimitado
        //esse set interval gera um id que é usado para pará-lo caso seja necessário 
        //var idInterval = setInterval(arg, ar2);
        //clearInterval(idInterval);

        /*O mesmo funciona para o setTimeout(funcao, time), porém realiza uma única vez
         * o setTimeout gera um id -> let idTimeout = setTimeout();
         clearTimeout(idTimeout);
         */

         document.querySelectorAll(".btn-ac").forEach(btn=>{
            btn.addEventListener("dblclick", (e)=>{
                this.toggleAudio();
            });
         });
    }
    //toggle significa um disjustor de liga e desliga
    toggleAudio(){
        //this._audioOnOf = !this._audiOnOf;

        this._audioOnOf = (this._audioOnOf)? false : true;
        //this.playAudio();

        /*if(this._audioOnOf == true){
            this._audioOnOf = false;
        }else{
            this._audioOnOf = true;
        }*/
    }

    //Para tocar o audio
    playAudio(){
        if(this._audioOnOf){
            this._audio.currentTime = 0;
            this._audio.play();//executar o aúdio
        }
    }

    //método para copiar  Ctrl C
    copyToClipBoard(){
        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();//selecionando a linha do input
        document.execCommand("Copy");//mandando executar o comando copy = copiar, depois de selecionar
        input.remove();//depois remover para o usuário não ver
    }
    //método para colar Ctrl V
    pasteFromClipBoard(){
        document.addEventListener("paste", (e)=>{//evento paste = colar
            let text = e.clipboardData.getData("Text");//pegando o conteudo(texto) da area de transferência
            this.displayCalc = parseFloat(text);//convertendo para float
            //aqui só faltou tratrar para saber se o texto é numero ou não 
            //e add no this.pushOperation();
            //this.pushOperation(text);
            
        });
    }

    //recuperando as teclas para fazer as contas
    initKeyBoard(){
        document.addEventListener("keyup", e=>{

            //console.log(e.key); //aqui retorna a tecla do evento

            //tocar o audio 
            this.playAudio();

            switch(e.key){
                case 'Escape'://all clear
                    this.clearAll();
                    break;
                case 'Backspace'://clear enter
                    this.clearEntry();
                    break;
                case '+'://soma
                case '-'://subtração...
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter'://igual
                case '=':
                    this.calc();
                    break;
                case '.'://ponto
                case ',':
                    this.addDot(".");
                    break;
                case "0":
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    //this.displayCalc = this._operation;
                    break;
                /*default: não podemos deixar o default pois se a pessoa utilizar o shift vai chamar o seterror
                    this.setError();
                    //this.showConsole();
                    break;*/
                case 'c':
                    if(e.ctrlKey == true){//evento, segurando a tecla control
                        this.copyToClipBoard();
                    }
                    break;
            }

            
        });
    }
    //Criando uma função para automatizar a passagem de eventos para os botoes e layers da calc
    addEventListenerAll(element, events, fn){//1º botão ou label, 2º é o evento (click e drag), 3º funcao
        events.split(" ").forEach((event)=>{
            element.addEventListener(event, fn, false);
        });

    }
    //retornando a ultimo elemento do vetor
    getLastOperation(){
        return this._operation[this._operation.length-1];
    }
    clearAll(){
        this._operation =[];
        this.setLastNumberToDisplay(0);
        this._lastOperator ="";
        this._lastNumber ="";
        //this.showConsole();
    }
    //removendo o ultimo elemento do vetor
    //lembrando que esse método busca o valor e retira da ultima posição
    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }
    //aqui verifica se o operador foi digitado através do valor passado
    isOperation(value){
        //aqui ele está retornando indeice do simbolo da operação
        return (["+", "-", "*", "/", "%"].indexOf(value) > -1);
        //se ele não encontrar retorna -1
    }
    //add os valores na ultima posição do vetor
    setLastOperation(value){
        this._operation[this._operation.length-1] = value;
    }
    //adicionando os valores no vetor, com as devidas validaçoes e o método eval
    pushOperation(value){
        this._operation.push(value);
        if(this._operation.length > 3){
            
            this.calc();
        }
        
    }

    //retorna o resultado do eval
    getResult(){
        try{
            return eval(this._operation.join(""));
        }catch(e){
            setTimeout(()=>{
                this.setError();
            }, 1);
            
        }
    }

    //faz o calculo dos 3 primeiros elementos do array
    calc(){
        let lastIndex ="";
        //armazenando o ultimo operador
        this._lastOperator = this.getLastItem(true);

        if(this._operation.length < 3){
            let firstNumber = this._operation[0];
            this._operation =[];
            this._operation = [firstNumber, this._lastOperator, this._lastNumber];
        }

        //arrumando para quando o método for chamado pelo sinal de igual =
        if(this._operation.length > 3){

            lastIndex = this._operation.pop();
            //armazenando o ultimo número digitado na calcl
            this._lastNumber = this.getResult();

        }else if(this._operation.length == 3){
            //armazenando o ultimo número digitado na calcl
            this._lastNumber = this.getLastItem(false);
        }

        //transforma um vetor em uma string, usando um separador, qo separador é definido pelo parametro passado no método
        let result = this.getResult();

        if(lastIndex == "%"){
            result /= 100;
            this._operation = [result];
        }else{
            this._operation =[result];
                //se o ultimo index for diferente de vazio, então adiciona ele no vetor
            if(lastIndex){
                this._operation.push(lastIndex);
            }
            
        }
            this.setLastNumberToDisplay();
        
    }
    //retona o ultimo item do arry
    getLastItem(isOperation = true){
        let lastItem;
        for(let x = this._operation.length-1; x >= 0; x--){

            if(this.isOperation(this._operation[x]) == isOperation){
                //console.log(this._operation[x]);
                lastItem = this._operation[x];
                break;
            }

        }
        if(!lastItem){
            //(condição) ?(então) :(senao)
            lastItem = (isOperation)? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    //método que checa se o ultimo digito da calculadora é um número
    //caso seja ele joga no display
    setLastNumberToDisplay(isNotValue){
        let value = isNotValue;
        let lastNumber = this.getLastItem(false);
        if(!lastNumber){
            lastNumber = 0;
        }else if(value == 0){
            lastNumber = 0;
        }
        this.displayCalc = lastNumber;
    }

    //add o valor no ultimo indice do vetor
    addOperation(value){
        //console.log(this.getLastOperation());
        //aqui utilizamos a função isNaN("a") == true / isNaN("4") == false;
        //essa função verifica se o argumento passado não é um número

        //se o "ultimo" valor do vetor _operation não for um número ou se 
        //o vetor estiver vazio 
        if(isNaN(this.getLastOperation())){
            //String
            if(this.isOperation(value)){//verificando se o valor é alguma operação aritimética
                //caso já exista algum sinal, quer dizer que o usuário quer modificar o operador
                //então exclui a ultima opção
                //e add novamente o novo operador
                this._operation.pop();
                this.pushOperation(value);
                //this.showConsole();

            }else{
                //se o vetor estiver vazio e não for ponto ou operações 
                // e sim um numero que foi digitado ou seja...
                //para a primeira vez que o valor numérico for digitado
                this.pushOperation(value);
                this.setLastNumberToDisplay();
                //this.showConsole();
            }
        }else{//se a ultima posição do vetor for um número no vetor
            //verificar o que vai ser adicionado no vetor
            //se é a nova entrada é um novo número ou algum sinal
            if(this.isOperation(value)){
                
                this.pushOperation(value);//adicionando na ultima posição.
                //this.showConsole();
            }else{
                //Number
            let newValue = this.getLastOperation().toString() + value.toString();
            this.setLastOperation(newValue);
            //this.showConsole();
            //Add no display
            this.setLastNumberToDisplay();

            } 
        }
        
    }
    //adicionando o . nas operações matemáticas 
    addDot(){
        //pegando o ultimo index do vetor
        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split("").indexOf(".") > -1){
            return;
        }
        
        //caso o ultimo index retorne undefined é pq o vetor está vazio
        //ou caso o ultimo elemento do vetor seja um sinal de operação matemática 
        if(this.isOperation(lastOperation) || !lastOperation){
            this.pushOperation("0.");
        }else{
            //se não for nenhuma das opções acima é pq é um número, então é só concatenar com o ponto
            this.setLastOperation(lastOperation.toString() + ".");
        }
        this.setLastNumberToDisplay();
    }

    setError(){
        this.displayCalc = "Error";
    }
    execBtn(value){
        //tocar o audio toda vez que um botão for precionado
        this.playAudio();

        switch(value){
            case 'ac'://all clear
                this.clearAll();
                break;
            case 'ce'://clear enter
                this.clearEntry();
                break;
            case 'soma'://soma
                this.addOperation("+");
                break;
            case 'subtracao'://subtracao
            this.addOperation("-");
                break;
            case 'multiplicacao'://multiplicacao
                this.addOperation("*");
                break;
            case 'divisao'://divisao
                this.addOperation("/");
                break;
            case 'porcento'://porcento
                this.addOperation("%");
                break;
            case 'igual'://igual
                this.calc();
                break;
            case 'ponto'://ponto
                this.addDot(".");
                break;
            case "0":
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                //this.displayCalc = this._operation;
                break;
            default:
                this.setError();
                //this.showConsole();
                break;
        }
    }

    initButtonsEvents(){
        //querySelector("#buttons"); selecionando o id via querySelector
        /*querySelectorAll("#buttons > g"); retornando um nodelist que é != vetor
        *(> siginifica selecionar a tag filho), então na linha acima estamos selecionando
        *todos os filhos com tag "g"(querySelectorAll) do elemento id=buttons 
        */

        //querySelector(".buttons"); selecionando a classe via querySelector

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        //o método addEventListener é método para um elemento e não para uma lista
        buttons.forEach((btn, index)=>{
            this.addEventListenerAll(btn, "click drag", (e)=>{
                //método replace substitui uma string por outra replace(string1, string2);
                let txtBtn = `${btn.className.baseVal.replace("btn-","")}`;
                //console.log(txtBtn);
                this.execBtn(txtBtn);
            });
            this.addEventListenerAll(btn, "mouseover mousedown mouseup", (e)=>{
                btn.style.cursor = "pointer";
            });
        });
    }
    setDisplayDataTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }
    set displayTime(value){
        this._timeEl.innerHTML = value;
    }
    get displayTime(){
        return this._timeEl;
    }
    set displayDate(value){
        this._dateEl.innerHTML = value;  
    }
    get displayDate(){
        return this._dateEl;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(valor){
        if(valor.toString().length > 10){//convertendo o valor do display para string e testando seu tamanho
            //se for maior do que 10 setError();
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = valor;
    }
    get currentDate(){
        return new Date();
    }
}