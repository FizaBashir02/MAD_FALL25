import Moment from "../models/moment.model.js";
import mongoose from "mongoose";

export const getAllMoments = async (req, res) => {
  try {
    const {
      cafeId,
      minPrice,
      maxPrice,
      dateFrom,
      dateTo,
      timeOfDay,
      sortBy = "dateTime", // ✅ Mặc định sort theo dateTime
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    const order = sortOrder.toLowerCase() === "asc" ? 1 : -1;

    const filter = {};

    // cafeId
    if (cafeId) {
      try {
        filter.cafeId = new mongoose.Types.ObjectId(cafeId);
      } catch (e) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid cafeId" });
      }
    }

    // price (totalPrice)
    if (minPrice !== undefined && minPrice !== "") {
      filter.totalPrice = filter.totalPrice || {};
      filter.totalPrice.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined && maxPrice !== "") {
      filter.totalPrice = filter.totalPrice || {};
      filter.totalPrice.$lte = Number(maxPrice);
    }

    // date range
    if (dateFrom) {
      filter.dateTime = filter.dateTime || {};
      filter.dateTime.$gte = new Date(dateFrom);
    }
    if (dateTo) {
      filter.dateTime = filter.dateTime || {};
      const d = new Date(dateTo);
      d.setHours(23, 59, 59, 999);
      filter.dateTime.$lte = d;
    }

    // timeOfDay
    const timeRanges = {
      morning: { start: 4, end: 10 },
      noon: { start: 11, end: 14 },
      afternoon: { start: 15, end: 17 },
      evening: { start: 18, end: 23 },
    };

    if (timeOfDay && timeRanges[timeOfDay]) {
      const r = timeRanges[timeOfDay];
      filter.$expr = {
        $and: [
          {
            $gte: [
              {
                $mod: [{ $add: [{ $hour: "$dateTime" }, 7] }, 24],
              },
              r.start,
            ],
          },
          {
            $lte: [
              {
                $mod: [{ $add: [{ $hour: "$dateTime" }, 7] }, 24],
              },
              r.end,
            ],
          },
        ],
      };
    }

    // ✅ Build sort option - default dateTime
    let sortOption = {};
    switch (sortBy) {
      case "price":
        sortOption.totalPrice = order;
        break;
      case "date":
      case "dateTime": // hỗ trợ cả "date" và "dateTime"
        sortOption.dateTime = order;
        break;
      case "timeOfDay":
        sortOption.dateTime = order;
        break;
      default:
        sortOption.dateTime = order; // ✅ Default sort by dateTime
    }

    const total = await Moment.countDocuments(filter);

    let moments = await Moment.find(filter)
      .populate("cafeId", "name address rating imageUrl")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber)
      .lean();

    // sort by cafe name after populate
    if (sortBy === "cafe") {
      const mul = order === 1 ? 1 : -1;
      moments.sort((a, b) => {
        const an = a.cafeId?.name || "";
        const bn = b.cafeId?.name || "";
        return mul * an.localeCompare(bn);
      });
    }

    res.status(200).json({
      success: true,
      data: moments,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalItems: total,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error fetching moments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch moments",
      error: error.message,
    });
  }
};

export const getMomentById = async (req, res) => {
  try {
    const moment = await Moment.findById(req.params.id).populate("cafeId");
    if (!moment)
      return res.status(404).json({ error: "Không tìm thấy moment." });
    res.json(moment);
  } catch (err) {
    res.status(400).json({ error: "ID không hợp lệ." });
  }
};

export const createMoment = async (req, res) => {
  try {
    const newMoment = new Moment(req.body);
    const savedMoment = await newMoment.save();
    res.status(201).json(savedMoment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateMoment = async (req, res) => {
  try {
    const updated = await Moment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ error: "Không tìm thấy moment." });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteMoment = async (req, res) => {
  try {
    const deleted = await Moment.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Không tìm thấy moment." });
    res.json({ message: "Đã xóa moment thành công." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
