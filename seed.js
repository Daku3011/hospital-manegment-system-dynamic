/**
 * Seed script to populate the Hospital Management System with dummy data.
 */

const { User, Doctor, Patient, Appointment, sequelize } = require('./src/models');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // WARNING: This clears the database!
        console.log('Database synced (all data wiped for fresh seeding)');

        const password = 'password123';

        // --- SEED ADMINS ---
        console.log('Seeding Admins...');
        const admins = [];
        for (let i = 1; i <= 25; i++) {
            admins.push({
                name: `Admin User ${i}`,
                email: `admin${i}@hospital.com`,
                password: password,
                role: 'admin'
            });
        }
        await User.bulkCreate(admins, { individualHooks: true });

        // --- SEED DOCTORS ---
        console.log('Seeding Doctors...');
        const specializations = [
            'Cardiologist', 'Neurologist', 'Pediatrician', 'Orthopedic Surgeon', 
            'Dermatologist', 'Ophthalmologist', 'Psychiatrist', 'Gastroenterologist', 
            'Onclologist', 'Endocrinologist', 'Radiologist', 'Urologist'
        ];
        
        const availabilityOptions = [
            'Mon-Fri 09:00-17:00',
            'Mon-Wed 08:00-15:00',
            'Tue-Sat 10:00-18:00',
            'Mon-Sun 24/7 (Emergency)',
            'Wed-Fri 07:00-14:00'
        ];

        for (let i = 1; i <= 30; i++) {
            const user = await User.create({
                name: `Dr. ${getRandomName('doctor')}`,
                email: `doctor${i}@hospital.com`,
                password: password,
                role: 'doctor'
            });

            await Doctor.create({
                userId: user.id,
                specialization: specializations[Math.floor(Math.random() * specializations.length)],
                availability: availabilityOptions[Math.floor(Math.random() * availabilityOptions.length)]
            });
        }

        // --- SEED PATIENTS ---
        console.log('Seeding Patients...');
        const medicalHistories = [
            "Type 2 Diabetes, High blood pressure",
            "History of asthma since childhood",
            "Seasonal allergies, dust and pollen sensitive",
            "No known conditions",
            "Lower back pain due to herniated disk",
            "Hyperthyroidism patient since 2018",
            "Recovered from fracture in right leg",
            "Chronic migraines and stress",
            "Irritable bowel syndrome (IBS)",
            "Gastroesophageal reflux disease (GERD)"
        ];

        for (let i = 1; i <= 30; i++) {
            const user = await User.create({
                name: getRandomName('patient'),
                email: `patient${i}@hospital.com`,
                password: password,
                role: 'patient'
            });

            await Patient.create({
                userId: user.id,
                age: Math.floor(Math.random() * 80) + 1,
                gender: Math.random() > 0.5 ? 'Male' : 'Female',
                contact: `+1-${800 + i}-${Math.floor(1000 + Math.random() * 9000)}`,
                address: `${Math.floor(Math.random() * 1000)} ${['Main Street', 'Oak Avenue', 'Maple Drive', 'Park Road'][Math.floor(Math.random() * 4)]}, Cityville`,
                medical_history: medicalHistories[Math.floor(Math.random() * medicalHistories.length)]
            });
        }

        console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
        console.log('Summary:');
        console.log('- 25 Admins');
        console.log('- 30 Doctors');
        console.log('- 30 Patients');
        console.log('All passwords: password123');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

function getRandomName(role) {
    const firstNames = [
        "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth",
        "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Christopher", "Karen",
        "Charles", "Lisa", "Matthew", "Nancy", "Anthony", "Betty", "Mark", "Sandra", "Donald", "Ashley"
    ];
    const lastNames = [
        "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
        "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
        "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson"
    ];
    
    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${randomFirst} ${randomLast}`;
}

seedDatabase();
