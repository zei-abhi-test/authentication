const router = require('express').Router();
const { Router } = require('express');
const User= require('../Model/userSchema');


router.post('/register', async (req, res) => {
    const { userName, email, password } = req.body;
    try{
    if (!userName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });``                      
    }
    const user= new User({
        userName,
        email,
        password
    });   
    await user.save()
    res.status(201).json({ message: 'User registered successfully' });
    }catch(error){
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/',async (req, res) => {
    try{
        const users = await User.find();
        res.json(users);
    }
    catch(error){
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

router.get('/:id',async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch(error){
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

router.put('/:id',async (req, res) => {
    try{
        const { userName, email, password } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { userName, email, password },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch(error){
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

router.delete('/:id',async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch(error){
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
})


module.exports = router;
