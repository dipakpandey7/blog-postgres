import {sequelize} from "../DataBase";
import { DataTypes } from "sequelize";
import {User} from "../models/user.model";

export const Post = sequelize.define('Post',{
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false,

    },
    content:{
        type:DataTypes.STRING,
        allowNull:false,

    },
    authorId:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:User,
            key:'id'

        },
    },
    publishDate:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW,
        allowNull:false,

    },
    lastUpdate:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW,
        allowNull:false,
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    featuredImage:{
        type:DataTypes.STRING,

    },

});