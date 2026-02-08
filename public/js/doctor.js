document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '/login.html';

    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('doctorName').textContent = user.name;

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '/login.html';
    });

    // Load Initial Data
    loadAppointments();
    loadProfile();

    // Profile Form Submit
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const specialization = document.getElementById('specialization').value;
        const availability = document.getElementById('availability').value;

        try {
            const res = await fetch('/api/doctor/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ specialization, availability })
            });
            if (res.ok) alert('Profile updated!');
            else alert('Failed to update profile');
        } catch (err) {
            console.error(err);
        }
    });
});

async function loadAppointments() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('/api/doctor/appointments', {
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
                    <strong>${appt.Patient.User.name}</strong><br>
                    <small>${new Date(appt.date_time).toLocaleString()}</small><br>
                    <small>${appt.reason || 'No reason provided'}</small>
                </div>
                <div>
                    <span class="status-badge status-${appt.status}">${appt.status}</span>
                    ${appt.status === 'pending' ? `
                        <button onclick="updateStatus(${appt.id}, 'approved')" style="margin-left:5px;cursor:pointer;">✅</button>
                        <button onclick="updateStatus(${appt.id}, 'cancelled')" style="margin-left:5px;cursor:pointer;">❌</button>
                    ` : ''}
                    ${appt.status === 'approved' ? `
                        <button onclick="updateStatus(${appt.id}, 'completed')" style="margin-left:5px;cursor:pointer;">🏁</button>
                    ` : ''}
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
        const res = await fetch('/api/doctor/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const doctor = await res.json();
        document.getElementById('specialization').value = doctor.specialization;
        document.getElementById('availability').value = doctor.availability;
    } catch (err) {
        console.error(err);
    }
}

async function updateStatus(id, status) {
    const token = localStorage.getItem('token');
    if (!confirm(`Mark appointment as ${status}?`)) return;

    try {
        const res = await fetch(`/api/doctor/appointments/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        if (res.ok) loadAppointments();
        else alert('Failed to update status');
    } catch (err) {
        console.error(err);
    }
}

function showSection(sectionId) {
    document.getElementById('appointmentsSection').style.display = 'none';
    document.getElementById('profileSection').style.display = 'none';

    document.getElementById(`${sectionId}Section`).style.display = 'block';
}
window.showSection = showSection;
window.updateStatus = updateStatus;
