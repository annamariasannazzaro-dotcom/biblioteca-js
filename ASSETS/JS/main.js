//COSTANTI
const MSG_OBBLIGATORIO = 'Campo obbligatorio';
const LUNGH_CODICE = 3;
//const CODICE_REGEX = /^\d{3}$/;
const CODICE_REGEX = new RegExp(`^\\d{${LUNGH_CODICE}}$`);
const LS_LIBRI_KEY = 'biblioteca';
const campiDaValidare = document.querySelectorAll('.daValidare');
const inputs = document.querySelectorAll('input[type="text"], select');


//ELEMENTI DEL DOM
const form = document.querySelector('form');
// const titolo = document.getElementById('titolo'); N.B. gli elementi di un form possono essere selezionati singolarmente come in questo caso, oppure presi dal form con form.nomeCampo
const esito = document.getElementById('esito');
const tabella = document.querySelector('table tbody');
const cancellaTutto = document.getElementById('deleteAll');

//ALTRE VARIABILI
let isValid = true;

let libri = localStorage.getItem(LS_LIBRI_KEY) ? JSON.parse(localStorage.getItem(LS_LIBRI_KEY)) : []; //se nel local storage per la nostra chiave non c'è nulla libri sarà array vuoto, altrimenti sarà popolato con gli oggetti salvati nel ls
console.log(libri);

libri.forEach(libro => popolaRigaTabella(libro));

//GESTIONE EVENTI

form.addEventListener('submit', e => {
  isValid = true; //reset della variabile
  esito.textContent = ''; //reset del messaggio esito
  e.preventDefault(); //mette in stand by la submit (non fa richiamare la action)
  //verifico che il titolo sia valorizzato

  for (const campo of campiDaValidare) {
    validaCampo(campo);
  }

  // validaCampo(form.titolo);
  // validaCampo(form.autore);
  // validaCampo(form.codice);

  //come faccio a sapere se devo proseguire?
  if (isValid) {
    //se campi validi controllo che nell'array dei libri non esista già un libro con lo stesso codice. Se esiste valorizzo il campo esito e mi fermo
    if (libri.some(elemento => elemento.codice === form.codice.value.trim())) {
      esito.textContent = `Codice ${form.codice.value} già registrato`;
      form.codice.focus();
    } else {
      //se non esiste creo un oggetto libro, lo aggiungo all'array dei libri, aggiungo una riga alla tabella, metto l'array dei libri nel local storage, svuoto il form e rimetto il focus sul titolo
      let libro = new Libro(form.titolo.value.trim(), form.autore.value.trim(), form.codice.value, form.genere.value);
      libri.push(libro);

      //METTO L'ARRAY DI LIBRI NEL LOCAL STORAGE
      localStorage.setItem(LS_LIBRI_KEY, JSON.stringify(libri));

      //AGGIUNGO RIGA TABELLA
      popolaRigaTabella(libro);
      //SVUOTO IL FORM
      form.reset();
      form.titolo.focus();
    }
  }
});

for (const campo of campiDaValidare) {
  campo.addEventListener('input', () => validaCampo(campo));
};

for (const campo of campiDaValidare) {
  campo.addEventListener('focus', () => campo.classList.add("sfondoCampoFocused"));
};

for (const campo of campiDaValidare) {
  campo.addEventListener('blur', () => campo.classList.remove("sfondoCampoFocused"));
};


cancellaTutto.addEventListener('click', () => {
  //cancellare righe tbody tabella
  console.log(tabella.rows.length);
  tabella.innerHTML = '';

  //SOLUZIONI CON I CICLI
  // while (tabella.rows.length >= 0) {
  //   tabella.deleteRow(0);
  // }

  // for (let i = tabella.rows.length - 1; i >= 0; i--) {
  //   tabella.deleteRow(i);
  // }

  //svuotare l'array libri
  libri = [];
  //allineare il ls
  // localStorage.setItem(LS_LIBRI_KEY, libri);
  //localStorage.clear(); //svuota l'intero ls
  localStorage.removeItem(LS_LIBRI_KEY); //i tre metodi in questo caso sono equivalenti
});

//ALTRE FUNZIONI
function validaCampo(campo) {
  let msg = ''; //inizializzo la variabile ma anche resetto i messaggi di errore qualora siano presenti
  let value = campo.value.trim();
  if (campo.id == 'codice' && !CODICE_REGEX.test(value)) {
    isValid = false;
    msg = 'Richieste ' + LUNGH_CODICE + ' cifre';
  } else if (value == '') {
    isValid = false;
    msg = MSG_OBBLIGATORIO;
  }
  campo.nextElementSibling.textContent = msg; //sia che il campo sia valido o non lo sia viene sempre valorizzato lo span di errore. Se è valido viene valorizzato con stringa vuota, altrimenti con il messaggio di errore.
}

function popolaRigaTabella(libro) {
  let riga = tabella.insertRow();
  //stile zebra e hover alla riga
  riga.className = "odd:bg-white even:bg-slate-200 border-b border-slate-200 hover:bg-emerald-50 transition-colors"
  riga.insertCell().innerText = libro.titolo;
  riga.insertCell().innerText = libro.autore;
  riga.insertCell().innerText = libro.codice;
  riga.insertCell().innerText = libro.genere;
}

Array.from(riga.cells).forEach((cella,index) =>{
  let classi="px-6 py-4 text-sm text-slate-900 font-medium";
  classi += (index<2)? "text-left" : "text-center";
  cella.className = classi;
});

//COSTRUTTORI
function Libro(titolo, autore, codice, genere) {
  this.titolo = titolo;
  this.autore = autore;
  this.codice = codice;
  this.genere = genere;
}
