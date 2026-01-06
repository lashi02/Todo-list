# FLUJOS COMPLETOS DE LA APLICACIÓN TODO LIST

## 1. INICIALIZACIÓN DE LA APLICACIÓN

```
Al cargar la página (script.js se ejecuta)
         ↓
1. Se definen variables de estado:
   - tasks = []
   - currentFilter = 'all'
         ↓
2. Se obtienen referencias del DOM:
   - taskInput, addBtn, taskList, etc.
         ↓
3. Se configuran Event Listeners:
   - addBtn.addEventListener('click', addTask)
   - taskInput.addEventListener('keypress', ...)
   - clearCompletedBtn.addEventListener('click', ...)
   - filterButtons.forEach(...)
         ↓
4. loadTasks() se ejecuta
         ↓
5. updateStats() se ejecuta
         ↓
    ¡Aplicación lista! ✅
```

┌─────────────────────────────────────────────────────────┐
│  INICIALIZACIÓN                                          │
│  1. Variables de estado                                 │
│  2. Referencias del DOM                                 │
│  3. Event Listeners configurados                        │
│  4. loadTasks() → Carga tareas guardadas                 │
│  5. updateStats() → Actualiza contador                  │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  APLICACIÓN LISTA PARA USAR                              │
└─────────────────────────────────────────────────────────┘

---

## 2. AGREGAR TAREA

### Opción A: Clic en botón "Agregar"

```
Usuario escribe "Comprar leche" y hace clic en "Agregar"
         ↓
    Event Listener detecta 'click' en addBtn
         ↓
    addTask() se ejecuta
         ↓
1. Obtiene texto: taskInput.value.trim()
   "Comprar leche"
         ↓
2. Valida: ¿Está vacío? NO → Continúa
         ↓
3. Crea tarea: createTask("Comprar leche")
   {
     id: 1704123456789,
     text: "Comprar leche",
     completed: false,
     createdAt: "2024-01-01T12:30:45.123Z"
   }
         ↓
4. Agrega al array: tasks.push(newTask)
   tasks = [{ id: 1704123456789, text: "Comprar leche", ... }]
         ↓
5. Limpia input: taskInput.value = ''
         ↓
6. Enfoca input: taskInput.focus()
         ↓
7. Guarda: saveTasks()
   localStorage.setItem('tasks', JSON.stringify(tasks))
         ↓
8. Renderiza: renderTasks()
   - getFilteredTasks() → Obtiene tareas filtradas
   - map() → Convierte a HTML
   - taskList.innerHTML = HTML
         ↓
9. Actualiza stats: updateStats()
   - Calcula conteos optimizados (pendientes, completadas, totales)
   - Actualiza contador según filtro activo
   - Muestra mensaje apropiado (totales/pendientes/completadas)
         ↓
    ¡Tarea agregada! ✅
```

### Opción B: Presionar Enter

```
Usuario escribe "Comprar leche" y presiona Enter
         ↓
    Event Listener detecta 'keypress' en taskInput
         ↓
    Verifica: ¿Es Enter? SÍ
         ↓
    addTask() se ejecuta
         ↓
    (Mismo flujo que Opción A)
```

┌─────────────────────────────────────────────────────────┐
│  ESTADO INICIAL                                          │
│  tasks = []                                              │
│  <input id="taskInput" value="">                        │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ Usuario escribe y hace clic/presiona Enter
                   ▼
┌─────────────────────────────────────────────────────────┐
│  addTask()                                               │
│  1. Obtiene texto del input                              │
│  2. Valida que no esté vacío                             │
│  3. createTask() → Crea objeto tarea                    │
│  4. tasks.push() → Agrega al array                       │
│  5. Limpia y enfoca input                                 │
│  6. saveTasks() → Guarda en localStorage                 │
│  7. renderTasks() → Muestra en pantalla                   │
│  8. updateStats() → Actualiza contador                    │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  ESTADO FINAL                                            │
│  tasks = [{ id: 123, text: "Comprar leche", ... }]     │
│  <li>Comprar leche</li> visible en pantalla              │
│  "1 tarea pendiente" en contador                         │
└─────────────────────────────────────────────────────────┘

---

## 3. ELIMINAR TAREA

```
Usuario hace clic en "Eliminar" de una tarea
         ↓
    onclick="deleteTask(200)" se ejecuta
         ↓
    deleteTask(200) se ejecuta
         ↓
1. Busca la tarea: tasks.find(task => task.id === 200)
   taskToDelete = { id: 200, text: "Tarea 2", ... }
         ↓
2. Verifica: ¿Existe la tarea? SÍ → Continúa
   Si no existe, retorna sin hacer nada (previene errores)
         ↓
3. Muestra confirmación: confirm("¿Estás seguro de que deseas eliminar la tarea 'Tarea 2'?")
   - Diálogo de confirmación del navegador
   - Usuario puede aceptar o cancelar
         ↓
4. Usuario hace clic en "Aceptar" O "Cancelar"
         ↓
   Opción A: Usuario hace clic en "Aceptar" (confirmado)
         ↓
   5. Filtra array: tasks.filter(task => task.id !== 200)
      - Evalúa cada tarea
      - Tarea con id: 200 → Se excluye ❌
      - Otras tareas → Se mantienen ✅
         ↓
   6. Reasigna: tasks = nuevoArray
      tasks = [
        { id: 100, text: "Tarea 1", ... },
        { id: 300, text: "Tarea 3", ... }
      ]
         ↓
   7. Guarda: saveTasks()
      localStorage.setItem('tasks', JSON.stringify(tasks))
         ↓
   8. Renderiza: renderTasks()
      - getFilteredTasks() → Obtiene tareas filtradas
      - map() → Convierte a HTML
      - taskList.innerHTML = HTML (sin la tarea eliminada)
         ↓
   9. Actualiza stats: updateStats()
      - Calcula conteos optimizados
      - Actualiza contador según filtro activo
         ↓
      ¡Tarea eliminada! ✅
   
   Opción B: Usuario hace clic en "Cancelar" (no confirmado)
         ↓
   5. No hace nada, la tarea permanece intacta
      La función retorna sin modificar el array
         ↓
      ¡Eliminación cancelada! ❌
```

┌─────────────────────────────────────────────────────────┐
│  ESTADO INICIAL                                          │
│  tasks = [                                               │
│    { id: 100, text: "Tarea 1", completed: false },      │
│    { id: 200, text: "Tarea 2", completed: false },      │
│    { id: 300, text: "Tarea 3", completed: false }        │
│  ]                                                        │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ Usuario hace clic en "Eliminar" de Tarea 2
                   ▼
┌─────────────────────────────────────────────────────────┐
│  deleteTask(200)                                         │
│  1. find() → Busca tarea con id: 200                     │
│  2. Verifica existencia                                 │
│  3. confirm() → Muestra diálogo de confirmación          │
│     "¿Estás seguro de eliminar 'Tarea 2'?"              │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ Usuario decide:
                   ├─────────────────┬─────────────────────┐
                   │                 │                     │
                   ▼                 ▼                     ▼
         ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
         │  ACEPTAR      │  │  CANCELAR     │  │  (no existe) │
         └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
                │                 │                 │
                ▼                 ▼                 ▼
    ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
    │ filter() →        │  │ Retorna sin  │  │ Retorna sin  │
    │ Elimina tarea     │  │ modificar    │  │ modificar    │
    │ saveTasks()       │  │              │  │              │
    │ renderTasks()     │  │              │  │              │
    │ updateStats()     │  │              │  │              │
    └────────┬──────────┘  └──────────────┘  └──────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│  ESTADO FINAL (si se confirmó)                          │
│  tasks = [                                               │
│    { id: 100, text: "Tarea 1", completed: false },      │
│    { id: 300, text: "Tarea 3", completed: false }       │
│  ]                                                        │
│  Solo 2 tareas visibles en pantalla                      │
└─────────────────────────────────────────────────────────┘

---

## 4. COMPLETAR/MARCAR TAREA

```
Usuario hace clic en el checkbox de una tarea
         ↓
    onchange="toggleTask(200)" se ejecuta
         ↓
    toggleTask(200) se ejecuta
         ↓
1. Busca tarea: tasks.find(t => t.id === 200)
   task = { id: 200, text: "Hacer ejercicio", completed: false }
         ↓
2. Verifica: ¿Existe? SÍ → Continúa
         ↓
3. Invierte estado: task.completed = !task.completed
   false → !false → true
   task.completed = true
         ↓
4. Guarda: saveTasks()
   localStorage.setItem('tasks', JSON.stringify(tasks))
         ↓
5. Renderiza: renderTasks()
   - getFilteredTasks() → Obtiene tareas filtradas
   - map() → Convierte a HTML
   - taskList.innerHTML = HTML
   - Tarea ahora tiene class="task-item completed"
         ↓
6. Actualiza stats: updateStats()
   - Calcula conteos optimizados (pendientes, completadas, totales) en una sola pasada
   - Actualiza contador según filtro activo
   - Muestra mensaje apropiado según el filtro seleccionado
         ↓
    ¡Tarea completada! ✅
```

┌─────────────────────────────────────────────────────────┐
│  ESTADO INICIAL                                          │
│  { id: 200, text: "Hacer ejercicio", completed: false }  │
│  <input type="checkbox"> (sin checked)                  │
│  <span>Hacer ejercicio</span> (sin tachar)              │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ Usuario hace clic en checkbox
                   ▼
┌─────────────────────────────────────────────────────────┐
│  toggleTask(200)                                         │
│  1. find() → Busca tarea con id: 200                     │
│  2. Invierte: completed = !completed                    │
│  3. saveTasks() → Guarda en localStorage                 │
│  4. renderTasks() → Muestra con estilo "completed"      │
│  5. updateStats() → Actualiza contador (optimizado)      │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  ESTADO FINAL                                            │
│  { id: 200, text: "Hacer ejercicio", completed: true }   │
│  <input type="checkbox" checked>                         │
│  <span class="completed">Hacer ejercicio</span> (tachado)│
└─────────────────────────────────────────────────────────┘

---

## 5. EDITAR TAREA

```
Usuario hace clic en "Editar"
         ↓
    onclick="startEdit(200)" se ejecuta
         ↓
    startEdit(200) se ejecuta
         ↓
1. Busca tarea: tasks.find(t => t.id === 200)
   task = { id: 200, text: "Hacer ejercicio", ... }
         ↓
2. Verifica: ¿Existe? SÍ → Continúa
         ↓
3. Obtiene elemento: document.getElementById('text-200')
   <span id="text-200">Hacer ejercicio</span>
         ↓
4. Obtiene texto: task.text
   "Hacer ejercicio"
         ↓
5. Reemplaza span por input:
   textElement.innerHTML = `<input value="Hacer ejercicio" ...>`
   ANTES: <span id="text-200">Hacer ejercicio</span>
   DESPUÉS: <input id="edit-input-200" value="Hacer ejercicio">
         ↓
6. Enfoca y selecciona: editInput.focus() y editInput.select()
         ↓
Usuario escribe: "Hacer ejercicio 30 min"
         ↓
Usuario presiona Enter O hace clic fuera
         ↓
    Opción A: Enter → handleEditKeypress() → finishEdit(200)
    Opción B: Clic fuera → onblur → finishEdit(200)
         ↓
    finishEdit(200) se ejecuta
         ↓
1. Obtiene input: document.getElementById('edit-input-200')
         ↓
2. Verifica: ¿Existe? SÍ
         ↓
3. Obtiene texto: editInput.value
   "Hacer ejercicio 30 min"
         ↓
4. Llama: editTask(200, "Hacer ejercicio 30 min")
         ↓
    editTask(200, "Hacer ejercicio 30 min") se ejecuta
         ↓
1. Busca tarea: tasks.find(t => t.id === 200)
         ↓
2. Valida: ¿Existe Y texto no vacío? SÍ
         ↓
3. Actualiza: task.text = "Hacer ejercicio 30 min"
   { id: 200, text: "Hacer ejercicio 30 min", ... }
         ↓
4. Guarda: saveTasks()
   localStorage.setItem('tasks', JSON.stringify(tasks))
         ↓
5. Renderiza: renderTasks()
   - getFilteredTasks() → Obtiene tareas filtradas
   - map() → Convierte a HTML
   - taskList.innerHTML = HTML
   - Vuelve a mostrar <span> con texto actualizado
         ↓
    ¡Edición completada! ✅
```

┌─────────────────────────────────────────────────────────┐
│  ESTADO INICIAL                                          │
│  { id: 200, text: "Hacer ejercicio", completed: false }  │
│  <span id="text-200">Hacer ejercicio</span>            │
│  <button onclick="startEdit(200)">Editar</button>      │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ Usuario hace clic en "Editar"
                   ▼
┌─────────────────────────────────────────────────────────┐
│  startEdit(200)                                          │
│  1. find() → Busca tarea con id: 200                     │
│  2. getElementById('text-200') → Obtiene span            │
│  3. innerHTML → Reemplaza span por input                 │
│  4. focus() y select() → Enfoca y selecciona             │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ HTML cambia a:
                   ▼
┌─────────────────────────────────────────────────────────┐
│  <input id="edit-input-200" value="Hacer ejercicio">    │
│  (Usuario puede editar)                                  │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ Usuario escribe: "Hacer ejercicio 30 min"
                   │ Y presiona Enter O hace clic fuera
                   ▼
┌─────────────────────────────────────────────────────────┐
│  finishEdit(200)                                         │
│  1. getElementById('edit-input-200') → Obtiene input     │
│  2. editInput.value → Lee texto                          │
│  3. editTask(200, "Hacer ejercicio 30 min")               │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  editTask(200, "Hacer ejercicio 30 min")                 │
│  1. find() → Busca tarea                                 │
│  2. task.text = nuevoTexto → Actualiza objeto             │
│  3. saveTasks() → Guarda en localStorage                 │
│  4. renderTasks() → Vuelve a mostrar span                │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  ESTADO FINAL                                            │
│  { id: 200, text: "Hacer ejercicio 30 min", ... }        │
│  <span id="text-200">Hacer ejercicio 30 min</span>     │
│  (Texto actualizado y guardado)                          │
└─────────────────────────────────────────────────────────┘

---

## 6. FILTRAR TAREAS

```
Usuario hace clic en "Pendientes"
         ↓
    Event Listener detecta 'click' en botón de filtro
         ↓
    setFilter('active') se ejecuta
         ↓
1. Actualiza filtro: currentFilter = 'active'
         ↓
2. Recorre botones: filterButtons.forEach(btn => ...)
   - Botón "Todas": quita 'active'
   - Botón "Pendientes": agrega 'active' ✅
   - Botón "Completadas": quita 'active'
         ↓
3. Renderiza: renderTasks()
         ↓
    renderTasks() se ejecuta
         ↓
1. Obtiene tareas filtradas: getFilteredTasks()
         ↓
    getFilteredTasks() se ejecuta
         ↓
1. Evalúa: switch (currentFilter)
   currentFilter = 'active'
         ↓
2. Ejecuta: case 'active'
   return tasks.filter(task => !task.completed)
   - Filtra solo tareas NO completadas
         ↓
3. Retorna: array de tareas pendientes
         ↓
    renderTasks() continúa
         ↓
1. Verifica: ¿Hay tareas? SÍ
         ↓
2. Convierte a HTML: filteredTasks.map(task => ...)
   - Cada tarea → <li>...</li>
         ↓
3. Une HTML: .join('')
         ↓
4. Muestra: taskList.innerHTML = HTML
   - Solo muestra tareas pendientes
         ↓
    ¡Filtro aplicado! ✅
```

┌─────────────────────────────────────────────────────────┐
│  ESTADO INICIAL                                          │
│  currentFilter = 'all'                                   │
│  tasks = [                                               │
│    { id: 100, text: "Tarea 1", completed: false },      │
│    { id: 200, text: "Tarea 2", completed: true },       │
│    { id: 300, text: "Tarea 3", completed: false }        │
│  ]                                                        │
│  Muestra: 3 tareas (todas)                               │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ Usuario hace clic en "Pendientes"
                   ▼
┌─────────────────────────────────────────────────────────┐
│  setFilter('active')                                    │
│  1. currentFilter = 'active'                             │
│  2. Actualiza clases de botones (marca "Pendientes")    │
│  3. renderTasks()                                        │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  renderTasks() → getFilteredTasks()                     │
│  1. switch ('active')                                    │
│  2. filter(task => !task.completed)                      │
│  3. Retorna solo tareas pendientes                      │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  ESTADO FINAL                                            │
│  currentFilter = 'active'                                │
│  Muestra solo:                                            │
│    - Tarea 1 (pendiente)                                  │
│    - Tarea 3 (pendiente)                                  │
│  Tarea 2 (completada) está oculta                        │
└─────────────────────────────────────────────────────────┘

---

## 7. LIMPIAR TAREAS COMPLETADAS

```
Usuario hace clic en "Limpiar completadas"
         ↓
    Event Listener detecta 'click' en clearCompletedBtn
         ↓
    clearCompleted() se ejecuta
         ↓
1. Filtra array: tasks.filter(task => !task.completed)
   - Evalúa cada tarea
   - completed: true → Se excluye ❌
   - completed: false → Se mantiene ✅
         ↓
2. Reasigna: tasks = nuevoArray
   tasks = [
     { id: 100, text: "Tarea 1", completed: false },
     { id: 300, text: "Tarea 3", completed: false }
   ]
         ↓
3. Guarda: saveTasks()
   localStorage.setItem('tasks', JSON.stringify(tasks))
         ↓
4. Renderiza: renderTasks()
   - getFilteredTasks() → Obtiene tareas filtradas
   - map() → Convierte a HTML
   - taskList.innerHTML = HTML (sin completadas)
         ↓
5. Actualiza stats: updateStats()
   - Calcula conteos optimizados (pendientes, completadas, totales)
   - Actualiza contador según filtro activo
         ↓
    ¡Tareas completadas eliminadas! ✅
```

┌─────────────────────────────────────────────────────────┐
│  ESTADO INICIAL                                          │
│  tasks = [                                               │
│    { id: 100, text: "Tarea 1", completed: false },      │
│    { id: 200, text: "Tarea 2", completed: true },       │
│    { id: 300, text: "Tarea 3", completed: false },      │
│    { id: 400, text: "Tarea 4", completed: true }        │
│  ]                                                        │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ Usuario hace clic en "Limpiar completadas"
                   ▼
┌─────────────────────────────────────────────────────────┐
│  clearCompleted()                                        │
│  1. filter(task => !task.completed)                     │
│     - Tarea 1: !false → true → ✅ MANTIENE              │
│     - Tarea 2: !true → false → ❌ ELIMINA               │
│     - Tarea 3: !false → true → ✅ MANTIENE              │
│     - Tarea 4: !true → false → ❌ ELIMINA               │
│  2. tasks = nuevoArray                                   │
│  3. saveTasks() → Guarda en localStorage                 │
│  4. renderTasks() → Muestra lista actualizada            │
│  5. updateStats() → Actualiza contador                   │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  ESTADO FINAL                                            │
│  tasks = [                                               │
│    { id: 100, text: "Tarea 1", completed: false },      │
│    { id: 300, text: "Tarea 3", completed: false }      │
│  ]                                                        │
│  Solo 2 tareas visibles (pendientes)                    │
└─────────────────────────────────────────────────────────┘

---

## 8. CARGAR TAREAS AL INICIAR

```
Al cargar la página
         ↓
    loadTasks() se ejecuta (línea 243)
         ↓
1. Intenta ejecutar el bloque try:
         ↓
2. Lee localStorage: localStorage.getItem('tasks')
   - Si hay datos: retorna string JSON
   - Si no hay: retorna null
         ↓
3. Verifica: ¿Existe savedTasks? SÍ
         ↓
4. Intenta convertir: JSON.parse(savedTasks)
   - Convierte string JSON → array de objetos
   - Ejemplo: '[{"id":100,...}]' → [{id:100,...}]
   - Puede lanzar error si el formato es inválido (datos corruptos)
         ↓
5. Valida: ¿Es un array? Array.isArray(parsedTasks)
   - Si SÍ: tasks = parsedTasks → Continúa
   - Si NO: Inicializa tasks = [] y limpia localStorage
         ↓
6. Renderiza: renderTasks()
   - getFilteredTasks() → Obtiene tareas filtradas
   - map() → Convierte a HTML
   - taskList.innerHTML = HTML
   - Muestra tareas guardadas en pantalla
         ↓
    ¡Tareas cargadas! ✅

   Si ocurre un error en cualquier paso (catch):
         ↓
7. Captura el error: catch(error)
   - Registra el error en consola para debugging
   - Inicializa tasks = [] (array vacío)
   - Limpia localStorage.removeItem('tasks')
   - Previene que la aplicación se rompa
         ↓
    ¡Aplicación iniciada con lista vacía! ✅
    (Los datos corruptos fueron limpiados)
```

┌─────────────────────────────────────────────────────────┐
│  ESTADO INICIAL                                          │
│  tasks = [] (vacío)                                      │
│  localStorage: 'tasks' = '[{"id":100,...},{"id":200,...}]'│
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ loadTasks() se ejecuta
                   ▼
┌─────────────────────────────────────────────────────────┐
│  loadTasks()                                             │
│  1. localStorage.getItem('tasks') → Lee string JSON     │
│  2. JSON.parse() → Convierte a array                     │
│  3. tasks = arrayParseado                                │
│  4. renderTasks() → Muestra en pantalla                  │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  ESTADO FINAL (caso exitoso)                             │
│  tasks = [                                               │
│    { id: 100, text: "Tarea 1", ... },                   │
│    { id: 200, text: "Tarea 2", ... }                     │
│  ]                                                        │
│  Tareas visibles en pantalla                             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  ESTADO FINAL (caso con error)                           │
│  tasks = [] (vacío, pero app funciona)                  │
│  localStorage: 'tasks' eliminado (datos corruptos)       │
│  Aplicación lista para usar sin errores                  │
└─────────────────────────────────────────────────────────┘

---

## RESUMEN DE FUNCIONES Y EVENTOS

### Funciones principales:
1. **loadTasks()** - Carga tareas del localStorage con manejo de errores (try-catch)
   - Valida que los datos sean un array válido
   - Limpia datos corruptos automáticamente
   - Previene que la app se rompa por errores de parsing
2. **saveTasks()** - Guarda tareas en localStorage
3. **createTask(text)** - Crea objeto tarea
4. **addTask()** - Agrega nueva tarea
5. **deleteTask(id)** - Elimina una tarea con confirmación previa
   - Muestra diálogo de confirmación antes de eliminar
   - Previene eliminaciones accidentales
   - Solo elimina si el usuario confirma
6. **toggleTask(id)** - Marca/desmarca como completada
7. **editTask(id, newText)** - Actualiza texto de tarea
8. **startEdit(id)** - Inicia modo edición
9. **finishEdit(id)** - Finaliza edición
10. **handleEditKeypress(event, id)** - Maneja Enter en edición
11. **getFilteredTasks()** - Filtra tareas según currentFilter y texto de búsqueda (insensible a mayúsculas)
12. **renderTasks()** - Muestra tareas en pantalla
13. **updateStats()** - Actualiza contador según filtro activo (OPTIMIZADA)
    - Calcula todos los conteos una sola vez al inicio
    - Mejora rendimiento al evitar múltiples filtrados
    - Muestra mensaje según filtro: totales/pendientes/completadas
14. **clearCompleted()** - Elimina todas las completadas
15. **setFilter(filter)** - Cambia filtro activo
16. **escapeHtml(text)** - Previene ataques XSS
17. **applyTheme(theme)** - Aplica tema claro/oscuro y persiste en localStorage
18. **Búsqueda de tareas** - Filtra por texto cuando el buscador está visible

### Event Listeners:
1. **addBtn** → 'click' → addTask()
2. **taskInput** → 'keypress' (Enter) → addTask()
3. **clearCompletedBtn** → 'click' → clearCompleted()
4. **filterButtons** → 'click' → setFilter(btn.dataset.filter)

### Eventos inline (en HTML generado):
1. **checkbox** → onchange → toggleTask(id)
2. **botón Editar** → onclick → startEdit(id)
3. **botón Eliminar** → onclick → deleteTask(id)
4. **input edición** → onblur → finishEdit(id)
5. **input edición** → onkeypress → handleEditKeypress(event, id)

---

## FLUJO GENERAL DE LA APLICACIÓN

```
┌─────────────────────────────────────┐
│  Usuario interactúa                 │
│  (clic, tecla, etc.)                 │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Event Listener detecta acción       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Se ejecuta función correspondiente  │
│  (addTask, deleteTask, etc.)         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Se modifica estado (tasks array)   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  saveTasks() → Guarda en localStorage│
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  renderTasks() → Actualiza vista     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  updateStats() → Actualiza contador (optimizado) │
└─────────────────────────────────────┘
```

---

## ORDEN DE EJECUCIÓN TÍPICO

```
1. Modificar estado (tasks array)
2. saveTasks() → Persistencia
3. renderTasks() → Vista
4. updateStats() → Estadísticas (optimizado)
```

Este orden se repite en casi todas las funciones que modifican tareas.

---

## MEJORAS IMPLEMENTADAS

### 1. Manejo de Errores en loadTasks()

**Problema resuelto:** La función original no manejaba errores si el JSON en localStorage estaba corrupto o si había problemas al parsear los datos.

**Solución implementada:**
- Se agregó un bloque `try-catch` para capturar errores
- Validación de que los datos parseados sean un array válido
- Limpieza automática de datos corruptos del localStorage
- La aplicación continúa funcionando incluso si hay errores al cargar

**Beneficios:**
- Previene que la aplicación se rompa por datos corruptos
- Mejora la robustez y confiabilidad
- Facilita el debugging con mensajes de error en consola

### 2. Confirmación antes de Eliminar Tarea

**Problema resuelto:** Las eliminaciones eran inmediatas, lo que podía causar pérdida accidental de datos.

**Solución implementada:**
- Se agregó un diálogo de confirmación (`confirm()`) antes de eliminar
- El usuario debe confirmar explícitamente la eliminación
- Si el usuario cancela, la tarea permanece intacta
- Se muestra el texto de la tarea en el mensaje de confirmación

**Beneficios:**
- Previene eliminaciones accidentales
- Mejora la experiencia del usuario
- Proporciona una segunda oportunidad antes de acciones destructivas

### 3. Optimización de updateStats()

**Problema resuelto:** La función recalculaba los filtros múltiples veces según el filtro activo, lo que era ineficiente.

**Solución implementada:**
- Se calculan todos los conteos (pendientes, completadas, totales) una sola vez al inicio
- Se almacenan en variables para reutilización
- Se selecciona el conteo apropiado según el filtro activo sin recalcular
- Comentarios explicativos sobre la optimización

**Beneficios:**
- Mejora el rendimiento, especialmente con muchas tareas
- Reduce operaciones redundantes de filtrado
- Código más eficiente y mantenible
- Los comentarios facilitan la comprensión del propósito

### 4. Contador Dinámico según Filtro

**Mejora adicional:** El contador ahora muestra información relevante según el filtro activo:
- **Filtro "Todas":** Muestra número total de tareas
- **Filtro "Pendientes":** Muestra número de tareas pendientes
- **Filtro "Completadas":** Muestra número de tareas completadas

**Beneficios:**
- Información más contextual y útil para el usuario
- Mejor comprensión del estado actual de las tareas

### 5. Búsqueda de Tareas (filtro por texto)

**Qué hace:** Permite filtrar la lista escribiendo en el buscador. Coincide por texto parcial, sin importar mayúsculas/minúsculas.

**Cómo funciona:**
- Se captura el input del usuario en `searchInput`.
- `searchQuery` se aplica después del filtro de estado (todas/pendientes/completadas).
- El filtrado es en tiempo real y no distingue mayúsculas.

**Beneficios:**
- Permite encontrar tareas rápidamente sin cambiar de sección.
- Funciona junto con los filtros de estado.

### 6. Tema Oscuro con persistencia

**Qué hace:** Alterna entre tema claro y oscuro, guardando la preferencia en `localStorage`.

**Cómo funciona:**
- Botón `themeToggle` cambia el tema.
- `applyTheme(theme)` agrega/remueve la clase `dark` en `<body>`.
- La preferencia se guarda en `localStorage` y se aplica al iniciar.

**Beneficios:**
- Mejor experiencia en ambientes con poca luz.
- Persistencia de preferencia entre sesiones.