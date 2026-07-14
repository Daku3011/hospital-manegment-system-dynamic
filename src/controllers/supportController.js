const { SupportInquiry, Doctor, User, sequelize } = require('../models');
const { generateAutoResponse } = require('../../.agent/skill/support-chatbot/responder');

exports.createInquiry = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields (name, email, subject, message) are required.' });
        }

        // Generate automated AI response
        const aiResult = await generateAutoResponse(message, { Doctor, User, sequelize });

        // If confidence is high (1.0), mark as resolved by AI, otherwise pending
        const status = aiResult.confidence >= 1.0 ? 'resolved_by_ai' : 'pending';

        const inquiry = await SupportInquiry.create({
            name,
            email,
            subject,
            message,
            category: aiResult.category,
            status: status,
            aiResponse: aiResult.response
        });

        res.status(201).json({
            message: 'Inquiry received successfully.',
            inquiry
        });
    } catch (err) {
        console.error('Error creating support inquiry:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.getInquiries = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const inquiries = await SupportInquiry.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(inquiries);
    } catch (err) {
        console.error('Error fetching support inquiries:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.updateInquiry = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const { id } = req.params;
        const { status, aiResponse } = req.body;

        const inquiry = await SupportInquiry.findByPk(id);
        if (!inquiry) {
            return res.status(404).json({ message: 'Support inquiry not found.' });
        }

        if (status) inquiry.status = status;
        if (aiResponse !== undefined) inquiry.aiResponse = aiResponse;

        await inquiry.save();
        res.json({ message: 'Inquiry updated successfully.', inquiry });
    } catch (err) {
        console.error('Error updating support inquiry:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
