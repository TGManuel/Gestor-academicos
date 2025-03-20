import Curso from "./curso.model.js";

export const saveCurso = async (req, res) => {
    try {
        const { name, description } = req.body;

        const curso = new Curso({
            name,
            description,
        });

        await curso.save();

        res.status(201).json({
            message: "Course successfully created.",
            curso,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the course.",
            error: err.message,
        });
    }
};

export const getCursos = async (req, res) => {
    const query = { estado: true };

    try {
        const cursos = await Curso.find(query);

        if (!cursos || cursos.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses available.",
            });
        }

        res.status(200).json({
            success: true,
            cursos,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving courses.",
            error: error.message,
        });
    }
};

export const searchCurso = async (req, res) => {
    const { id } = req.params;

    try {
        const curso = await Curso.findById(id);

        if (!curso) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

        res.status(200).json({
            success: true,
            curso,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while searching for the course.",
            error: error.message,
        });
    }
};

export const updateCurso = async (req, res) => {
    try {
        const { _id, students, ...data } = req.body;

        const curso = await Curso.findById(_id);

        if (!curso) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

        const updatedCurso = await Curso.findByIdAndUpdate(_id, data, { new: true });

        res.status(200).json({
            success: true,
            message: "Course successfully updated.",
            curso: updatedCurso,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the course.",
            error: error.message,
        });
    }
};
