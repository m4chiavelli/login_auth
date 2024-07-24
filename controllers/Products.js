import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getProducts = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Product.findAll({
        attributes: ["uuid", "name", "price"],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Product.findAll({
        attributes: ["uuid", "name", "price"],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductsById = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
      attributes: ["uuid", "name", "price"],
      include: [
        {
          model: User,
          attributes: ["name", "email"],
        },
      ],
    });
    if (!product) return res.status(404).json({ msg: "Product not found" });

    if (req.role !== "admin" && product.userId !== req.userId) {
      return res.status(403).json({ msg: "Access forbidden" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createProducts = async (req, res) => {
  const { name, price, userId } = req.body;
  try {
    await Product.create({
      name: name,
      price: price,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Product Created Successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// export const updateProduct = async (req, res) => {
//   try {
//     console.log("Received ID:", req.params.id); // Tambahkan logging di sini
//     const product = await Product.findOne({
//       where: {
//         id: req.params.id, // Ubah dari uuid ke id
//       },
//     });
//     if (!product) {
//       console.log("Product not found with ID:", req.params.id); // Tambahkan logging di sini
//       return res.status(404).json({ msg: "Product not found" });
//     }

//     if (req.role !== "admin" && product.userId !== req.userId) {
//       return res.status(403).json({ msg: "Access forbidden" });
//     }

//     // Update product details
//     const { name, price } = req.body;
//     await Product.update({ name, price }, { where: { id: req.params.id } }); // Ubah dari uuid ke id

//     res.status(200).json({ msg: "Product updated successfully" });
//   } catch (error) {
//     console.error("Error updating product:", error); // Tambahkan logging di sini
//     res.status(500).json({ msg: error.message });
//   }
// };

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { name, price } = req.body;
    if (req.role === "admin") {
      await Product.update(
        { name, price },
        {
          where: {
            id: product.id,
          },
        }
      );
    } else {
      if (req.userId !== product.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Product.update(
        { name, price },
        {
          where: {
            [Op.and]: [{ id: product.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Product updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteProducts = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Product not found" });

    if (req.role !== "admin" && product.userId !== req.userId) {
      return res.status(403).json({ msg: "Access forbidden" });
    }

    // Delete product
    await Product.destroy({ where: { uuid: req.params.id } });

    res.status(200).json({ msg: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
