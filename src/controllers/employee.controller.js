import { Employee } from "../models/employee.model.js";
import cloudinary from "../utils/cloudinary.js";

export const getAll = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully!",
      data: employees,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const create = async (req, res) => {
  try {
    if (!req.body.email || !req.name) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields or file",
      });
    }

    const emp = await Employee.findOne({ where: { email: req.body.email } });
    if (emp) {
      return res.status(400).json({
        success: false,
        message: "User with email already exist!",
      });
    }
    
    let result;

    try {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "employee-profiles",
      });
    } catch (uploadErr) {
      console.error("Cloudinary Upload Error:", uploadErr);
      return res.status(500).json({ error: "Failed to upload image." });
    }

    const newEmp = await Employee.create({
      ...req.body,
      profile_photo: result.secure_url,
    });

    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error removing temp file:", err);
    });
    if (newEmp) {
      res.status(201).json({
        success: true,
        message: "New User created Successfully",
        data: newEmp,
      });
    }
  } catch (err) {
    console.error("Employee creation error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: err.message,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const emp = await Employee.findByPk(req.params.id);
    if (!emp)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    res.json({ success: true, message: "Employee found", data: emp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  const forbiddenFields = ["email", "id", "password"];
  const forbiddenPassed = Object.keys(req.body).filter((field) =>
    forbiddenFields.includes(field)
  );

  if (forbiddenPassed.length > 0) {
    return res.status(400).json({
      success: false,
      message: `You are not allowed to update: ${forbiddenPassed.join(", ")}`,
    });
  }
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "employee-profiles",
    });
    console.log("result: ", result);

    const [updated] = await Employee.update(
      {
        ...req.body,
        profile_photo: result.secure_url,
      },
      {
        where: { id: req.params.id },
      }
    );
    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      message: "Employee updated Successfully",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const deleted = await Employee.destroy({ where: { id: req.params.id } });
    if (!deleted)
      return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
