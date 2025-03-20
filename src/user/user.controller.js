import { hash } from "argon2";
import User from "./user.model.js";
import Curso from "../cursos/curso.model.js";

export const getUsers = async (req, res) => {
    try {
        const query = { estado: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query),
        ]);

        res.status(200).json({
            success: true,
            total,
            users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving users.",
            error: error.message,
        });
    }
};

export const assignatedCursos = async (req, res) => {
    try {
        const userID = req.user._id;
        const user = await User.findById(userID).populate("cursos");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            user,
            cursos: user.cursos,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving courses.",
            error: error.message,
        });
    }
};

export const assignCourseToUser = async (req, res) => {
    try {
        const { studentId, cursoId } = req.body;
        const student = await User.findById(studentId);
        

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (!Array.isArray(student.cursos)) {
            student.cursos = [];
        }

        const maxCourses = 3;
        const totalCourses = student.cursos.length + 1;

        if (totalCourses >= maxCourses) {
            return res.status(400).json({
                success: false,
                message: "The user has already reached the maximum number of assigned courses.",
            });
        }
       
        const curso = await Curso.findById(cursoId);
        if (!curso) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

        if (student.cursos.some(c => c.id === curso.id)) {
            return res.status(400).json({
                success: false,
                message: "The user is already assigned to selected course.",
            });
        }

        student.cursos.push(curso);
        curso.students.push(student);
        await student.save();

        res.status(200).json({
            success: true,
            message: "Courses assigned successfully.",
            student,
            curso,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while assigning courses.",
            error: error.message,
        });
    }
};

export const searchUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while searching for the user.",
            error: error.message,
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id } = req.user;
        
        if(id === _id){
            const user = await User.findByIdAndUpdate(id, { estado: false }, { new: true });
            res.status(200).json({
                success: true,
                message: "User successfully deleted.",
                user,
            });
        }

        if (req.user.role !== "TEACHER_ROLE" ) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete a user.",
            });
        }

        const user = await User.findByIdAndUpdate(id, { estado: false }, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "User successfully deleted.",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the user.",
            error: error.message,
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, ...data } = req.body;
        const { _id } = req.user;
        
        if(id === _id){
            if (password) {
                data.password = await hash(password);
            }
            const user = await User.findByIdAndUpdate(id, data, { new: true });
            res.status(200).json({
                success: true,
                message: "User successfully updated.",
                user,
            });
        }

        if (req.user.role === "STUDENT_ROLE" && id !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to update this user.",
            });
        }

        if (password) {
            data.password = await hash(password);
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "User successfully updated.",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the user.",
            error: error.message,
        });
    }
};

export const removeUserFromCourse = async (req, res) => {
    try {
        const userID = req.body.studentId;
        const courseID = req.body.cursoId;
        const user = await User.findById(userID);
        const course = await Curso.findById(courseID);
        

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const courseA = await Curso.findByIdAndUpdate(courseID, { $pull: { students: userID } }, { new: true });
        const userA = await User.findByIdAndUpdate(userID, {$pull: {cursos: courseID}}, {new: true});
        res.status(200).json({
            success: true,
            message: "User successfully removed from the course.",
            courseA,
            userA
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while removing the user from the course.",
            error: error.message,
        });
    }
};
