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
        document.getElementById('supportSection').style.display = 'none';

        document.getElementById(`${sectionId}Section`).style.display = 'block';

        if (sectionId === 'users') loadUsers();
        if (sectionId === 'doctors') {
            const doctors = await fetchData('doctors');
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
        if (sectionId === 'support') loadSupportInquiries();
    };

    async function loadSupportInquiries() {
        try {
            const res = await fetch('/api/support/inquiries', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const inquiries = await res.json();
            const tbody = document.getElementById('supportTable');
            tbody.innerHTML = '';

            inquiries.forEach(inq => {
                const tr = document.createElement('tr');
                
                let badgeClass = 'status-pending';
                if (inq.status === 'resolved_by_ai') badgeClass = 'status-approved';
                if (inq.status === 'resolved_by_staff') badgeClass = 'status-completed';

                tr.innerHTML = `
                    <td>
                        <strong>${inq.name}</strong><br>
                        <small>${inq.email}</small>
                    </td>
                    <td>
                        <strong>[${inq.category}] ${inq.subject}</strong><br>
                        <p style="margin-top:5px; font-size: 13px;">${inq.message}</p>
                        <small style="color: #888;">Submitted: ${new Date(inq.createdAt).toLocaleString()}</small>
                    </td>
                    <td>
                        <p style="font-size: 13px; font-style: italic; white-space: pre-wrap;">${inq.aiResponse || 'No AI response generated'}</p>
                    </td>
                    <td>
                        <span class="status-badge ${badgeClass}">${inq.status}</span>
                    </td>
                    <td>
                        <button onclick="toggleResolveInquiry(${inq.id}, '${inq.status}')" class="btn" style="padding: 5px 10px; font-size: 12px; width: auto;">
                            ${inq.status === 'resolved_by_staff' ? 'Mark Pending' : 'Resolve'}
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (err) {
            console.error('Error loading support inquiries:', err);
        }
    }

    window.toggleResolveInquiry = async function(id, currentStatus) {
        const newStatus = currentStatus === 'resolved_by_staff' ? 'pending' : 'resolved_by_staff';
        try {
            const res = await fetch(`/api/support/inquiries/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                loadSupportInquiries();
            } else {
                alert('Failed to update status');
            }
        } catch (err) {
            console.error(err);
        }
    };
});
