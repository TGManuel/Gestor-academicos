import {Schema,model} from "mongoose";

const CursoSchema = Schema({
    name:{
        type: String,
        required: [true,'Nombre requerido.'],
        unique: true
    },
    description:{
        type: String,
        required: [true,'Descripción requerida!!!!!!!!!!']
    },
    estado:{
        type: Boolean,
        default: true
    },
    students:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
},
{
    timestamps: true,
    versionKey: false 
}
)

CursoSchema.methods.toJSON = function () {
    const {__v,_id,...curso} = this.toObject()
    curso.uid = _id
    return curso
}

export default model('Curso',CursoSchema)