document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.querySelector('.input-field');
    const submitBtn = document.querySelector('.submit-btn');
    const todoLists = document.querySelector('.todoLists');
    let editIndex = -1;
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const markedTasks = JSON.parse(localStorage.getItem('markedTasks')) || [];
        if (tasks.length === 0) {
            todoLists.innerHTML = '<div class="no-todolist">No Todos...</div>';
        } else {
            todoLists.innerHTML = '';
            tasks.forEach((task, index) => {
                createTaskElement(task, index, markedTasks.includes(index));
            });
        }
    };
    const createTaskElement = (task, index, isMarked) => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        if (isMarked) {
            contentDiv.classList.add('marked');
        }

        const taskP = document.createElement('p');
        taskP.textContent = task;

        const markSpan = document.createElement('span');
        markSpan.classList.add('icon', 'mark');
        markSpan.innerHTML = '<img src="public/icons/mark.svg"  width="20px" height="20px">';
        markSpan.addEventListener('click', () => markTask(index, contentDiv));

        const editSpan = document.createElement('span');
        editSpan.classList.add('icon');
        editSpan.innerHTML = '<img src="public/icons/edit.svg"  width="25px" height="25px">';
        editSpan.addEventListener('click', () => startEditTask(index, task));

        const deleteSpan = document.createElement('span');
        deleteSpan.classList.add('icon');
        deleteSpan.innerHTML = '<img src="public/icons/delete.svg"  width="20px" height="20px">';
        deleteSpan.addEventListener('click', () => deleteTask(index));

        contentDiv.appendChild(taskP);
        contentDiv.appendChild(markSpan);
        contentDiv.appendChild(editSpan);
        contentDiv.appendChild(deleteSpan);
        taskDiv.appendChild(contentDiv);
        todoLists.appendChild(taskDiv);
    };

    //mark//
    const markTask = (index, contentDiv) => {
        const markedTasks = JSON.parse(localStorage.getItem('markedTasks')) || [];
        if (markedTasks.includes(index)) {
            contentDiv.classList.remove('marked');
            const newMarkedTasks = markedTasks.filter(i => i !== index);
            localStorage.setItem('markedTasks', JSON.stringify(newMarkedTasks));
        } else {
            contentDiv.classList.add('marked');
            markedTasks.push(index);
            localStorage.setItem('markedTasks', JSON.stringify(markedTasks));
        }
    };

    //edit//
    const saveTask = () => {
        const task = inputField.value.trim();
        if (task) {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            if (editIndex > -1) {
                tasks[editIndex] = task;
                editIndex = -1;
            } else {
                tasks.push(task);
            }
            localStorage.setItem('tasks', JSON.stringify(tasks));
            inputField.value = '';
            loadTasks();
        }
    };
    const startEditTask = (index, task) => {
        inputField.value = task;
        editIndex = index;
        submitBtn.textContent = 'Update';
    };

    //delete//
    const deleteTask = (index) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        const markedTasks = JSON.parse(localStorage.getItem('markedTasks')) || [];
        const newMarkedTasks = markedTasks.filter(i => i !== index);
        localStorage.setItem('markedTasks', JSON.stringify(newMarkedTasks));

        loadTasks();
    };
    submitBtn.addEventListener('click', () => {
        saveTask();
        submitBtn.textContent = 'Add';
    });
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveTask();
        }
    });
    loadTasks();
});
