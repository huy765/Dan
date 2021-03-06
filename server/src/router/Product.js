const express = require("express");

const Router = express.Router();

const {
    find_by_name_row_product,
    find_all_Product,
    find_all_Product_with_idCategory,
    delete_By_Id,
    InsertProduct,
    UpdateProduct,
    find_view_by_Id,
    find_all_Product_with_name,
    find_all_Product_sold,
    find_by_IdInvoiceIn,
    Product,
} = require("../models/product");
const { find_Emp_by_name_row } = require("../models/Employee");

const verifyToken = require("../../Middleware/Auth");

Router.get("/", verifyToken, async (req, res) => {
    try {
        const user = await find_by_name_row("id", req.userId);
        if (!user) {
            return res
                .status(202)
                .json({ success: false, message: "User not found" });
        } else {
            return res
                .status(200)
                .json({ success: true, user, role: req.role });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Server Error" });
    }
});
Router.get("/Category/:id", async (req, res) => {
    try {
        const products = await find_all_Product_with_idCategory(req.params.id);
        if (!products) {
            return res
                .status(202)
                .json({ success: false, message: "Products not found" });
        } else {
            return res.status(200).json({ success: true, products });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Server Error" });
    }
});
Router.get("/Search/:value", async (req, res) => {
    try {
        const products = await find_all_Product_with_name(req.params.value);
        if (!products) {
            return res
                .status(202)
                .json({ success: false, message: "Products not found" });
        } else {
            return res.status(200).json({ success: true, products });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Server Error" });
    }
});
Router.delete("/:id", verifyToken, async (req, res) => {
    const result = await find_Emp_by_name_row("id", req.userId);
    if (result) {
        try {
            if (req.role.nameRole === "Administrators") {
                const result = await delete_By_Id(req.params.id);
                if (result != 1) {
                    return res
                        .status(202)
                        .json({ success: false, message: "X??a th???t b???i" });
                } else {
                    return res
                        .status(200)
                        .json({ success: true, message: "X??a th??nh c??ng" });
                }
            } else {
                return res.status(405).json({
                    success: false,
                    message: "T??i kho???n kh??ng ???????c c???p ph??p",
                });
            }
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Server Error" });
        }
    } else {
        return res.status(405).json({
            success: false,
            message: "T??i kho???n kh??ng t???n t???i",
        });
    }
});

Router.get("/findproduct/:id", verifyToken, async (req, res) => {
    const result = await find_Emp_by_name_row("id", req.userId);
    if (result) {
        try {
            const products = await find_view_by_Id(req.params.id);
            if (!products) {
                return res
                    .status(202)
                    .json({ success: false, message: "Product not found" });
            } else {
                return res.status(200).json({ success: true, products });
            }
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Server Error" });
        }
    } else {
        return res.status(405).json({
            success: false,
            message: "T??i kho???n kh??ng t???n t???i",
        });
    }
});

Router.get("/InvoiceIn/:idInvoiceIn", verifyToken, async (req, res) => {
    if (req.role.id === 1 || req.role.id === 3) {
        try {
            const products = await find_by_IdInvoiceIn(req.params.idInvoiceIn);
            if (!products) {
                return res.status(202).json({
                    success: false,
                    message: "Kh??ng t??m th???y s???n ph???m theo ch???ng t???",
                });
            } else {
                return res.status(200).json({ success: true, products });
            }
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Server Error" });
        }
    } else {
        return res.status(405).json({
            success: false,
            message: "T??i kho???n kh??ng ???????c ph??p",
        });
    }
});

Router.get("/allProduct", async (req, res) => {
    try {
        const products = await find_all_Product();
        if (!products) {
            return res
                .status(202)
                .json({ success: false, message: "User not found" });
        } else {
            return res.status(200).json({ success: true, products });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Server Error" });
    }
});
Router.get("/allProductSold", async (req, res) => {
    try {
        const products = await find_all_Product_sold();
        if (!products) {
            return res
                .status(202)
                .json({ success: false, message: "Product not found" });
        } else {
            return res.status(200).json({ success: true, products });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Server Error" });
    }
});

Router.post("/addProduct", verifyToken, async (req, res) => {
    if (req.role.id === 1 || req.role.id === 3) {
        const {
            price,
            priceIn,
            nameProduct,
            description,
            warranty,
            quantity,
            promotional,
            status,
            image,
            idInvoiceIn,
            idCategory,
            idUnit,
            idManufacturer,
            idOrigin,
        } = req.body;

        if (
            !price ||
            !priceIn ||
            !nameProduct ||
            !description ||
            !warranty ||
            !quantity ||
            !promotional ||
            !status ||
            !image ||
            !idInvoiceIn ||
            !idCategory ||
            !idUnit ||
            !idManufacturer ||
            !idOrigin
        ) {
            res.status(400).json({
                success: true,
                message: "Nh???p thi???u th??ng tin",
            });
        } else {
            const nameProductRe = await find_by_name_row_product(
                "nameProduct",
                nameProduct
            );
            if (nameProductRe.length > 0) {
                res.status(400).json({
                    success: false,
                    message: "S???n ph???m ???? t???n t???i",
                });
            } else {
                try {
                    const newProductItem = new Product({
                        price,
                        priceIn,
                        nameProduct,
                        description,
                        warranty,
                        quantityIn: quantity,
                        quantity,
                        promotional,
                        status,
                        image,
                        idInvoiceIn,
                        idCategory,
                        idUnit,
                        idManufacturer,
                        idOrigin,
                    });
                    const newProductRe = await InsertProduct(newProductItem);
                    if (newProductRe) {
                        res.status(200).json({
                            success: true,
                            message: "Th??m th??nh c??ng",
                            nameProduct: nameProduct,
                        });
                    } else {
                        res.status(400).json({
                            success: false,
                            message: "Th??m th???t b???i",
                        });
                    }
                } catch (error) {
                    res.status(400).json({
                        success: false,
                        message: "X???y ra l???i : " + error,
                    });
                }
            }
        }
    } else {
        return res.status(405).json({
            success: false,
            message: "T??i kho???n kh??ng ???????c c???p ph??p",
        });
    }
});

Router.put("/updateProduct/:id", verifyToken, async (req, res) => {
    if (req.role.id === 1 || req.role.id === 3) {
        const {
            nameProduct,
            description,
            warranty,
            quantity,
            promotional,
            price,
            status,
            nameCategory,
            nameBrand,
            nameOrigin,
        } = req.body;
        if (
            !nameProduct ||
            !description ||
            !warranty ||
            !quantity ||
            !promotional ||
            !price ||
            !status ||
            !nameCategory ||
            !nameBrand ||
            !nameOrigin
        ) {
            res.status(400).json({
                success: true,
                message: "Nh???p thi???u th??ng tin",
            });
        } else {
            try {
                const updateProductItem = {
                    id: req.params.id,
                    nameProduct,
                    description,
                    warranty: warranty.split(" ")[0],
                    quantity,
                    promotional,
                    price,
                    status,
                    nameCategory,
                    nameBrand,
                    nameOrigin,
                };
                const updateProductRe = await UpdateProduct(updateProductItem);
                const products = await find_all_Product();
                if (updateProductRe.affectedRows > 0) {
                    res.status(200).json({
                        success: true,
                        message: "C???p nh???t th??nh c??ng",
                        products: products,
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        message: "C???p nh???t th???t b???i",
                    });
                }
            } catch (error) {
                res.status(400).json({
                    success: false,
                    message: "X???y ra l???i : " + error,
                });
            }
        }
    }
});

module.exports = Router;
