import { response,request } from "express";
import { hash } from "argon2";
import User from "./user.model.js"
import Curso from "../cursos/curso.model.js"

export const getUsers = async (req,res) => {
    try {
        const query = {estado: true}

        const [total,usuarios] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
        ])

        res.status(200).json({
            succes: true,
            total,
            usuarios
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "Error al obtener usuarios",
            message: error.message
        })
    }
}

export const assignatedCursos = async (req,res) => {
    try {
        const userID = req.usuario._id
        console.log("USER ID:", userID)
        const user = await User.findById(userID).populate('cursos')

        if (!user) {
            return res.status(400).json({
                succes: false,
                message: "El usuario no existe"
            })
        }

        res.status(200).json({
            succes: true,
            user,
            cursos: user.cursos
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "Error al obtener cursos",
            message: error.message
        })
    }
}

export const asignarCursoAUser = async (req,res) => {
    try {
        const {studentId,cursoId} = req.body
        const student = await User.findById(studentId)

        if (!student) {
            return res.status(404).json({
                succes: false,
                message: "El usuario no existe"
            })
        }

        if (!Array.isArray(student.cursos)) {
            student.cursos = []
        }

        const maximoCursos = 3
        const allCursos = student.cursos.length + cursoId.length

        if (allCursos >= maximoCursos) {
            return res.status(400).json({
                succes: false,
                message: "El usuario ya tiene el máximo de cursos asignados"
            })
        }

        const newCursoConIDs = cursoId.filter(id => !student.cursos.includes(id))

        if (newCursoConIDs.length == 0) {
            return res.status(400).json({
                succes: false,
                message: "El usuario ya tiene todos los cursos asignados"
            })
        }

        for (const id of newCursoConIDs) {
            const curso = await Curso.findById(id)
            if (!curso) {
                return res.status(404).json({
                    succes: false,
                    message: "El curso no existe"
                })
            }

            if (!student.cursos.includes(id)) {
                student.cursos.push(id)
            }
        }

        await student.save(0)

        res.status(200).json({
            succes: true,
            message: "Cursos agregados correctamente",
            student,
            cursoId
        })
    } catch (error) {
        res.status(500).json({
            succes:false,
            message: "Error al asignar curso",
            message: error.message
        })
    }
}

export const searchUser = async (req,res) => {
    try {
        const {id} = req.params
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                succes: false,
                message: "El usuario no existe"
            })
        }

        res.status(200).json({
            succes: true,
            user
        })

    } catch (error) {
        res.status(500).json({
            succes:false,
            message: "Error al buscar usuario",
            message: error.message
        })
    }
}

export const deleteUser = async (req,res) => {
    try {
        const {id} = req.params

        if (req.usuario.role !== "TEACHER_ROLE") {
            return res.status(403).json({
                succes: false,
                message: "No tienes permisos para eliminar un usuario"
            })
        }

        const user = await User.findByIdAndUpdate(id,{estado:false},{new:true})

        if (!user) {
            return res.status(404).json({
                succes: false,
                message: "El usuario no existe"
            })
        }

        res.status(200).json({
            succes: true,
            message: "Usuario eliminado con exito",
            user
        })
    } catch (error) {
        res.status(500).json({
            succes:false,
            message: "Error al eliminar usuario",
            message: error.message
        })
    }
}

export const updateUser = async (req,res) => {
    try {
        const {id} = req.params
        const {password,...data} = req.body

        if (req.usuario.role == 'STUDENT_ROLE' && id !== req.usuario._id.toString()) {
            return res.status(403).json({
                succes: false,
                message: "No tienes permisos para actualizar un usuario"
            })
        }

        if (password) {
            data.password = await hash(password)
        }

        const user = await User.findByIdAndUpdate(id,data,{new:true})

        if(!user){
            return res.status(404).json({
                succes:false,
                message: "El usuario no existe"
            })
        }

        res.status(200).json({
            succes:true,
            message: "Usuario actualizado con exito",
            user
        })

    } catch (error) {
        res.status(500).json({
            succes:false,
            message: "Error al actualizar usuario",
            message: error.message
        })
    }
}

export const bananearDelCurso = async (req,res) => {
    try {
        const userID = req.usuario._id
        const user = await User.findByIdAndUpdate(userID,{estado:false},{new:true})

        if (!user) {
            return res.status(404).json({
                succes: false,
                message: "El usuario no existe"
            })
        }

        res.status(200).json({
            succes: true,
            message: "Usuario bananeado del curso con exito",
            user
        })
    } catch (error) {
        res.status(500).json({
            succes:false,
            message: "Error al bananear del curso",
            message: error.message
        })
    }
}