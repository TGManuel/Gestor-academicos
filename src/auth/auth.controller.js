import User from "../user/user.model.js";
import { generateJWT } from "../helpers/generate-jwt.js";
import { hash, verify } from "argon2";

export const register = async (req, res) => {
    try {
        const data = req.body; 

        // Encrypt password
        const encryptedPassword = await hash(data.password);

        // Create user
        const user = await User.create({
            name: data.name,
            email: data.email,
            password: encryptedPassword,
            role: data.role || "STUDENT_ROLE", // Default role if not provided
        });

        res.status(201).json({
            message: "User successfully registered.",
            userDetails: {
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: "An error occurred during user registration.",
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // Validate user existence
        if (!user) {
            return res.status(400).json({
                message: "User not found.",
            });
        }

        // Check if the user is active
        if (!user.estado) {
            return res.status(400).json({
                message: "This account is inactive.",
            });
        }

        // Compare passwords
        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                message: "Incorrect password.",
            });
        }

        // Generate authentication token
        const token = await generateJWT(user.id);

        return res.status(200).json({
            message: "Login successful.",
            userDetails: {
                email: user.email,
                token: token,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: "An error occurred during login.",
            error: error.message,
        });
    }
};
