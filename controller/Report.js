import Report from "../models/ReportModel.js";
import path from "path";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";

export const getReport = async (req, res) => {
  try {
    let response;
    if (req.role === "admin")
      response = await Report.findAll({
        include: {
          model: Users,
        },
      });
    else {
      response = await Report.findAll({
        where: {
          userId: req.userId,
        },
        include: {
          model: Users,
        },
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const response = await Report.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createReport = (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No file uploaded" });
  const name = req.body.nama;
  const email = req.body.email;
  const noTelp = req.body.noTelp;
  const alamat = req.body.alamat;
  const pengaduan = req.body.pengaduan;
  const status = req.body.status;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid Images" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Image must be less than 5 MB" });

  file.mv(`./public/uploads/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });

    try {
      await Report.create({
        userId: req.userId,
        name: name,
        email: email,
        noTelp: noTelp,
        alamat: alamat,
        pengaduan: pengaduan,
        status: status,
        image: fileName,
        url: url,
      });
      res.status(201).json({ msg: "Report Created" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });
};

export const updateReport = async (req, res) => {
  try {
    const report = await Report.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!report) {
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }

    const { status } = req.body;

    if (req.role === "admin") {
      await Report.update(
        { status },
        {
          where: {
            id: report.id,
          },
        }
      );
    } else {
      if (req.userId !== report.userId) {
        return res.status(403).json({ msg: "Akses terlarang" });
      }

      await Report.update(
        { status },
        {
          where: {
            [Op.and]: [{ id: report.id }, { userId: req.userId }],
          },
        }
      );
    }

    res.status(200).json({ msg: "Report updated successfully" });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const deleteReport = (req, res) => {};
