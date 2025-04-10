import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

export const Employee = sequelize.define(
  "Employee",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name can't be empty",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Email can't be empty",
        },
        isEmail: {
          msg: "Please provide a valid email address",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password can't be empty",
        },
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: "Phone number cannot be empty",
        },
        is: {
          args: /^[0-9+\-\s()]{7,20}$/i,
          msg: "Phone number format is invalid",
        },
      },
    },
    department: {
      type: DataTypes.STRING,
    },
    designation: {
      type: DataTypes.STRING,
    },
    joiningDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    profile_photo: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);
