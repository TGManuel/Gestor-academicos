import jwt from "jsonwebtoken"
import User from "../users/user.model.js"


export const validarJWT= async (req,res,next) => {
    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la peticion VALIDAR-JWT"
        })
    }

    try {
        const {uid,role} = jwt.verify(token,process.env.SECRETPRIVATYKEY)
        const usuario = await User.findById(uid)

        if (!usuario) {
            return res.status(401).json({
                msg: "Usuario no existe en DB"
            })
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: "Usuario no esta activo"
            })
        }

        req.usuario = usuario
        next()
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: "Token no válido!"
        })
    }
}