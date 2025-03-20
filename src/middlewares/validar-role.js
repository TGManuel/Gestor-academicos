export const validateRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(500).json({
                success: false,
                msg: "No se puede validar el rol sin su token"
            });
        }

        const { role } = req.user;
        
        if (!roles.includes(role)) {
            return res.status(403).json({
                success: false,
                msg: `Usuario con rol: ${req.usuario.role} no esta autorizado, solo los roles: ${roles} están autorizados.`
            });
        }

        next();
    }
};