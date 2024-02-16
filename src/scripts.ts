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
    addCardElement(-1, newNameText, newDescriptionText);
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
cardHolder.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('delete-button')) {
        const taskId = parseInt(target.dataset.id);

        const cardToRemove = target.closest('.card-holder__card');
        if (cardToRemove) {
            cardToRemove.remove();
        }

        deleteCard(taskId);
    }
});


type Task = {
    id: number,
    name: string,
    description:string
}

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

const deleteCard = (id: number) => {
    const cardToRemove = document.querySelector(`.card-holder__card[data-id="${id}"]`);
    cardToRemove.remove();

    const taskUrl = `http://localhost:3004/tasks/${id}`;
    axios.delete(taskUrl)
        .then((response) => {
            console.log("Task deleted successfully", response.data);
        })
        .catch((error) => {
            console.error("Failed to delete task", error);
        });
};

const addCardElement = (id: number, heading: string, paragraph: string) => {
    let card = document.createElement('div');
    card.className = 'card-holder__card';
    card.innerHTML = `
    <button class="delete-button" data-id="${id}">X</button>
    <h2>${heading}</h2>
    <p>${paragraph}</p>`;
    
    cardHolder.append(card);
};

getAllCards().then((tasks: Task[]) => {
    tasks.forEach((element: Task) => {
        addCardElement(element.id, element.name.toString(), element.description.toString());
    });
});

