const taskForm=document.getElementById('task-form');
const taskInput=document.getElementById('task-input');
const taskList=document.getElementById('task-list');
const taskCount=document.getElementById('task-count');
const emptyMessage=document.getElementById('empty-message');
const filterButtons=document.querySelectorAll('.filter');
const taskDueDate = document.getElementById("task-due-date");
const taskPriority = document.getElementById("task-priority");

let tasks=JSON.parse(localStorage.getItem('tasks'))||[];
let currentFilter='all';

function saveTasks() {
    localStorage.setItem('tasks',JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML="";

    const filteredTasks=tasks.filter(task=>{
        if(currentFilter==='active'){
            return !task.completed;
        }
        if(currentFilter==='completed'){
            return task.completed;
        }
        return true;
    });

    filteredTasks.forEach(task=>{
        const li=document.createElement('li');
        if(task.completed){
            li.classList.add('completed');
        }
        const checkbox=document.createElement('input');
        checkbox.type='checkbox';
        checkbox.checked=task.completed;
        checkbox.setAttribute('aria-label',`complete ${task.text}`);

        checkbox.addEventListener('change',()=>{
            task.completed=checkbox.checked;
            saveTasks();
            renderTasks();
        });

        
        const details = document.createElement("div");
        details.className = "task-details";

        const span = document.createElement("span");
        span.textContent = task.text;
        details.appendChild(span);

        // Display the due date when one is set
        if (task.dueDate) {
            const dueDate = document.createElement("small");
            dueDate.className = "task-due-date";
            dueDate.textContent = `Due: ${task.dueDate}`;
            details.appendChild(dueDate);
        }

        // Display the task priority
        const priority = document.createElement("small");
        const priorityLevel = task.priority || "medium";

        priority.className = `task-priority priority-${priorityLevel}`;
        priority.textContent =
            priorityLevel.charAt(0).toUpperCase() + priorityLevel.slice(1);

        details.appendChild(priority);


        const editButton=document.createElement('button');
        editButton.textContent='Edit';
        editButton.className='edit-btn';
        
        editButton.addEventListener('click',()=>{
            const updatedText=prompt('Edit your task:',task.text);

            if(updatedText===null){
                return;
            }

            const trimmedText=updatedText.trim();
            if(trimmedText===''){
                alert('Task cannot be empty.');
                return;
            }

            task.text=trimmedText;
            saveTasks();
            renderTasks();
        });

        const deleteButton=document.createElement('button');
        deleteButton.textContent='Delete';
        deleteButton.className='delete-btn';

        deleteButton.addEventListener('click',()=>{
            tasks=tasks.filter(item=>item.id!==task.id);
            saveTasks();
            renderTasks();
        });

        li.append(checkbox,details,editButton,deleteButton);
        taskList.appendChild(li);
    });

    const remaining=tasks.filter(task=>!task.completed).length;

    taskCount.textContent=`${remaining} task${remaining !==1 ? 's' : ''} remaining`;
    emptyMessage.hidden=filteredTasks.length>0;

    if(tasks.length===0){
        emptyMessage.textContent="No tasks yet. Add your first task!";
    }else if(filteredTasks.length===0) {
        emptyMessage.textContent="No tasks in this category.";
    }
}

taskForm.addEventListener('submit', event=>{
    event.preventDefault();

    const text=taskInput.value.trim();

    if(text===''){
        return;
    }

    tasks.push({
        id: crypto.randomUUID(),
        text: text,
        completed: false,
        dueDate: taskDueDate.value,
        priority: taskPriority.value
    });

    saveTasks();
    taskInput.value='';
    taskDueDate.value = "";
    taskPriority.value = "medium";
    taskInput.focus();

    renderTasks();
});

filterButtons.forEach(button=>{
    button.addEventListener('click',()=>{
        currentFilter=button.dataset.filter;

        filterButtons.forEach(btn=>{
            btn.classList.toggle('active',btn===button);
        });
        renderTasks();
    });
});

renderTasks();