const inputField = document.querySelector('input[type="text"]');
const addButton = document.querySelector('button');
const taskList = document.querySelector('ul');
const sortSelector = document.querySelector('#sortTasks');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const uzbekMonths = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
];

const formatDateToUzbek = (timestamp) => {
  const date = new Date(timestamp);
  return `${String(date.getDate()).padStart(2, '0')}-${uzbekMonths[date.getMonth()]}-${date.getFullYear()} | ${date.toTimeString().slice(0, 5)}`;
};

const renderTasks = () => {
  taskList.innerHTML = '';
  tasks.forEach((task) => {
    const taskItem = document.createElement('li');
    taskItem.className = 'grid place-items-center grid-cols-12 gap-2 w-[100%] p-2';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'col-span-1 w-[20px] h-[20px]';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const taskText = document.createElement('p');
    taskText.className = 'col-span-8 cursor-pointer';
    taskText.textContent = `${task.text} (${formatDateToUzbek(task.id)})`;
    if (task.completed) taskText.style.textDecoration = 'line-through';
    taskText.addEventListener('click', () => {
      Swal.fire({
        title: 'Vazifa maʼlumoti',
        text: `Vazifa "${task.text}" quyidagi kunda yaratilgan:\n${formatDateToUzbek(task.id)}`,
        icon: 'info',
        confirmButtonText: 'Yopish',
      });
    });

    const editButton = document.createElement('button');
    editButton.className = 'col-span-1';
    editButton.innerHTML = '<i class="bi bi-pencil-square text-yellow-500 text-2xl"></i>';
    editButton.addEventListener('click', () => editTask(task.id));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'col-span-1';
    deleteButton.innerHTML = '<i class="bi bi-trash3 text-red-900 text-2xl"></i>';
    deleteButton.addEventListener('click', () => confirmDeleteTask(task.id));

    taskItem.append(checkbox, taskText, editButton, deleteButton);
    taskList.appendChild(taskItem);
  });
};

const addTask = async () => {
  const taskText = inputField.value.trim();
  if (!taskText) return Swal.fire('Xato', 'Vazifa bo‘sh bo‘lishi mumkin emas!', 'error');

  const taskId = Date.now();
  tasks.push({ id: taskId, text: taskText, completed: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  await Swal.fire({ position: 'top-end', icon: 'success', title: 'Vazifa qo\'shildi😁', timer: 1500, showConfirmButton: false });
  inputField.value = '';
  renderTasks();
};

const toggleTask = (id) => {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.completed = !task.completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }
};

const editTask = (id) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      Swal.fire({
        title: 'Vazifani tahrirlash',
        input: 'text',
        inputLabel: 'Yangi vazifa matnini kiriting',
        inputValue: task.text,
        showCancelButton: true,
        confirmButtonText: 'Saqlash',
        cancelButtonText: 'Bekor qilish',
        inputValidator: (value) => {
          if (!value.trim()) {
            return 'Matn bo‘sh bo‘lishi mumkin emas!';
          }
        },
      }).then((result) => {
        if (result.isConfirmed && result.value.trim()) {
          task.text = result.value.trim();
          localStorage.setItem('tasks', JSON.stringify(tasks));
          Swal.fire({
            icon: 'success',
            title: 'Vazifa tahrirlandi',
            timer: 1500,
            showConfirmButton: false,
          });
          renderTasks();
        }
      });
    }
  };
  

const confirmDeleteTask = (id) => {
  Swal.fire({
    title: 'Ishonchingiz komilmi?',
    text: 'Ushbu vazifani o\'chirmoqchimisiz?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ha, o‘chirilsin!',
    cancelButtonText: 'Yo‘q, qoldiring',
  }).then((result) => {
    if (result.isConfirmed) {
      deleteTask(id);
      Swal.fire('O‘chirildi!', 'Vazifa muvaffaqiyatli o‘chirildi.', 'success');
    }
  });
};

const deleteTask = (id) => {
  tasks = tasks.filter((task) => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
};

const sortTasks = (order) => {
  tasks.sort((a, b) => (order === 'asc' ? a.id - b.id : b.id - a.id));
  renderTasks();
};

const deleteCompletedButton = document.querySelector('#deleteCompletedButton');

const deleteAllCompletedTasks = () => {
  Swal.fire({
    title: 'Ishonchingiz komilmi?',
    text: 'Barcha bajarilgan vazifalarni o\'chirmoqchimisiz?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ha, o‘chirilsin!',
    cancelButtonText: 'Yo‘q, qoldiring',
  }).then((result) => {
    if (result.isConfirmed) {
      tasks = tasks.filter((task) => !task.completed);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
      Swal.fire('O‘chirildi!', 'Barcha bajarilgan vazifalar muvaffaqiyatli o‘chirildi.', 'success');
    }
  });
};

deleteCompletedButton.addEventListener('click', deleteAllCompletedTasks);



addButton.addEventListener('click', addTask);
sortSelector.addEventListener('change', (event) => sortTasks(event.target.value));
renderTasks();
