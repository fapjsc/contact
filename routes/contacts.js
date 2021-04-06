const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../middleware/auth');

const User = require('../models/User');
const Contact = require('../models/Contact');

// @route   GET    api/contacts
// @desc    get all users contacts
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // find() => 會返回所有符合條件的數據
        const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
        res.json(contacts);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'server error' });
    }
});

// @route   POST    api/contacts
// @desc    add new contact
// @access  Private
router.post('/', [auth, [check('name', 'name is required').not().isEmpty()]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) res.status(400).json({ errors: errors.array() });

    const { name, email, phone, type } = req.body;

    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            type,
            user: req.user.id,
        });

        const contact = await newContact.save();

        res.json(contact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'server error' });
    }
});

// @route   PUT    api/contacts/:id
// @desc    update contact
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, email, phone, type } = req.body;

    // build contact object
    const contactFields = {};
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (type) contactFields.type = type;

    try {
        let contact = await Contact.findById(req.params.id);
        if (!contact) res.status(404).json({ msg: 'contact not found' });

        // 確保無法更改其他人的contact
        console.log(req.user.id);
        console.log(contact.user);
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'not authorized' });
        }

        // 透過id尋找並更新，如果id不存在，則添加一個新的條目
        contact = await Contact.findByIdAndUpdate(
            req.params.id,
            {
                $set: contactFields,
            },
            {
                new: true,
            }
        );

        res.json(contact);
    } catch (error) {
        console.error(error.message, '1');
        res.status(500).json({ msg: 'server error 1' });
    }
});

// @route   DELETE    api/contacts/:id
// @desc    delete contact
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let contact = await Contact.findById(req.params.id);
        if (!contact) res.status(404).json({ msg: 'contact not found' });

        // 確保使用者無法刪除其他人的contact
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'not authorized' });
        }

        await Contact.findByIdAndRemove(req.params.id);
        res.json({ msg: 'contact removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'server error' });
    }
});

module.exports = router;
