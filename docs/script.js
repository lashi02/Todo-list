// Estado de la aplicación
let tasks = [];
let currentFilter = 'all'; //se le asigna el valor all, active o completed a traves de los botones de filtro
let searchQuery = ''; // texto de búsqueda actual
let currentTheme = 'light';
let searchVisible = false;

// Elementos del DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const searchToggle = document.getElementById('searchToggle');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Cargar tareas del localStorage al iniciar
function loadTasks() {
    try {
        // 1. Intenta leer los datos guardados del localStorage
        const savedTasks = localStorage.getItem('tasks');
        
        // 2. Verifica si existen datos guardados
        if (savedTasks) {
            // 3. Intenta convertir el string JSON a un array de objetos
            // JSON.parse puede lanzar un error si el formato es inválido (datos corruptos)
            const parsedTasks = JSON.parse(savedTasks);
            
            // 4. Valida que el resultado sea un array
            if (Array.isArray(parsedTasks)) {
                tasks = parsedTasks;
                renderTasks(); // 5. Muestra las tareas si todo está correcto
            } else {
                // Si no es un array, inicializa con array vacío y limpia datos corruptos
                console.warn('Los datos guardados no son un array válido. Se inicializará con lista vacía.');
                tasks = [];
                localStorage.removeItem('tasks'); // Limpia datos inválidos
            }
        }
    } catch (error) {
        // 6. Manejo de errores: captura cualquier excepción durante el proceso
        // Esto puede ocurrir si:
        // - JSON.parse falla por formato inválido
        // - localStorage está bloqueado o no disponible
        // - Hay problemas de memoria
        console.error('Error al cargar tareas del localStorage:', error);
        
        // 7. Inicializa con array vacío para evitar que la app se rompa
        tasks = [];
        
        // Limpia los datos corruptos del localStorage para evitar errores futuros
        localStorage.removeItem('tasks');
    }
}

// Guardar tareas en localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks)); //convierte el array de tareas en una cadena de texto y lo guarda en el localStorage
}

// Crear una nueva tarea
function createTask(text) {
    return {
        id: Date.now(),
        text: text.trim(), //Guarda el texto sin espacios al inicio y al final.
        completed: false,
        createdAt: new Date().toISOString() //Guarda la fecha y hora de creación de la tarea en formato ISO
    };
}

// Agregar tarea
function addTask() {
    const text = taskInput.value.trim(); //Se obtiene el valor del input y se eliminan los espacios al inicio y al final.
    
    if (text === '') {
        taskInput.focus();
        return;
    }

    const newTask = createTask(text); //Se crea una nueva tarea con el texto obtenido.
    tasks.push(newTask); //Se agrega la nueva tarea al array de tareas.
    taskInput.value = ''; //Se limpia el input.
    taskInput.focus(); //Se enfoca el input.
    
    saveTasks();
    renderTasks();
    updateStats();
}

// Eliminar tarea
function deleteTask(id) {
    // Busca la tarea que se va a eliminar para mostrar su texto en la confirmación
    const taskToDelete = tasks.find(task => task.id === id);
    
    // Si no se encuentra la tarea, no hace nada (previene errores)
    if (!taskToDelete) return;
    
    // Muestra un diálogo de confirmación antes de eliminar
    // Esto previene eliminaciones accidentales y mejora la experiencia del usuario
    const confirmMessage = `¿Estás seguro de que deseas eliminar la tarea "${taskToDelete.text}"?`;
    const userConfirmed = confirm(confirmMessage);
    
    // Solo procede con la eliminación si el usuario confirma
    if (userConfirmed) {
        // Filtra el array de tareas para excluir la tarea con el id especificado
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        updateStats();
    }
    // Si el usuario cancela, no hace nada y la tarea permanece intacta
}

// Toggle completar tarea
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Editar tarea
function editTask(id, newText) {
    const task = tasks.find(t => t.id === id);
    if (task && newText.trim() !== '') {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

// Filtrar tareas
function getFilteredTasks() {
    // 1. Filtrar por estado
    let filtered = [];
    switch (currentFilter) {
        case 'active':
            filtered = tasks.filter(task => !task.completed);
            break;
        case 'completed':
            filtered = tasks.filter(task => task.completed);
            break;
        default:
            filtered = tasks;
            break;
    }

    // 2. Filtrar por texto de búsqueda (insensible a mayúsculas)
    const query = searchQuery.trim().toLowerCase();
    if (query !== '') {
        filtered = filtered.filter(task => task.text.toLowerCase().includes(query));
    }

    return filtered;
}

// Renderizar tareas
function renderTasks() {
    const filteredTasks = getFilteredTasks(); //Se obtienen las tareas filtradas segun el filtro seleccionado. xq la funcion getFilteredTasks() retorna el array de tareas filtradas segun el filtro seleccionado
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<li class="empty-state">No hay tareas para mostrar</li>';
        return;
    }

    //usamos el metodo map para recorrer el array de tareas filtradas y crear el HTML de cada tarea.
    //y devolvemos un array de HTML de las tareas filtradas.
    taskList.innerHTML = filteredTasks.map(task => {
        const taskClass = task.completed ? 'task-item completed' : 'task-item';
        return `
            <li class="${taskClass}" data-id="${task.id}">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="toggleTask(${task.id})"
                >
                <span class="task-text" id="text-${task.id}">${escapeHtml(task.text)}</span>
                <div class="task-actions">
                    <button class="edit-btn" onclick="startEdit(${task.id})">Editar</button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Eliminar</button>
                </div>
            </li>
        `;
    }).join('');//se une el array de HTML de las tareas filtradas en un solo string.
}

// Iniciar edición de tarea
function startEdit(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const textElement = document.getElementById(`text-${id}`);//Se obtiene el elemento HTML con el id text-${id}.
    const currentText = task.text;//Se obtiene el texto de la tarea.
    

    // Convierte el texto en un input editable. y se asigna al elemento HTML con el id text-${id}.
    textElement.innerHTML = `
        <input 
            type="text" 
            class="task-input-edit" 
            value="${escapeHtml(currentText)}"
            id="edit-input-${id}"
            onblur="finishEdit(${id})"
            onkeypress="handleEditKeypress(event, ${id})"
        >
    `;
    
    const editInput = document.getElementById(`edit-input-${id}`);
    editInput.focus(); //Se enfoca el input de edición.
    editInput.select(); //Se selecciona el texto del input de edición.
}

// Finalizar edición
function finishEdit(id) {
    const editInput = document.getElementById(`edit-input-${id}`);
    if (editInput) {
        const newText = editInput.value;
        editTask(id, newText);
    }
}

// Manejar Enter en edición
function handleEditKeypress(event, id) {
    if (event.key === 'Enter') {
        finishEdit(id);
    }
}

// Actualizar estadísticas
function updateStats() {
    // OPTIMIZACIÓN: Calculamos todos los conteos una sola vez al inicio en lugar de filtrar el array múltiples veces según el filtro activo,
    // calculamos todos los valores necesarios en una sola pasada.Esto mejora el rendimiento especialmente cuando hay muchas tareas.
    
    // Calcula el número de tareas pendientes (no completadas)
    const activeTasks = tasks.filter(task => !task.completed).length;
    
    // Calcula el número de tareas completadas
    const completedTasks = tasks.filter(task => task.completed).length;
    
    // Calcula el total de tareas (suma de pendientes + completadas)
    const totalTasks = tasks.length;
    
    let count = 0;
    let message = '';
    
    // Selecciona el conteo y mensaje según el filtro activo
    // Ahora accedo a variables ya calculadas, sin filtrar nuevamente
    switch (currentFilter) {
        case 'active':
            // Usa el conteo de tareas pendientes ya calculado
            count = activeTasks;
            message = `${count} ${count === 1 ? 'tarea pendiente' : 'tareas pendientes'}`;
            break;
        case 'completed':
            count = completedTasks;
            message = `${count} ${count === 1 ? 'tarea completada' : 'tareas completadas'}`;
            break;
        default: // 'all'
            count = totalTasks;
            message = `${count} ${count === 1 ? 'tarea total' : 'tareas totales'}`;
            break;
    }
    
    // Actualiza el texto del contador en el DOM
    taskCount.textContent = message;
}

// Aplicar tema
function applyTheme(theme) {
    currentTheme = theme;
    if (theme === 'dark') {
        body.classList.add('dark');
        if (themeToggle) {
            themeToggle.textContent = '☀️';
            themeToggle.title = 'Modo claro';
        }
    } else {
        body.classList.remove('dark');
        if (themeToggle) {
            themeToggle.textContent = '🌙';
            themeToggle.title = 'Modo oscuro';
        }
    }
    localStorage.setItem('theme', theme);
}

// Limpiar tareas completadas
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
    updateStats();
}

// Cambiar filtro
function setFilter(filter) {
    currentFilter = filter;
    
    // Actualizar botones de filtro
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderTasks();
    updateStats();
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event Listeners
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

clearCompletedBtn.addEventListener('click', clearCompleted);

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
    });
});

// Búsqueda en tiempo real
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderTasks();
        updateStats();
    });
}

// Mostrar/ocultar buscador
if (searchToggle && searchInput) {
    searchToggle.addEventListener('click', () => {
        searchVisible = !searchVisible;
        if (searchVisible) {
            searchInput.classList.remove('hidden');
            searchInput.focus();
        } else {
            searchInput.classList.add('hidden');
            searchQuery = '';
            searchInput.value = '';
            renderTasks();
            updateStats();
        }
    });
}

// Toggle de tema
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });
}

// Inicializar aplicación
loadTasks();
updateStats();
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

