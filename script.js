const containers=document.querySelectorAll('.choice-grid div');
const domande= document.querySelectorAll('.question-name h1');
const checkboxes= document.querySelectorAll('.checkbox');
const bottone=document.querySelector('button');
const risp_giuste=document.querySelectorAll(".giusto");
const risp_sbagliate=document.querySelectorAll(".sbagliato");

const boxes=document.querySelectorAll(".box")
const links=document.querySelectorAll(".link");


let risposta1=0;
let risposta2=0;
let risposta3=0;
let finito=0;
let conta=0;
let giusto1=0;
let giusto2=0;
let giusto3=0;
let sele1=0;
let sele2=0;
let sele3=0;
let num=0;

const clientID="1e65ce71e0324eac83cd4f622ce3503b";
const clientSecret="a30fa723a9ae48dc86aab3b5ebdb6dab";
let token;


function seleziona(event){

    const contenitore= event.currentTarget;
    
    for (let i=0; i<containers.length; i++){
        
        if(containers[i].dataset.questionId===contenitore.dataset.questionId){
             
            if(containers[i].dataset.choiceId===contenitore.dataset.choiceId && finito===0){
                
                if(contenitore.dataset.questionId==='one'){
                    risposta1=1;
                    sele1=1;
                }
                    else if(contenitore.dataset.questionId==='two'){
                        risposta2=1;
                        sele2=1;
                    }
                        else if(contenitore.dataset.questionId==='three'){
                            risposta3=1;
                            sele3=1;
                        }

                     
                    aggiorna(contenitore, i);

            }
                else if(finito===0){
                    deseleziona(containers[i], i);
                }
        }
    }

    if(risposta1===1 && risposta2===1 && risposta3===1){

        mostraRisposta();
        finito=1;
        for(let k=0; k<containers.length; k++){
        containers[k].removeEventListener('click', seleziona);
        }

    }
    
}

function aggiorna(contenitore, indice){
    
    contenitore.classList.remove("grigio");
    contenitore.classList.add("checked"); 

    const casella = checkboxes[indice];
    casella.src="images/checked.png";

    contenitore.classList.remove("unchecked");

    contenitore.removeEventListener('click', seleziona);

    if(sele1===1){
        if(contenitore.dataset.choiceId==='giusto'){
            giusto1=1;
        }
            else if(giusto1===1){
                giusto1=0;
            }
    }

    if(sele2===1){
        if(contenitore.dataset.choiceId==='giusto'){
            giusto2=1;
        }
            else if(giusto2===1){
                giusto2=0;
            }
    }

    if(sele3===1){
        if(contenitore.dataset.choiceId==='giusto'){
            giusto3=1;
        }
            else if(giusto3===1){
                giusto3=0;
            }
    }
    
    sele1=0;
    sele2=0;
    sele3=0;
}

function deseleziona(contenitore, indice){

    const casella = checkboxes[indice];
    casella.src="images/unchecked.png";

    contenitore.classList.remove("checked");
    contenitore.classList.add("grigio");
    contenitore.classList.add("unchecked");

    contenitore.addEventListener('click', seleziona);

}



function onJson(json){

    
    const results=json.results;
    let wrong=[];
    let dim=0;

    for(let a=0; a<results.length; a++){
        for(let b=0; b<results[a].incorrect_answers.length; b++){
            wrong[dim]=atob(results[a].incorrect_answers[b]);
            dim++;
        }
    }

    for(let k=0; k<results.length; k++){
        domande[k].textContent=atob(results[k].question);
    }

    for(let g=0; g<risp_giuste.length; g++){
        risp_giuste[g].textContent=atob(results[g].correct_answer);
    }

    for(let h=0; h<wrong.length; h++){
        risp_sbagliate[h].textContent=wrong[h];
    }
}

function onResponse(response){
    
    return response.json();
}

fetch("https://opentdb.com/api.php?amount=3&category=12&type=multiple&encode=base64").then(onResponse).then(onJson);

function mostraRisposta(){
    const score=document.querySelector("h2");
    conta=giusto1+giusto2+giusto3;
    score.textContent='Score: ' + conta + '/3';
}

function reset(){

    const score=document.querySelector("h2");
    score.textContent='';

    risposta1=0;
    risposta2=0;
    risposta3=0;
    finito=0;
    conta=0;
    giusto1=0;
    giusto2=0;
    giusto3=0;
    sele1=0;
    sele2=0;
    sele3=0;

    for(let k=0; k<checkboxes.length; k++){
        checkboxes[k].src="images/unchecked.png";
    }

    for(let i=0; i<containers.length; i++){
        containers[i].classList.remove("unchecked");
        containers[i].classList.remove("checked");
        containers[i].classList.add("grigio");
        containers[i].addEventListener('click', seleziona);
        
    }

    for(let k=0; k<links.length; k++){
        links[k].textContent='';
    }

    const canzone = document.querySelector('#canzone');
    canzone.value='';

    fetch("https://opentdb.com/api.php?amount=3&category=12&type=multiple&encode=base64").then(onResponse).then(onJson);

}



for (const container of containers){
    container.addEventListener('click', seleziona);
    container.classList.add("grigio");
}

bottone.addEventListener('click', reset);



function onResponseSpotify(response){
    return response.json();
}

function onJsonSpotify(json){

    for(let k=0; k<links.length; k++){
        links[k].textContent='';
    }

    console.log(json);
    const results=json.tracks.items;

    if(results.length===0){
        console.log("Nessun risultato");
    }
        else{
            for(let i=0; i<results.length; i++){
                j=i+1;
                links[i].href=results[i].uri;
                links[i].textContent=j+") "+results[i].name;
            }
        }
}



function search(event){

    event.preventDefault();

    const canzone = document.querySelector('#canzone');
    const song = encodeURIComponent(canzone.value);
    
    fetch("https://api.spotify.com/v1/search?type=track&q="+song+"&limit=3",{

      headers:{
        'Authorization': 'Bearer ' + token
      }
    }
  ).then(onResponseSpotify).then(onJsonSpotify);
}

const form = document.querySelector('form');
form.addEventListener('submit', search);

function onResponset(response){

    return response.json();
}

function onJsont(json){

    token=json.access_token;
}

fetch("https://accounts.spotify.com/api/token",{
   method: "post",
   body: 'grant_type=client_credentials',
   headers:{
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(clientID + ':' + clientSecret)
   }
  }
).then(onResponset).then(onJsont);