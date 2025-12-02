import Cafe from "../models/cafe.model.js";

export const getAllCafes = async (req, res) => {
  try {
    const {
      search = "",
      minRating,
      maxRating,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // Tìm kiếm theo tên hoặc địa chỉ
    if (search.trim()) {
      const keyword = search.trim();
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { address: { $regex: keyword, $options: "i" } },
      ];
    }

    // Lọc theo rating
    if (minRating !== undefined || maxRating !== undefined) {
      filter.rating = {};
      if (minRating !== undefined && minRating !== "")
        filter.rating.$gte = Number(minRating);
      if (maxRating !== undefined && maxRating !== "")
        filter.rating.$lte = Number(maxRating);
    }

    // Sắp xếp
    const validSortFields = ["name", "rating", "createdAt"];
    const sortOption = {
      [validSortFields.includes(sortBy) ? sortBy : "createdAt"]:
        sortOrder.toLowerCase() === "asc" ? 1 : -1,
    };

    // Phân trang
    const pageNumber = Math.max(1, parseInt(page, 10));
    const limitNumber = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * limitNumber;

    // Truy vấn DB song song
    const [total, cafes] = await Promise.all([
      Cafe.countDocuments(filter),
      Cafe.find(filter).sort(sortOption).skip(skip).limit(limitNumber).lean(),
    ]);

    res.status(200).json({
      success: true,
      data: cafes,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalItems: total,
        itemsPerPage: limitNumber,
      },
    });
  } catch (err) {
    console.error("Error fetching cafes:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách quán cafe.",
    });
  }
};

export const getCafeById = async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.id);
    if (!cafe)
      return res.status(404).json({ error: "Không tìm thấy quán cafe." });
    res.json(cafe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const createCafe = async (req, res) => {
  try {
    const newCafe = new Cafe(req.body);
    const savedCafe = await newCafe.save();
    res.status(201).json(savedCafe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateCafe = async (req, res) => {
  try {
    const updatedCafe = await Cafe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedCafe)
      return res.status(404).json({ error: "Không tìm thấy quán cafe." });
    res.json(updatedCafe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCafe = async (req, res) => {
  try {
    const deleted = await Cafe.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Không tìm thấy quán cafe." });
    res.json({ message: "Đã xóa quán cafe thành công." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllCoffeeNames = async (req, res) => {
  try {
    const coffees = await Cafe.find().select("name _id");
    res.json(coffees);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách quán cafe." });
  }
};
