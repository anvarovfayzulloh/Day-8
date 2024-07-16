const $form = document.querySelector("#form");
const $input = $form.querySelector("input");
const $roomSelect = $form.querySelector("#roomSelect");
const $result = document.querySelector("#result");

let ITEMS = JSON.parse(localStorage.getItem("guests")) || [];
const totalRooms = 15;

const createRoomOptions = () => {
    for (let i = 1; i <= totalRooms; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `Room ${i}`;
        $roomSelect.appendChild(option);
    }
}

const updateRoomOptions = (excludeRoom = null) => {
    $roomSelect.querySelectorAll('option').forEach(option => {
        if (option.value) {
            const roomNumber = parseInt(option.value);
            option.disabled = ITEMS.some(item => item.room === roomNumber) && roomNumber !== excludeRoom;
        }
    });
}

const createNewItem = (e) => {
    e.preventDefault();
    const guestName = $input.value.trim();
    const roomNumber = parseInt($roomSelect.value);

    if (guestName && roomNumber) {
        ITEMS.push({ name: guestName, room: roomNumber });
        renderItem(ITEMS);
        localStorage.setItem("guests", JSON.stringify(ITEMS));
        $input.value = "";
        $roomSelect.value = "";
        updateRoomOptions();
    }
}

const renderItem = (items) => {
    while ($result.firstChild) {
        $result.removeChild($result.firstChild);
    }

    items.forEach((item, index) => {
        const p = document.createElement("p");
        p.innerHTML = `
            <span>${item.name} (Room ${item.room})</span>
            <div>
                <button data-item-id="${index}" class="delete">Delete</button>
                <button data-item-id="${index}" class="edit">Edit</button>
            </div>
        `;
        $result.appendChild(p);
    });
}

const handleItemAction = (e) => {
    const id = +e.target.getAttribute("data-item-id");

    if (e.target.classList.contains("delete")) {
        ITEMS = ITEMS.filter((item, index) => index !== id);
        localStorage.setItem("guests", JSON.stringify(ITEMS));
    } else if (e.target.classList.contains("edit")) {
        const currentGuest = ITEMS[id];
        const newName = prompt("Enter a new name:", currentGuest.name);

        if (newName) {
            const newRoom = prompt(`Enter a new room number (available rooms: ${getAvailableRooms(currentGuest.room)}):`, currentGuest.room);
            const newRoomNumber = parseInt(newRoom);

            if (newRoomNumber && (newRoomNumber === currentGuest.room || !isRoomBooked(newRoomNumber))) {
                ITEMS[id] = { name: newName, room: newRoomNumber };
                localStorage.setItem("guests", JSON.stringify(ITEMS));
            } else {
                alert("The selected room is not available.");
            }
        }
    }

    renderItem(ITEMS);
    updateRoomOptions();
}

const isRoomBooked = (room) => {
    return ITEMS.some(item => item.room === room);
}

const getAvailableRooms = (excludeRoom) => {
    const availableRooms = [];
    for (let i = 1; i <= totalRooms; i++) {
        if (!isRoomBooked(i) || i === excludeRoom) {
            availableRooms.push(i);
        }
    }
    return availableRooms.join(", ");
}

createRoomOptions();
updateRoomOptions();
renderItem(ITEMS);


$form.addEventListener("submit", createNewItem);
$result.addEventListener("click", handleItemAction);


