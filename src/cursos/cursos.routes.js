import { Router } from "express";
import { check } from "express-validator";
import { saveCurso,getCursos,searchCurso } from "./curso.controller.js";
import {validarCampos} from "../middlewares/validar-campos.js"
import { validarJWT } from "../middlewares/validar-jwt.js"
import { validarRol } from "../middlewares/validar-rol.js"

const router = Router()

router.post(
    "/",
    [
        validarJWT,
        validarCampos,
        validarRol("TEACHER_ROLE")
    ],
    saveCurso
)

router.get("/",getCursos)

router.get(
    "/search/:id",
    [
        validarJWT,
        validarCampos,
        validarRol("TEACHER_ROLE")
    ],
    searchCurso
)

export default router