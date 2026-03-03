const EmergencyContact = require('../models/EmergencyContact');

// GET all contacts for the user
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await EmergencyContact.findAll({ where: { userId: req.user.id } });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching contacts' });
    }
};

// ADD a contact
exports.addContact = async (req, res) => {
    try {
        const { name, relationship, phone, email } = req.body;
        const contact = await EmergencyContact.create({
            name, relationship, phone, email,
            userId: req.user.id
        });
        res.status(201).json(contact);
    } catch (err) {
        res.status(500).json({ message: 'Error adding contact' });
    }
};

// UPDATE a contact
exports.updateContact = async (req, res) => {
    try {
        const contact = await EmergencyContact.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if (!contact) return res.status(404).json({ message: 'Contact not found' });

        const { name, relationship, phone, email } = req.body;
        await contact.update({ name, relationship, phone, email });
        res.json(contact);
    } catch (err) {
        res.status(500).json({ message: 'Error updating contact' });
    }
};

// DELETE a contact
exports.deleteContact = async (req, res) => {
    try {
        const contact = await EmergencyContact.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if (!contact) return res.status(404).json({ message: 'Contact not found' });

        await contact.destroy();
        res.json({ message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting contact' });
    }
};
