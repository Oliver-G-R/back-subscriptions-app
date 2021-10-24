import { Router } from 'express'
const router = Router()

import { deleteUser, updateEmail, updatePassword } from '../../controllers/user.controller';
import { validateToken } from '../../tokens/validateToken';
import { createValidationForRoute, showErrors } from '../../validations/validationsUserAuth';

router.route('/UpdateEmail')
    .put(
        validateToken,  
        createValidationForRoute("UpdateEmail"),
        showErrors,
        updateEmail)

router.route('/UpdatePassword')
    .put(validateToken, updatePassword)

router.route('/DeleteUser')
    .delete(validateToken, deleteUser)

export { router as controlUserRouter }