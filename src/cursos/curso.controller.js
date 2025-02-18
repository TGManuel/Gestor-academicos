//import User from "../users/user.model.js"
import Curso from "./curso.model.js"

export const saveCurso= async (req,res) => {
    try {
        const {name,description} = req.body

        const curso = new Curso({
            name,
            description
        })

        await curso.save()

        res.status(200).json({
            message: "Curso creado con éxito",
            curso
        })

        
    } catch (err) {
        res.status(500).json({
            succes: false,
            message: err.message
        })
    }
}

export const getCursos= async (req,res) => {
    const query = {estado:true}

    try {
        const cursos = await Curso.find(query)

        if (!cursos) {
            return res.status(404).json({
                succes: false, 
                message: "No hay cursos"
            })
        }

        res.status(200).json({
            succes: true,
            cursos
        })
        
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: error.message
        })
    }
}

export const searchCurso = async (req,res) => {
    const {id} = req.params

    try {
        const curso = await Curso.findById(id)

        if (!curso) {
            return res.status(404).json({
                succes: false,
                message: "Curso no encontrado"
            })
        }

        res.status(200).json({
            succes: true,
            curso
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: error.message
        })
    }
}

export const updateCurso = async (req,res) => {
    try {
        const {_id,students,...data} = req.body

        const curso = await Curso.findById(id)

        if (!curso) {
            return res.status(404).json({
                succes: false,
                message: "Curso no encontrado"
            })
        }

        const updatedCurso = await Curso.findByIdAndUpdate(id,data,{new:true})


    } catch (error) {
        res.status(500).json({
            succes: false,
            message: error.message
        })
    }
}