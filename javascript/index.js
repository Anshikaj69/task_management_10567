const state = {
    taskList: [],  //array of objects , each object will store id , url and details about the task
    notes: []
}

const taskContents = document.querySelector(".task__content");
const taskModal = document.querySelector(".task-modal-body");


//task content
const htmlTaskContent = ({ id, url, type, title, description }) => `
<div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
    <div class='card shadow-sm task__card'>
        <div class='card-header d-flex justify-content-end gap-2 task__card__header'>
            <button type="button" class='btn btn-outline-info mr-2' name=${id}>
               <i class='fas fa-pencil-alt' name=${id}> </i>
            </button>
            <button type="button" class='btn btn-outline-danger mr-2' name=${id} onclick='deleteTask().apply(this , arguments)'>
               <i class='fa-solid fa-trash' name=${id}> </i>
            </button>
        </div>
    <div class="card-body">
        ${url ?
        `<img src=${url}  style='object-fit:cover ; object-position:center' height='150px' width='100%' alt='card image' class='card-image-top md-3 rounded-lg'`
        : `<img  style='object-fit:cover ; object-position:center'
        src='https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.png'  width='100%' height='150px' alt='card image' class='card-image-top md-3 rounded-lg'`
    }
        <h4 class='task__card__title card-title '>${title}</h4>
        <p class='description trim-3-lines text-muted' data-gram_editor='false'>${description}</p>
        <div class='tags text-white d-flex flex-wrap'>
            <span class='badge bg-primary m-1'>${type}</span>
        </div>
    </div >
    <div class='card-footer'>
        <button type='button' class='btn btn-outline-primary float-right'
            data-bs-toggle='modal'
            data-bs-target='#showTask'
            id='${id}'
            onclick='openTask().apply(this , arguments)'
        >Open task</button>
    </div>
    </div >
</div > `;


//modal content
const htmlModalContent = ({ id, url, title, description }) => {
    const date = new Date(parseInt(id)); // date function is used to get current date , ID will be our date , which is in string so we parse.
    return `
    < div id = "${id}" >
    ${url ?
            `<img src=${url} width="100%"  height='150px' alt='card image' class='card-image-top md-3 rounded-lg'`
            : `<img style='object-fit:cover ; object-position:center'
            src='https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.png' width="100%" alt='card image' class='card-image-top md-3 rounded-lg'`
        }
    <strong class='text-sm text-muted'>Created on ${date.toString()}</strong>
    <h2 class='my-2'>${title}</h2>
    <p class='Lead'>${description}</p>
    </div >
    `};


// update to local storage
const updateLocalStorage = () => {
    localStorage.setItem(
        "tasks", JSON.stringify({        //localStorage can only store string thus coverting object to string
            tasks: state.taskList,
        })
    );
};


//get the local storage data every time page is refreshed
const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.tasks);  //copy the tasks in localstorage as an object

    if (localStorageCopy) state.taskList = localStorageCopy.tasks;    //if local storage is not empty (it will be empty at first)

    state.taskList.map((cardDate) => {
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));  //we will get new data every time and we need to add it one after another so we use insertAdjacent and add the htmltaskcontents to html element .taskcontents beforeend
    });

};


//submit the data
const handleSubmit = (event) => {  //event can access anything inside or close to the element
    const id = `${Date.now()} `;
    const input = {
        url: document.getElementById("imageUrl").value,
        title: document.getElementById("taskTitle").value,
        type: document.getElementById("taskType").value,
        description: document.getElementById("taskDescription").value,
    };

    // if any field empty
    if (input.title == "" || input.description === "" || input.type === "") {
        return alert("Please fill out all the fields");
    }

    taskContents.insertAdjacentHTML("beforeend",
        htmlTaskContent({ ...input, id }));

    state.taskList.push({ ...input, id });
    updateLocalStorage();
};


//open task button 

const openTask = (e) => {
    if (!e) e = window.event;
    const getTask = state.taskList.find(({ id }) => id === e.target.id);     //getting id of the task selected from array 
    taskModal.innerHTML = htmlModalContent(getTask);
}


//delete task
const deleteTask = (e) => {
    if (!e) e = window.event;
    const targetID = e.target.getAttribute("name");
    const type = e.target.tagName;
    const removeTask = state.taskList.filter(({ id }) => id !== targetID);
    state.taskList = removeTask;

    updateLocalStorage();
    if (type === "BUTTON") {
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
        );
    }
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode.parentNode
    );

};
