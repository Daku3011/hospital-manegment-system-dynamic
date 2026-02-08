document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '/login.html';

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '/login.html';
    });

    // Load Initial Data
    loadUsers();

    async function fetchData(endpoint) {
        try {
            const res = await fetch(`/api/admin/${endpoint}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return await res.json();
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    async function loadUsers() {
        const users = await fetchData('users');
        const tbody = document.getElementById('usersTable');
        tbody.innerHTML = '';
        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${user.name}</td><td>${user.email}</td><td>${user.role}</td>`;
            tbody.appendChild(tr);
        });
    }

    // Expose functions to global scope for button clicks (if later added) or just lazy loading
    window.loadUsers = loadUsers;

    window.showSection = async function (sectionId) {
        document.getElementById('usersSection').style.display = 'none';
        document.getElementById('doctorsSection').style.display = 'none';
        document.getElementById('patientsSection').style.display = 'none';
        document.getElementById('appointmentsSection').style.display = 'none';

        document.getElementById(`${sectionId}Section`).style.display = 'block';

        if (sectionId === 'users') loadUsers();
        if (sectionId === 'doctors') {
            const doctors = await fetchData('doctors');
            // Logic to render doctors table... simplified for brevity, reusing users table structure logic would be better but let's just dump it
            const div = document.querySelector('#doctorsSection .card');
            div.innerHTML = '<table><thead><tr><th>Name</th><th>Email</th><th>Specialization</th></tr></thead><tbody>' +
                doctors.map(d => `<tr><td>${d.User.name}</td><td>${d.User.email}</td><td>${d.specialization}</td></tr>`).join('') +
                '</tbody></table>';
        }
        if (sectionId === 'patients') {
            const patients = await fetchData('patients');
            const div = document.querySelector('#patientsSection .card');
            div.innerHTML = '<table><thead><tr><th>Name</th><th>Email</th><th>Age</th></tr></thead><tbody>' +
                patients.map(p => `<tr><td>${p.User.name}</td><td>${p.User.email}</td><td>${p.age || 'N/A'}</td></tr>`).join('') +
                '</tbody></table>';
        }
        if (sectionId === 'appointments') {
            const appointments = await fetchData('appointments');
            const tbody = document.getElementById('appointmentsTable');
            tbody.innerHTML = '';
            appointments.forEach(appt => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${appt.Doctor.User.name}</td>
                    <td>${appt.Patient.User.name}</td>
                    <td>${new Date(appt.date_time).toLocaleString()}</td>
                    <td>${appt.status}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    };
});
