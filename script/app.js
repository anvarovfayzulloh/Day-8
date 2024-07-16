const $form = document.querySelector("#form");
const $input = $form.querySelector("input");
const $roomSelect = $form.querySelector("#roomSelect");
const $result = document.querySelector("#result");

let CLIENTS = JSON.parse(localStorage.getItem("guests")) || [];
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
            option.disabled = CLIENTS.some(client => client.room === roomNumber) && roomNumber !== excludeRoom;
        }
    });
}

const createNewClient = (e) => {
    e.preventDefault();
    const guestName = $input.value.trim();
    const roomNumber = parseInt($roomSelect.value);

    if (guestName && roomNumber) {
        CLIENTS.push({ name: guestName, room: roomNumber });
        renderClients(CLIENTS);
        localStorage.setItem("guests", JSON.stringify(CLIENTS));
        $input.value = "";
        $roomSelect.value = "";
        updateRoomOptions();
    }
}

const renderClients = (clients) => {
    while ($result.firstChild) {
        $result.removeChild($result.firstChild);
    }

    clients.forEach((client, index) => {
        const p = document.createElement("p");
        p.innerHTML = `
            <span>${client.name} (Room ${client.room})</span>
            <div>
                <button data-client-id="${index}" class="delete">Delete</button>
                <button data-client-id="${index}" class="edit">Edit</button>
            </div>
        `;
        $result.appendChild(p);
    });
}

const handleClientAction = (e) => {
    const id = +e.target.getAttribute("data-client-id");

    if (e.target.classList.contains("delete")) {
        CLIENTS = CLIENTS.filter((client, index) => index !== id);
        localStorage.setItem("guests", JSON.stringify(CLIENTS));
    } else if (e.target.classList.contains("edit")) {
        const currentGuest = CLIENTS[id];
        const newName = prompt("Enter a new name:", currentGuest.name);

        if (newName) {
            const newRoom = prompt(`Enter a new room number (available rooms: ${getAvailableRooms(currentGuest.room)}):`, currentGuest.room);
            const newRoomNumber = parseInt(newRoom);

            if (newRoomNumber && (newRoomNumber === currentGuest.room || !isRoomBooked(newRoomNumber))) {
                CLIENTS[id] = { name: newName, room: newRoomNumber };
                localStorage.setItem("guests", JSON.stringify(CLIENTS));
            } else {
                alert("The selected room is not available.");
            }
        }
    }

    renderClients(CLIENTS);
    updateRoomOptions();
}

const isRoomBooked = (room) => {
    return CLIENTS.some(client => client.room === room);
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
renderClients(CLIENTS);

$form.addEventListener("submit", createNewClient);
$result.addEventListener("click", handleClientAction);
