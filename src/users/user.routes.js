import { Router } from "express";
import { check } from "express-validator";
import {getUsers,assignatedCursos,asignarCursoAUser,searchUser,deleteUser,updateUser,bananearDelCurso} from "./users.controller.js"
import {existentUserById} from "../helpers/db-validator.js"
import { validarCampos } from "../middlewares/validar-campos.js"
import { validarJWT } from "../middlewares/validar-jwt.js"
import {validarRol} from "../middlewares/validar-rol.js"

const router = Router()

router.get("/",getUsers)

router.get(
    "/:id",
    [
        validarJWT
    ],
    assignatedCursos
)

router.get(
    "/search/:id",
    [
        check('id','ID inválido'),
        check("id").custom(existentUserById),
        validarCampos
    ],
    searchUser
)

router.post(
    "/asignar-curso",
    [
        validarJWT,
        validarRol('TEACHER_ROLE')
    ],
    asignarCursoAUser
)

router.delete(
    "/delete/:id",
    [
        validarJWT,
        check("id",'ID inválido'),
        check("id").custom(existentUserById),
        validarRol('TEACHER_ROLE'),
        validarCampos
    ],
    deleteUser
)

router.put(
    "/update/:id",
    [
        validarJWT,
        check('id','ID inválido'),
        check("id").custom(existentUserById),
        validarCampos
    ],
    updateUser
)

router.delete(
    "/bananear",
    [
        validarJWT,
        validarRol('TEACHER_ROLE')
    ],
    bananearDelCurso
)
export default router