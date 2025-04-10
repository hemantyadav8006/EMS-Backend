import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "username is required",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Email Cannot be empty",
        },
        isEmail: {
          msg: "Enter Valid Email",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password field cannot be empty",
        },
      },
    },
    profile_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// 🔐 Method to compare raw password with hashed password
User.prototype.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔐 Method to generate access token
User.prototype.generateAccessToken = function () {
  return jwt.sign({ id: this.id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// 🔐 Method to generate refresh token
User.prototype.generateRefreshToken = function () {
  return jwt.sign({ id: this.id }, process.env.REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_EXPIRY,
  });
};
