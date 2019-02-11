const router = require('express').Router();
const todoController = require('../controllers/todoController.js');
const verifyUser = require('../helpers/verifyUser.js');

router.get('/read', verifyUser.authentication, todoController.read);
router.post('/create', verifyUser.authentication, todoController.create);
router.post('/update', verifyUser.authentication, verifyUser.authorization, todoController.update);
router.post('/delete', verifyUser.authentication, verifyUser.authorization, todoController.delete);

module.exports = router;