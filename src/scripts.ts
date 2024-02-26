import {doc} from "prettier";
import axios from "axios";

const cardHolder :HTMLDivElement = document.querySelector('.card-holder');
const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('button');
const popUp:HTMLElement = document.querySelector('.card-add-window');
const nameText:HTMLInputElement = document.querySelector('.name-field');
const descriptionText:HTMLInputElement = document.querySelector('.description-field');
let newNameText:string = "";
let newDescriptionText:string = "";


buttons[1].addEventListener('click', ()=>{
    const newTask: Task = {
        name: newNameText,
        description: newDescriptionText,
        id: Date.now(),
        date: new Date(Date.now()).toString(),
    };
    addCardElement(newTask);
    addCardToDB(newTask)
    popUp.classList.add('hidden');
    nameText.value = "";
    descriptionText.value = "";
});
buttons[0].addEventListener('click', ()=>{
    popUp.classList.add('hidden');
    nameText.value = "";
    descriptionText.value = "";
});
buttons[2].addEventListener('click', ()=>{
  popUp.classList.remove('hidden');
});
nameText.addEventListener('input', () => {
    newNameText = nameText.value;
});
descriptionText.addEventListener('input', () => {
    newDescriptionText = descriptionText.value;
});

type Task = {
    id: number,
    name: string,
    description:string
    date:string
}

cardHolder.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const id = target.parentElement.querySelector('.id').innerHTML
    console.log(id)
    if (target.classList.contains('delete-button')) {
        const taskId = parseInt(id);
        const cardToRemove = target.closest('.card-holder__card');
        if (cardToRemove) {
            cardToRemove.remove();
        }
        deleteCardFromDb(taskId)
    }
});

const getAllCards = () => {
    const taskUrl = "http://localhost:3004/tasks";
    let tasks: Task[] = [];

    return axios.get(taskUrl)
        .then((response) => {
            response.data.forEach((element: Task) => {
                tasks.push(element);
            });
            console.log("Tasks received successfully", response.data);
            return tasks;
        })
        .catch((error) => {
            console.error("Failed to get tasks", error);
            return [];
        });
}

const addCardElement = (newTask: Task) => {
    let card = document.createElement('div');
    const id = Date.now()
    const taskUrl = `http://localhost:3004/tasks/${newTask.id}`
    card.className = 'card-holder__card';
    card.innerHTML = `
    <button class="delete-button" data-id="${id}">X</button>
    <h2>${newTask.name}</h2>
    <p>${newTask.description}</p>
    <p>Date created: ${newTask.date}</p>
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
