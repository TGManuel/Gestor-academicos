import Role from "../role/role.model.js";
import User from "../user/user.model.js";

export const isValidRole = async (role = "") => {
    const existentRole = await Role.findOne({ role });

    if (!existentRole) {
        throw new Error(`The role ${role} does not exist`);
    }
};

export const isValidEmail = async (email = "") => {
    const existentEmail = await User.findOne({ email });

    if (existentEmail) {
        throw new Error(`The email ${email} already exists`);
    }
};

export const existentUserById = async (id = "") => {
    const userExist = await User.findById(id);

    if (!userExist) {
        throw new Error(`The ID ${id} does not exist`);
    }
};
