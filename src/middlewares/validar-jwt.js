import jwt from 'jsonwebtoken';

import  User  from '../user/user.model.js';

export const validateJWT = async (req, res, next) => {
    try {
        const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({ 
            msg: 'No token, authorization denied' 
        });
    }

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user = await User.findById(uid);
    if (!user) {
        return res.status(404).json({
            msg: 'User not found'
        });
    }

    if (!user.estado){
        return res.status(401).json({
            msg: 'Token is invalid, User state is false'
        });
    }
    req.user = user;
    next();
     
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: 'Token is invalid',
        })
        
    }
} 