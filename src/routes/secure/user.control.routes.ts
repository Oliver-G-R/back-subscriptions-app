import { Router } from 'express'
const router = Router()

import { deleteUser, updateEmail, updatePassword } from '../../controllers/user.contreoller';
import { validateToken } from '../../tokens/validateToken';

router.route('/UpdateEmail')
    .put(validateToken, updateEmail)

router.route('/UpdatePassword')
    .put(validateToken, updatePassword)

router.route('/DeleteUser')
    .delete(validateToken, deleteUser)

export { router as controlUserRouter }