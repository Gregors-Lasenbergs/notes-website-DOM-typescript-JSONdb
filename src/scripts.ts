import {doc} from "prettier";
import axios from "axios";

const cardHolder :HTMLDivElement = document.querySelector('.card-holder');
const addPopUp:HTMLElement = document.querySelector('.card-add-window');
const addNameText:HTMLInputElement = document.querySelector('.add-name-field');
const addDescriptionText:HTMLInputElement = document.querySelector('.add-description-field');
let newAddNameText:string = "";
let newAddDescriptionText:string = "";

const editPopUp:HTMLElement = document.querySelector('.card-edit-window');
const editNameText:HTMLInputElement = document.querySelector('.edit-name-field');
const editDescriptionText:HTMLInputElement = document.querySelector('.edit-description-field');
let newEditNameText:string = "";
let newEditDescriptionText:string = "";

const addCardButton:HTMLButtonElement = document.querySelector('.add-card');
const addCardClose:HTMLButtonElement = document.querySelector('.add-card__close');
const addCardSubmit:HTMLButtonElement = document.querySelector('.add-card__submit');

const editCardClose:HTMLButtonElement = document.querySelector('.edit-card__close');
const editCardSubmit:HTMLButtonElement = document.querySelector('.edit-card__submit');
let editID:number = 0;


addCardSubmit.addEventListener('click', ()=>{
    console.log('addCardSubmit clicked');
    const newTask: Task = {
        name: newAddNameText,
        description: newAddDescriptionText,
        id: Date.now(),
        // date: new Date(Date.now()).toString(),
    };
    addCardElement(newTask);
    addCardToDB(newTask)
    addPopUp.classList.add('hidden');
    addNameText.value = "";
    addDescriptionText.value = "";
});
addCardClose.addEventListener('click', ()=>{
    console.log('addCardClose clicked');
    addPopUp.classList.add('hidden');
    addNameText.value = "";
    addDescriptionText.value = "";
});
addCardButton.addEventListener('click', ()=>{
    console.log('addCardButton clicked');
    addPopUp.classList.remove('hidden');
});

editCardClose.addEventListener('click', ()=>{
    console.log('editCardClose clicked');
    editPopUp.classList.add('hidden');
    editNameText.value = "";
    editDescriptionText.value = "";
});

editCardSubmit.addEventListener('click', ()=>{
    console.log('editCardSubmit clicked');
    console.log(newEditNameText)
    console.log(newEditDescriptionText)
    const newTask: Task = {
        name: newEditNameText,
        description: newEditDescriptionText,
        id: editID,
        // date: new Date(id).toString(),
    };
    console.log(newTask)
    editCardElement(editID, newTask);
    editCardInDB(editID, newTask)
    editPopUp.classList.add('hidden');
    newEditNameText = "";
    newEditDescriptionText = "";
});

editNameText.addEventListener('input', () => {
    newEditNameText = editNameText.value;
});
editDescriptionText.addEventListener('input', () => {
    newEditDescriptionText = editDescriptionText.value;
});

addNameText.addEventListener('input', () => {
    newAddNameText = addNameText.value;
});
addDescriptionText.addEventListener('input', () => {
    newAddDescriptionText = addDescriptionText.value;
});

type Task = {
    id: number,
    name: string,
    description:string
}

cardHolder.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const id = target.parentElement.querySelector('.id').innerHTML
    if (target.classList.contains('delete-button')) {
        const taskId = parseInt(id);
        const cardToRemove = target.closest('.card-holder__card');
        if (cardToRemove) {
            cardToRemove.remove();
        }
        deleteCardFromDb(taskId)
    }
    if (target.classList.contains('edit-button')) {
        editNameText.value = target.parentElement.querySelector('h2').innerHTML;
        editDescriptionText.value = target.parentElement.querySelector('p').innerHTML;
        newEditNameText = editNameText.value;
        newEditDescriptionText = editDescriptionText.value;
        editID = parseInt(id);
        editPopUp.classList.remove('hidden');
        console.log(id)
    }
});

const getAllCards = async () => {
    const taskUrl = "http://localhost:3004/tasks";
    let tasks: Task[] = [];

    try {
        const response = await axios.get(taskUrl);
        response.data.forEach((element: Task) => {
            tasks.push(element);
        });
        console.log("Tasks received successfully", response.data);
        return tasks;
    } catch (error) {
        console.error("Failed to get tasks", error);
        return [];
    }
}

const addCardElement = (newTask: Task) => {
    let card = document.createElement('div');
    const id = newTask.id;
    card.className = 'card-holder__card';
    card.innerHTML = `
    <button class="delete-button" data-id="${id}">X</button>
    <button class="edit-button" data-id="${id}">Edit</button>
    <h2>${newTask.name}</h2>
    <p>${newTask.description}</p>
    <p>Date created: ${new Date(newTask.id).toString()}</p>
    <p class="id hidden">${newTask.id}</p>`;
    cardHolder.append(card);
};

const loadAllCardsFromDb = (tasks: Promise<Task[] | any[]>) => {
    tasks.then((tasks: Task[]) => {
        tasks.forEach((card: Task) => {
            addCardElement(card)
        })
    })
};

loadAllCardsFromDb(getAllCards())

const deleteCardFromDb = (id: number) => {
    const taskUrl = `http://localhost:3004/tasks/${id}`;
    axios.delete(taskUrl)
        .then((response) => {
            console.log("Task deleted successfully", response.data);
        })
        .catch((error) => {
            console.error("Failed to delete task", error);
        });
};

const addCardToDB = (newTask: Task) => {
    const taskUrl = `http://localhost:3004/tasks/`;
    axios.post(taskUrl, {
        id: newTask.id,
        name:newTask.name,
        description:newTask.description,
    })
        .then((response) => {
            console.log("Task added successfully", response.data);
        })
        .catch((error) => {
            console.error("Failed to add card to DataBase", error);
        });
};

const editCardInDB = (id: number, newTask: Task) => {
    const taskUrl = `http://localhost:3004/tasks/${id}`;
    console.log(newTask)
    axios.put(taskUrl, {
        name:newTask.name,
        description:newTask.description,
    })
        .then((response) => {
            console.log("Task edited successfully", response.data);
        })
        .catch((error) => {
            console.error("Failed to edit task", error);
        });
}

const editCardElement = (id: number, newTask: Task) => {
    const cardToEdit = document.querySelector(`[data-id="${id}"]`);
    console.log(cardToEdit)
    cardToEdit.parentElement.querySelector('h2').innerHTML = newTask.name;
    cardToEdit.parentElement.querySelector('p').innerHTML = newTask.description;
}