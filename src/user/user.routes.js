import { Router } from "express";
import { check } from "express-validator";
import {getUsers, assignatedCursos, assignCourseToUser, searchUser, deleteUser, updateUser, removeUserFromCourse} from "./user.controller.js"
import {existentUserById} from "../helpers/db-validator.js"
import { validateFields } from "../middlewares/validar-campos.js"
import { validateJWT } from "../middlewares/validar-jwt.js"
import {validateRole} from "../middlewares/validar-role.js"

const router = Router()

router.get("/",getUsers)

router.get(
    "/:id",
    [
        validateJWT
    ],
    assignatedCursos
)

router.get(
    "/search/:id",
    [
        check('id','ID inválido'),
        check("id").custom(existentUserById),
        validateFields
    ],
    searchUser
)

router.post(
    "/asignar-curso",
    [
        validateJWT,
        validateRole('TEACHER_ROLE')
    ],
    assignCourseToUser
)

router.delete(
    "/delete/:id",
    [
        validateJWT,
        check("id",'ID inválido'),
        check("id").custom(existentUserById),
        validateRole('TEACHER_ROLE'),
        validateFields
    ],
    deleteUser
)

router.put(
    "/update/:id",
    [
        validateJWT,
        check('id','ID inválido'),
        check("id").custom(existentUserById),
        validateFields
    ],
    updateUser
)

router.put(
    "/remove",
    [
        validateJWT,
        validateRole('TEACHER_ROLE')
    ],
    removeUserFromCourse
)
export default router