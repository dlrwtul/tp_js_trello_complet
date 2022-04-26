const addColumn = document.getElementById("addColumn");
const addItem = document.getElementById("addItem");
const btnMenu = document.getElementById("btnMenu");
const optionsslidebtn = document.getElementById("optionsslidebtn");
const btnoptions = document.getElementById("btnoptions");
const quitmodal = document.getElementById("quitmodal");
const archivebtns = document.querySelectorAll(".archivebtn");
const savebtns = document.querySelectorAll(".savebtn");
const resetposs = document.querySelectorAll(".resetpos");
const btnrestoreetats = document.querySelectorAll(".btnrestoreetat");
const autosaves = document.querySelectorAll(".autosave");
const btnrestorearchived = document.querySelector("#btnrestorearchived");


const formcontrol = document.getElementsByName("form-control")[0]

const header = document.querySelector(".header");
const body = document.querySelector(".body");
const modal = document.querySelector(".modal");
const notif = document.querySelector(".notif");
const btnsoptions = document.querySelector(".btnsoptions");
const options = document.querySelector(".options");
const bodytrash = document.querySelector(".bodytrash");

var restoreDates = [];
var restoreColumns = [];

const url = "http://localhost/TPjstrelloback/public/";

//==================================================
//fonctions back;=========================================================

async function get_set_data(url,action,object = {}) {

    let form = new FormData()

    form.append('controller','tache');
    form.append('action',action);
    form.append("data",JSON.stringify(object))

    let myHeaders =  new Headers();

    var request = new Request(url,{
        method: "POST",
        body: form,
        headers: myHeaders
    });

    try {
        let response = await fetch(request);
        return await response.json();
    } catch (err) {
        console.log("error");
    }
}

function show_data(date = "") {
    let data = get_set_data(url,'show');
    data.then((value) => {
        let columns = value;
        restoreColumns=[];
        restoreDates = [];
        for (const key in columns) {
            if (Object.hasOwnProperty.call(columns, key)) {
                const column = columns[key];
                restoreDates.push(key);
                restoreColumns.push(column);
            }
        }
        put_date_saves(restoreDates);

        if (date === "") {

            show_restore(restoreColumns[restoreColumns.length-1]);
            notif_fun("succes","restauration du dernier etat reussi");

        } else {

            const index = restoreDates.indexOf(date);
            show_restore(restoreColumns[index]);
            notif_fun("succes",`restauration de la date ${date} reussi`);

        }
        
    })
}

function put_date_saves(array) {
    document.querySelector(".bodysaves").innerHTML = ""
    array.forEach(date => {
        const span = document.createElement("span");
        span.innerHTML = date;
        document.querySelector(".bodysaves").appendChild(span);
    });
}

function set_at_restore_task(parent,text,date,debut,fin,etat) {
    const task = create_task();
    task.querySelector(".taskstate").innerHTML =etat;
    if (etat === "en cours") {
        task.classList.add("encours");
    }
    if(etat === "termine") {
        task.classList.add("termine");
    }
    parent.appendChild(task);
    set_item(task,text,date,debut,fin,etat);
}

function save_data(object) {
    let data = get_set_data(url,'set',object);
    data.then((value) => {
        console.log(value);
    })
}

function show_restore(column) {
    body.innerHTML = "";
    bodytrash.innerHTML = "";
    for (let index = 0; index < column.length-1; index++) {
        const elementColumn = column[index];
        const newColumn = create_column(parseInt(elementColumn.position));
        newColumn.querySelector("input").value = elementColumn.titre;
        body.appendChild(newColumn);
        elementColumn.taches.forEach(task => {
            set_at_restore_task(newColumn.querySelector(".bodycolumn"),task.text,task.date,task.debut,task.fin,task.etat);
        });
        
    }
    const archiveTab = column[column.length -1];
    if (archiveTab.length > 0) {
        archiveTab.forEach(task => {
            const bodytrash = document.querySelector(".bodytrash");
            const archivedTask = create_archived_task(task.text,task.date,task.debut,task.fin);
            archivedTask.addEventListener('click',function () {
                archivedTask.classList.toggle("clicked");
            })
            bodytrash.appendChild(archivedTask);
            set_item(archivedTask,task.text,task.date,task.debut,task.fin,task.etat,"no ok")
            archivedTask.setAttribute("data-parent",task.parent);
        });
        
    }
}

function set_task_for_save(task,parent) {
    const objTask = {
        "text":task.getAttribute("data-text"),
        "date":task.getAttribute("data-date"),
        "debut":task.getAttribute("data-debut"),
        "fin":task.getAttribute("data-fin"),
        "etat":task.getAttribute("data-etat"),
        "parent":task.getAttribute("data-parent")
    }
    parent.push(objTask);
}

function get_columns() {
    var tabState = [];
    const columns = document.querySelectorAll(".column");
    columns.forEach(column => {

        const position = column.getAttribute("data-pos");
        const title = column.querySelector("input").value;

        var taches = [];

        column.querySelectorAll(".taskitem").forEach(task => {
            set_task_for_save(task,taches)

        });

        const objColumn = {
            "position":position[position.length-1],
            "titre":title,
            "taches":taches
        };

        tabState.push(objColumn);

    });

    var archivedTasks = [];

    document.querySelectorAll(".archivedtask").forEach(task => {
        console.log(task)
        set_task_for_save(task,archivedTasks)
    });

    tabState.push(archivedTasks);

    return tabState;
}

//fonctions back;=========================================================

function champ_obligatoire(element) {
    if (element.value.trim() !== "") {
        return true;
    }
    return false;
}

function valid_date() {
    if (champ_obligatoire(formcontrol[1])) {
        if (valid_debut()) {
            if (valid_fin()) {
                return true
            }
            return false
        }
        return false
    } else {
        formcontrol[2].value = "";
        formcontrol[3].value = "";
        return true;
    }
}

function valid_debut() {
    if (champ_obligatoire(formcontrol[2])) {
        let debut = formcontrol[2].value ;
        let date = formcontrol[1].value;
        const dateDebut = new Date(date+"T"+debut[0]+debut[1]+":"+debut[3]+debut[4]+":"+"00");
        const now = new Date();
        if (dateDebut >= now) {
            return true
        }
        notif_fun("Error","Entrer une heure de debut valide");
        return false;
    }else {
        notif_fun("Error","Entrer une heure de debut");
        return false;
    }
}

function valid_fin() {
    let date = formcontrol[1].value;
    let debut = formcontrol[2].value ;
    let fin = formcontrol[3].value ;
    if (fin !== "") {
        const dateDebut = new Date(date+"T"+debut[0]+debut[1]+":"+debut[3]+debut[4]+":"+"00");
        const dateFin = new Date(date+"T"+fin[0]+fin[1]+":"+fin[3]+fin[4]+":"+"00");
        if (dateDebut < dateFin) {
            return true
        }
        notif_fun("Error","Entrer une heure de fin valide");
        return false;
    } else {
        notif_fun("Error","Entrer une heure de fin");
        return false;
    }
}

//form validators===============================

function hideorshow() {
    const columnbodys = document.querySelectorAll(".bodycolumn");
    if (columnbodys.length > 1) {
        columnbodys[0].parentElement.querySelector(".quittColumn").style.visibility = "hidden";
    } else {
        columnbodys[0].parentElement.querySelector(".quittColumn").style.visibility = "visible";
    }
}

function reset_form() {
    for (let index = 0; index < formcontrol.length-1; index++) {
        const element = formcontrol[index];
        element.value = "";
    }
    modal.querySelector(".formheader span:first-child").innerHTML = "Creer une nouvelle tache "
    modal.classList.remove("show");
}

function set_item(task,text,date,debut,fin,etat,ok = "") {
    task.setAttribute('data-text',text);
    task.setAttribute('data-date',date);
    task.setAttribute('data-debut',debut);
    task.setAttribute('data-fin',fin);
    task.setAttribute('data-etat',etat);
    if (ok === "") {
        task.querySelector("span:nth-child(2)>p").innerHTML = text;
    }
}

function notif_fun(typemess,text) {
    const div = document.createElement("div")
    const h3 = document.createElement('h3')
    h3.innerHTML = typemess

    div.appendChild(h3)

    const p = document.createElement("p")
    p.innerHTML = text;

    div.appendChild(p)
    if (notif.querySelectorAll("div").length < 4) {
        notif.appendChild(div);
    }
    notif.classList.add("show")
    setTimeout(() => {
        div.remove()
        if (notif.querySelectorAll("div").length === 1) {
            notif.classList.remove("show")
        }
    }, 5000);
}

function create_column(nbrColumn) {
    const column = document.createElement("div");
    column.className = "column";
    column.setAttribute('data-pos',`${nbrColumn}`)

    const headercolumn = document.createElement("div");
    headercolumn.className = "headercolumn";

    const span1 = document.createElement("span");
    const input1 = document.createElement("input");
    input1.type = "text";
    input1.value = `Column ${nbrColumn}`;
    span1.appendChild(input1);

    const span2 = document.createElement("span");
    span2.className = "quittColumn";

    const ispan2 = document.createElement("i");
    ispan2.className = "fa-solid fa-square-minus fa-2xl"
    span2.appendChild(ispan2);
    span2.addEventListener('click',function () {  
        this.parentElement.parentElement.remove();
        reset_pos()
        hideorshow()
    })

    headercolumn.appendChild(span1);
    headercolumn.appendChild(span2);

    column.appendChild(headercolumn);

    const bodycolumn = document.createElement("div");
    bodycolumn.className = "bodycolumn";

    column.appendChild(bodycolumn);
    return column;
}

function reset_pos() {
    i = 1;
    const columns = document.querySelectorAll(".column");
    columns.forEach(column => {
        column.setAttribute('data-pos',`${i++}`)
        column.querySelectorAll(".taskitem").forEach(task => {
            task.setAttribute("data-parent",column.getAttribute("data-pos"))
        });
    });
}

function create_task() {

    const task = document.createElement("div");
    task.className ="taskitem init"
    const span1 = document.createElement("span");
    const ispan1 = document.createElement("i")
    ispan1.className = "fa-solid fa-angles-left";

    span1.addEventListener('click',function () {
        const currentColumn = this.parentElement.parentElement.parentElement;
        const previousColumn = currentColumn.previousSibling;
        const previousbodycolumn = previousColumn.querySelector(".bodycolumn");
        previousbodycolumn.appendChild(this.parentElement);
        reset_pos();
    })

    span1.appendChild(ispan1);

    const span2 = document.createElement("span");

    const spanetat = document.createElement("span");
    spanetat.className = "taskstate";
    spanetat.innerHTML = "init";

    spanetat.addEventListener('mouseenter',function (e) {
        const item = e.target.parentElement.parentElement;
        spanetat.innerHTML = `${item.getAttribute("data-date")} de ${item.getAttribute("data-debut")} a ${item.getAttribute("data-fin")}`;
    })

    spanetat.addEventListener('mouseleave',function (e) {
        const item = e.target.parentElement.parentElement;
        spanetat.innerHTML = `${item.getAttribute("data-etat")}`;
    })

    span2.appendChild(spanetat);

    const pspan2 = document.createElement("p");
    span2.appendChild(pspan2);

    const spansettings = document.createElement("span");
    const ispanset1 = document.createElement("i");
    ispanset1.className = "fa-solid fa-box archiver";

    ispanset1.addEventListener('click',function (e) {
        const item = e.target.parentElement.parentElement.parentElement;
        const archivedTask = create_archived_task(item.getAttribute("data-text"),item.getAttribute("data-date"),item.getAttribute("data-debut"),item.getAttribute("data-fin"));
        bodytrash.appendChild(archivedTask);
        merge_attributes(item,archivedTask);
        archivedTask.addEventListener('click',function () {
            archivedTask.classList.toggle("clicked");
        })
        item.remove();
        document.querySelector(".parenttrash").classList.add("show");
        setTimeout(() => {
            document.querySelector(".parenttrash").classList.remove("show");
        }, 2000);
    })

    const ispanset2 = document.createElement("i");
    ispanset2.className = "fa-solid fa-gears setting";

    ispanset2.addEventListener('click',(e)=>{
        const item = e.target.parentElement.parentElement.parentElement;

        if (item.getAttribute("data-etat") !== 'termine') {
            item.classList.add("modify");
            modal.classList.add("show");
            modal.querySelector(".formheader span:first-child").innerHTML = "Modifier une tache"

            if (item.getAttribute("data-etat") === 'en cours') {
                formcontrol[1].readOnly = true;
                formcontrol[2].readOnly = true;
                formcontrol[3].readOnly = true;
            }

            formcontrol[0].value = item.getAttribute("data-text");
            formcontrol[1].value = item.getAttribute("data-date");
            formcontrol[2].value = item.getAttribute("data-debut");
            formcontrol[3].value = item.getAttribute("data-fin");
        }
    })

    spansettings.appendChild(ispanset1);
    spansettings.appendChild(ispanset2);

    span2.appendChild(spansettings);

    const span3 = document.createElement("span");
    const ispan3 = document.createElement("i")
    ispan3.className = "fa-solid fa-angles-right";

    span3.addEventListener('click',function () {
        const currentColumn = this.parentElement.parentElement.parentElement;
        const nextColumn = currentColumn.nextSibling;
        const nextbodycolumn = nextColumn.querySelector(".bodycolumn");
        nextbodycolumn.appendChild(this.parentElement);
        reset_pos();
    })

    span3.appendChild(ispan3);

    task.appendChild(span1);
    task.appendChild(span2);
    task.appendChild(span3);

    return task;
}

function set_timer() {
    const tasks = document.querySelectorAll(".taskitem")
    tasks.forEach(task => {
        if (task.getAttribute('data-date') !== "" && task.getAttribute('data-debut') !== "" && task.getAttribute('data-fin') !== "" ) {
            let date = task.getAttribute('data-date');
            let debut = task.getAttribute('data-debut') ;
            let fin = task.getAttribute('data-fin') ;
            const timedebut = new Date(date+"T"+debut[0]+debut[1]+":"+debut[3]+debut[4]+":"+"00");
            const timefin = new Date(date+"T"+fin[0]+fin[1]+":"+fin[3]+fin[4]+":"+"00");
            var now = new Date();
            if (now >= timedebut && timefin >= now) {
                task.setAttribute('data-etat','en cours');
                task.classList.remove("init");
                task.classList.add("encours");
                const span = task.querySelector(".taskstate");
                if (span.innerHTML === "init") {
                    span.innerHTML = "en cours";
                }
                setTimeout(() => {
                    task.setAttribute('data-etat','termine');
                    task.classList.remove("encours");
                    task.classList.add("termine");
                    span.innerHTML = "terminé";
                    if (notif.querySelectorAll("div").length === 0) {
                        notif_fun("tache",`Nouvelle tache terminée : ${debut} / ${fin}`); 
                    }
                }, timefin-now);
            }
        }
    });
}

function create_archived_task(text,date,debut,fin) {
    const div = document.createElement("div");
    div.className = "archivedtask";

    const span1 = document.createElement("span");
    span1.innerHTML = text

    div.appendChild(span1)

    const span2 = document.createElement("span");
    const p2 = document.createElement("p")
    p2.innerHTML = `Date:${date} <br> Debut:${debut} <br> Fin:${fin} `;

    span2.appendChild(p2);
    div.appendChild(span2)

    return div;
}

function merge_attributes(element,target) {
    for (const key in element.attributes) {
        if (Object.hasOwnProperty.call(element.attributes, key)) {
            const att = element.attributes[key];
            if (att.name.substr(0,4) === "data") {
                target.setAttribute(att.name,att.value)
            }   
        }
    }
}

//==================================================
quitMenu.addEventListener('click',()=>{
    header.classList.remove("show");
})

btnMenu.addEventListener('click',()=>{
    header.classList.toggle("show");
})

optionsslidebtn.addEventListener('click',()=>{
    btnsoptions.classList.toggle("show");
})

btnoptions.addEventListener('click',()=>{
    options.classList.toggle("show");
})

addColumn.addEventListener('click',()=>{
    const nbrColumn = document.querySelectorAll(".column").length;
    if (nbrColumn < 4) {
        const newColumn = create_column(nbrColumn + 1);
        body.appendChild(newColumn);
        hideorshow()
    } else {
        notif_fun("error","nobre maximal de colonne atteint!!!")
    }
})

addItem.addEventListener('click',()=>{
    const columns = document.querySelectorAll(".column");
    if (columns.length > 0) {
        modal.classList.add("show");
    } else {
        notif_fun("Error","Ajouter une colonne d'abord!!!")
    }

})

formcontrol[formcontrol.length-1].addEventListener('click',function (e) {
    if (valid_date()) {
        const modifyitem = document.querySelector(".modify");
        if (modifyitem === null) {
            const newtask = create_task();
            const firstColumn = document.querySelectorAll(".column")[0];
            firstColumn.querySelector(".bodycolumn").appendChild(newtask);
            set_item(newtask,formcontrol[0].value,formcontrol[1].value,formcontrol[2].value,formcontrol[3].value,"init");
        } else {
            set_item(modifyitem,formcontrol[0].value,formcontrol[1].value,formcontrol[2].value,formcontrol[3].value,"init");
        }
        reset_form();
    }else {
        e.preventDefault();
    }
    
})

quitmodal.addEventListener('click',function () {
    const modifyitem = document.querySelector(".modify");
    if (modifyitem !== null) {
        modifyitem.classList.remove("modify")
    }
    reset_form();
})

archivebtns.forEach(archivebtn => {
    archivebtn.addEventListener('click',function () {
        if (document.querySelectorAll(".archivedtask").length > 0) {
            document.querySelector(".parenttrash").classList.add("show");
        } else {
            notif_fun("error","L'archive est vide!!!")
        }
    }) 
});

document.querySelectorAll(".archivedtask").forEach(archivedtask => {
    archivedtask.addEventListener('click',function () {
        archivedtask.classList.toggle("clicked");
    })
});

btnrestorearchived.addEventListener('click',function () {
    const archivedTasks = document.querySelectorAll(".archivedtask");
    archivedTasks.forEach(archivedTask => {
        if (archivedTask.classList.contains("clicked")) {
            const task = create_task();
            set_item(task,archivedTask.getAttribute("data-text"),archivedTask.getAttribute("data-date"),archivedTask.getAttribute("data-debut"),archivedTask.getAttribute("data-fin"),archivedTask.getAttribute("data-etat"));
            const parentId = archivedTask.getAttribute("data-parent");
            var parent = "" ;
            document.querySelectorAll(".column").forEach(column => {
                if (column.getAttribute("data-pos") === parentId) {
                    parent = column.querySelector(".bodycolumn");
                }
            });
            if (parent === "") {
                document.querySelector(".bodycolumn")[0].appendChild(task);
            } else {
                parent.appendChild(task);
            }
            archivedTask.remove();
        }
    });
})

resetposs.forEach(resetpos => {
    resetpos.addEventListener('click',function () {
        const columns = document.querySelectorAll(".column")
        if (columns.length > 0) {
            const bodyColumn = columns[0].querySelector(".bodycolumn");
            const tasks = document.querySelectorAll(".taskitem")
            if (tasks.length > 0) {
                tasks.forEach(task => {
                    bodyColumn.appendChild(task);
                })
            } else {
                notif_fun("error","Ajoutez d'abord des taches !!!")
            }
        } else {
            notif_fun("error","Ajoutez d'abord des colonnes !!!")
        }
        
    })
});

document.querySelector(".parenttrash").addEventListener('click',function (e) {
    if (e.target === document.querySelector(".parenttrash")) {
        document.querySelector(".parenttrash").classList.remove("show");
    }
})

savebtns.forEach(savebtn => {
    savebtn.addEventListener("click",function () {
        if (document.querySelectorAll(".column").length > 0) {
            const array = get_columns();
            save_data(array);
            const now = new Date();
            notif_fun("succes save",`Etat sauvegardé avec succes ,Date et heure: ${now}`)
        } else {
            notif_fun("error save","Ajoutez d'abord des colonnes !!!")
        }   
    })
});

setInterval(() => {
    set_timer();
    reset_pos();
}, 100);

autosaves.forEach(autosave => {
    autosave.addEventListener('change',function () {
        if (autosave.checked === true) {
            notif_fun("save","sauvegarde automatique activée")
        }else {
            notif_fun("save","sauvegarde automatique desactivée")
        }
    })
});

btnrestoreetats.forEach(btnrestoreetat => {
    btnrestoreetat.addEventListener('click',function () {
        modal.classList.add("show");
        modal.classList.add("save");
        document.querySelectorAll(".bodysaves>span").forEach(span => {
            span.addEventListener('click',function () {
                const date = span.innerHTML;
                show_data(date);
                modal.classList.remove("show");
                modal.classList.remove("save");
            })
        });
    })
});

document.querySelector("#quitsaves").addEventListener('click',()=>{
    modal.classList.remove("show");
    modal.classList.remove("save");
})

setInterval(() => {
    autosaves.forEach(autosave => {
        if (autosave.checked === true) {
            if (document.querySelectorAll(".column").length > 0) {
                const array = get_columns();
                save_data(array);
                console.log("save succes");
            } else {
                notif_fun("error save","Ajoutez d'abord des colonnes !!!");
            }
        }
    });
}, 5000);

window.onload = show_data();
