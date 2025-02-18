export const validarRol = (...roles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                success: false,
                msg: "Se necesita validar el rol con su token"
            });
        }

        const { role } = req.usuario;
        
        if (!roles.includes(role)) {
            return res.status(403).json({
                success: false,
                msg: `Usuario con rol: ${req.usuario.role} no esta autorizado, solo los roles: ${roles} están autorizados.`
            });
        }

        next();
    }
};