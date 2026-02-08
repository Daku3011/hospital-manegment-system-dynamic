document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '/login.html';

    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('patientName').textContent = user.name;

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '/login.html';
    });

    // Load Initial Data
    loadAppointments();
    loadProfile();
    loadDoctors();

    // Profile Form Submit
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const age = document.getElementById('age').value;
        const gender = document.getElementById('gender').value;
        const contact = document.getElementById('contact').value;
        const address = document.getElementById('address').value;
        const medical_history = document.getElementById('medicalHistory').value;

        try {
            const res = await fetch('/api/patient/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ age, gender, contact, address, medical_history })
            });
            if (res.ok) alert('Profile updated!');
            else alert('Failed to update profile');
        } catch (err) {
            console.error(err);
        }
    });

    // Book Appointment Form Submit
    document.getElementById('bookForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const doctorId = document.getElementById('doctorSelect').value;
        const date_time = document.getElementById('dateTime').value;
        const reason = document.getElementById('reason').value;

        try {
            const res = await fetch('/api/patient/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ doctorId, date_time, reason })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Appointment booked successfully!');
                loadAppointments();
                showSection('appointments');
            } else {
                alert(data.message || 'Failed to book appointment');
            }
        } catch (err) {
            console.error(err);
        }
    });
});

async function loadAppointments() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('/api/patient/appointments', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const appointments = await res.json();
        const list = document.getElementById('appointmentList');
        list.innerHTML = '';

        appointments.forEach(appt => {
            const li = document.createElement('li');
            li.className = 'appointment-item';
            li.innerHTML = `
                <div>
                    <strong>Dr. ${appt.Doctor.User.name}</strong> (${appt.Doctor.specialization})<br>
                    <small>${new Date(appt.date_time).toLocaleString()}</small><br>
                    <small>${appt.reason || 'No reason provided'}</small>
                </div>
                <div>
                    <span class="status-badge status-${appt.status}">${appt.status}</span>
                </div>
            `;
            list.appendChild(li);
        });
    } catch (err) {
        console.error(err);
    }
}

async function loadProfile() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('/api/patient/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const patient = await res.json();
        if (patient) {
            document.getElementById('age').value = patient.age || '';
            document.getElementById('gender').value = patient.gender || 'Male';
            document.getElementById('contact').value = patient.contact || '';
            document.getElementById('address').value = patient.address || '';
            document.getElementById('medicalHistory').value = patient.medical_history || '';
        }
    } catch (err) {
        console.error(err);
    }
}

async function loadDoctors() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('/api/patient/doctors', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const doctors = await res.json();
        const select = document.getElementById('doctorSelect');
        select.innerHTML = '';
        doctors.forEach(doc => {
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = `Dr. ${doc.User.name} (${doc.specialization}) - ${doc.availability}`;
            select.appendChild(option);
        });
    } catch (err) {
        console.error(err);
    }
}

function showSection(sectionId) {
    document.getElementById('appointmentsSection').style.display = 'none';
    document.getElementById('bookSection').style.display = 'none';
    document.getElementById('profileSection').style.display = 'none';

    document.getElementById(`${sectionId}Section`).style.display = 'block';
}
window.showSection = showSection;
