import User from "../users/user.model.js";
import {generarJWT} from "../helpers/generate-jwt.js"
import { hash,verify } from "argon2";

export const register = async(req,res)=>{
    
    try {
        const data = req.body 

        const encryptedPassword = await hash(data.password)

        const user = await User.create({
            name: data.name,
            email: data.email,
            password: encryptedPassword,
            role: data.role || 'STUDENT_ROLE' 
        })
        
        res.status(200).json({
            message: "Usuario creado con exito",
            userDetails:{
                user: user.email
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Error al registrar usuario",
            error: error.message
        })
    }

}

export const login = async (req,res) => {
    const {email,password} = req.body
    
    try {
        const user = await User.findOne({email})

        
        if (!user) {
            return res.status(400).json({
                message: "Usuario no registrado"
            })
        }

        if (!user.estado) {
            return res.status(400).json({
                message: "Usuario inactivo"
            })
        }

        const validPassword = await verify(user.password,password)
        if (!validPassword) {
            return res.status(400).json({
                message: "Contraseña incorrecta"
            })
        }
   
        const token = await generarJWT(user.id)
        return res.status(200).json({
            msg: 'Usuario correcto',
            userDetails:{
                email: user.email,
                token: token
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Error al iniciar sesión",
            error: error.message
        })
    }
}