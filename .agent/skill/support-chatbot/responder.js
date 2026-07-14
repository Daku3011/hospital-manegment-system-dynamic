/**
 * Automated Responder Logic
 * Analyzes input message and matches keywords to generate an automated support reply.
 * Can query database models dynamically for up-to-date hospital information.
 */

const { Op } = require('sequelize');

async function generateAutoResponse(message, models) {
    const text = (message || '').toLowerCase().trim();
    const { Doctor, User, sequelize } = models;

    // 1. Check for Doctor/Specialist queries
    const doctorKeywords = ['doctor', 'doc', 'specialist', 'cardiologist', 'neurologist', 'pediatrician', 'surgeon', 'dermatologist', 'ophthalmologist', 'psychiatrist', 'gastroenterologist', 'oncologist', 'endocrinologist', 'radiologist', 'urologist', 'physician', 'orthopedic'];
    const hasDoctorQuery = doctorKeywords.some(keyword => text.includes(keyword)) || text.includes('who is') || text.includes('who are');

    if (hasDoctorQuery) {
        // Find if there is a specific specialization mentioned
        const specializations = [
            'cardiologist', 'neurologist', 'pediatrician', 'orthopedic', 'dermatologist', 
            'ophthalmologist', 'psychiatrist', 'gastroenterologist', 'oncologist', 
            'endocrinologist', 'radiologist', 'urologist'
        ];
        
        let targetSpecialization = null;
        for (const spec of specializations) {
            if (text.includes(spec) || (spec === 'cardiologist' && text.includes('heart')) || (spec === 'neurologist' && text.includes('brain'))) {
                targetSpecialization = spec;
                break;
            }
        }

        try {
            let doctors = [];
            if (targetSpecialization) {
                // Find doctors with matching specialization
                doctors = await Doctor.findAll({
                    include: [{
                        model: User,
                        attributes: ['name', 'email']
                    }],
                    where: sequelize.where(
                        sequelize.fn('lower', sequelize.col('specialization')),
                        { [Op.like]: `%${targetSpecialization}%` }
                    )
                });
            } else {
                // Find all doctors (limit to 5 to avoid long messages)
                doctors = await Doctor.findAll({
                    include: [{
                        model: User,
                        attributes: ['name']
                    }],
                    limit: 5
                });
            }

            if (doctors.length > 0) {
                let reply = targetSpecialization 
                    ? `We found the following specialists matching "${targetSpecialization}":\n`
                    : `Here are some of our available doctors:\n`;
                
                doctors.forEach(doc => {
                    const docName = doc.User.name.startsWith('Dr. ') ? doc.User.name : `Dr. ${doc.User.name}`;
                    reply += `- **${docName}** (${doc.specialization}) — Available: ${doc.availability}\n`;
                });
                
                reply += `\nTo schedule a visit with them, please register or log in, and book an appointment online!`;
                return {
                    response: reply,
                    category: 'Doctor',
                    confidence: 1.0
                };
            } else if (targetSpecialization) {
                return {
                    response: `We currently do not have a doctor listed for "${targetSpecialization}" in our database. However, our general practitioners can refer you to a specialist. Please schedule a general consultation.`,
                    category: 'Doctor',
                    confidence: 0.8
                };
            }
        } catch (err) {
            console.error('Error fetching doctors in chatbot:', err);
            // Fall back to a standard doctor message if DB query fails
        }
    }

    // 2. Check for Appointment queries
    if (text.includes('appointment') || text.includes('book') || text.includes('schedule') || text.includes('reserve') || text.includes('visit')) {
        return {
            response: `📅 **Appointment Booking Guide:**\nTo book an appointment at our hospital, follow these steps:\n1. Click **Register** on the homepage if you are new, or **Login** if you already have an account.\n2. Once logged in, go to the **Book Appointment** tab in your Patient Panel.\n3. Choose your doctor, select the date/time, provide a reason for your visit, and click **Book Now**.\n\nYou can track the status of your booking directly from your dashboard.`,
            category: 'Appointment',
            confidence: 1.0
        };
    }

    // 3. Check for Hours/Location/Contact details
    if (text.includes('hour') || text.includes('open') || text.includes('time') || text.includes('location') || text.includes('address') || text.includes('phone') || text.includes('contact') || text.includes('email') || text.includes('where is')) {
        return {
            response: `🏥 **Hospital Contact Info & Hours:**\n- **Address:** 123 Medical Plaza, Cityville\n- **Phone:** +1-234-567-890\n- **Email:** support@hospital.com\n- **Operating Hours:**\n  * **Emergency Department:** Open 24 Hours / 7 Days a week\n  * **General Outpatient Clinics:** Monday to Friday, 9:00 AM – 5:00 PM\n  * **Pharmacy:** Open Daily, 8:00 AM – 10:00 PM`,
            category: 'General',
            confidence: 1.0
        };
    }

    // 4. Check for Profile/Account update queries
    if (text.includes('profile') || text.includes('account') || text.includes('history') || text.includes('update') || text.includes('edit') || text.includes('change')) {
        return {
            response: `👤 **Managing Your Profile:**\nYou can update your personal details and medical history easily:\n1. Log in to your **Patient Panel**.\n2. Click on the **Profile** option in the sidebar.\n3. Update your age, gender, contact number, address, or medical history.\n4. Click **Update Profile** to save your changes. Your updated medical history will be visible to your doctors during appointments.`,
            category: 'Feedback',
            confidence: 1.0
        };
    }

    // 5. Fallback response
    return {
        response: `Thank you for reaching out to Patient Support. 

I've registered your message. Since it requires personal assessment, a customer support agent will review your inquiry shortly.

*💡 Quick Tip: You can ask me questions like:*
- "Do you have a cardiologist available?"
- "How do I book an appointment?"
- "What are your opening hours?"
- "How do I edit my medical history?"`,
        category: 'General',
        confidence: 0.5
    };
}

module.exports = {
    generateAutoResponse
};
