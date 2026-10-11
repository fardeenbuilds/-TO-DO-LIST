// Elements select karna
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const counter = document.getElementById("counter");
const empty = document.getElementById("empty");
const errorBox = document.getElementById("error");
const clearBtn = document.getElementById("clearDone");
const filterBtns = document.querySelectorAll(".filter");

// Saved tasks load karna (browser band karne par bhi bache rahenge)
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Naya task add karna
function addTask(text) {
    tasks.push({ id: Date.now(), text: text, done: false });
    save();
    render();
}

// Task delete karna
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
}

// Task complete / pending toggle karna
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    task.done = !task.done;
    save();
    render();
}

// Saare completed tasks hatana
function clearCompleted() {
    tasks = tasks.filter(t => !t.done);
    save();
    render();
}

// Screen par list dikhana
function render() {
    list.innerHTML = "";

    const visible = tasks.filter(t =>
        currentFilter === "all" ? true :
        currentFilter === "done" ? t.done : !t.done
    );

    visible.forEach(task => {
        const li = document.createElement("li");
        if (task.done) li.classList.add("done");

        const check = document.createElement("input");
        check.type = "checkbox";
        check.checked = task.done;
        check.setAttribute("aria-label", "Mark task as completed");
        check.addEventListener("change", () => toggleTask(task.id));

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text; // textContent = safe (XSS se bachata hai)
        span.addEventListener("click", () => toggleTask(task.id));

        const del = document.createElement("button");
        del.className = "btn-delete";
        del.textContent = "Delete";
        del.setAttribute("aria-label", "Delete task: " + task.text);
        del.addEventListener("click", () => deleteTask(task.id));

        li.append(check, span, del);
        list.appendChild(li);
    });

    // Counter
    const pending = tasks.filter(t => !t.done).length;
    counter.textContent = tasks.length === 0
        ? "No tasks yet"
        : pending + " pending, " + (tasks.length - pending) + " completed";

    // Empty message
    if (visible.length === 0) {
        empty.textContent =
            tasks.length === 0 ? "Nothing here yet. Add your first task above." :
            currentFilter === "done" ? "No completed tasks yet." : "All tasks are done.";
    } else {
        empty.textContent = "";
    }

    clearBtn.disabled = !tasks.some(t => t.done);
}

// Form submit (Add button ya Enter key dono se chalega)
form.addEventListener("submit", e => {
    e.preventDefault();
    const text = input.value.trim();

    if (text === "") {
        errorBox.textContent = "Please enter a task.";
        input.focus();
        return;
    }

    errorBox.textContent = "";
    addTask(text);
    input.value = "";
    input.focus();
});

input.addEventListener("input", () => (errorBox.textContent = ""));

// Filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.toggle("active", b === btn));
        render();
    });
});

clearBtn.addEventListener("click", clearCompleted);

render();
