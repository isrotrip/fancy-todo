const router = require('express').Router();
const todoController = require('../controllers/todoController.js');
const verifyUser = require('../middlewares/verifyUser.js');

router.get('/', todoController.read);
router.post('/', todoController.create);
router.use('/:id', verifyUser.authorization);
router.put('/:id', todoController.update);
router.delete('/:id', todoController.delete);

module.exports = router;