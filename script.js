const parkingLot = document.getElementById('parking-lot');
const totalMoneyElement = document.getElementById('total-money');

const slots = [];
const totalSlots = 15;
const smallSlots = 10;
const largeSlots = 5;
let totalMoneyCollected = 0;

class Slot {
    constructor(id, type) {
        this.id = id;
        this.type = type;
        this.isBooked = false;
        this.startTime = null;
        this.endTime = null;
    }

    book() {
        if (!this.isBooked) {
            this.isBooked = true;
            this.startTime = new Date();
            renderParkingLot();
        } else {
            alert('Slot already booked!');
        }
    }

    release() {
        if (this.isBooked) {
            this.endTime = new Date();
            const parkingDuration = (this.endTime - this.startTime) / 1000; // seconds
            let charge = this.type === 'small' ? 60 : 100;
            if (parkingDuration > 3) {
                const extraHours = Math.ceil((parkingDuration - 3) / 3600);
                charge += extraHours * 15;
            }
            alert(`Total charge: $${charge} USD`);
            totalMoneyCollected += charge;
            totalMoneyElement.innerText = totalMoneyCollected;

            this.isBooked = false;
            this.startTime = null;
            this.endTime = null;
            renderParkingLot();
        }
    }

    render() {
        const slotElement = document.createElement('div');
        slotElement.classList.add('slot');
        slotElement.classList.add(this.type);
        slotElement.setAttribute('data-id', this.id);
        if (this.isBooked) {
            slotElement.classList.add('booked');
            slotElement.innerHTML = `
                Slot ${this.id} (${this.type.toUpperCase()})<br>
                <button onclick="releaseSlot(${this.id})">Release</button>
            `;
        } else {
            slotElement.innerHTML = `
                Slot ${this.id} (${this.type.toUpperCase()})<br>
                <button onclick="bookSlot(${this.id})">Book</button>
            `;
        }
        return slotElement;
    }
}

function renderParkingLot() {
    parkingLot.innerHTML = '';
    slots.forEach(slot => {
        parkingLot.appendChild(slot.render());
    });
}

function initializeSlots() {
    for (let i = 1; i <= totalSlots; i++) {
        const type = i <= smallSlots ? 'small' : 'large';
        const slot = new Slot(i, type);
        slots.push(slot);
    }
    renderParkingLot();
}

window.bookSlot = function(id) {
    const slot = slots.find(s => s.id === id);
    slot.book();
}

window.releaseSlot = function(id) {
    const slot = slots.find(s => s.id === id);
    slot.release();
}

initializeSlots();
