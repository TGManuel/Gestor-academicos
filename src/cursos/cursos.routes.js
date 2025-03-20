import { Router } from "express";
import { saveCurso, getCursos, searchCurso } from "./curso.controller.js";
import {validateFields} from "../middlewares/validar-campos.js"
import { validateJWT } from "../middlewares/validar-jwt.js"
import { validateRole } from "../middlewares/validar-role.js"

const router = Router()

router.post(
    "/",
    [
        validateJWT,
        validateFields,
        validateRole("TEACHER_ROLE")
    ],
    saveCurso
)

router.get("/",getCursos)

router.get(
    "/search/:id",
    [
        validateJWT,
        validateFields,
        validateRole("TEACHER_ROLE")
    ],
    searchCurso
)

export default router