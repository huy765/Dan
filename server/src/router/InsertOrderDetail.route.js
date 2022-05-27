const express = require("express");

const Router = express.Router();

const jwt = require("jsonwebtoken");

const argon2 = require("argon2");

const {
  find_all_OrderDetail,
  InsertOrderDetail,
  UpdateOrderDetail_State,
  find_all_OrderDetail_by_idCustomer,
  find_max_id,

  orderDetail,
} = require("../models/orderDetail");
const { UpdateIdOrder, Updatedetailstate } = require("../models/card");
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
      return res.status(200).json({ success: true, user, role: req.role });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
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
            .json({ success: false, message: "Xóa thất bại" });
        } else {
          return res
            .status(200)
            .json({ success: true, message: "Xóa thành công" });
        }
      } else {
        return res.status(405).json({
          success: false,
          message: "Tài khoản không được cấp phép",
        });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  } else {
    return res.status(405).json({
      success: false,
      message: "Tài khoản không tồn tại",
    });
  }
});

Router.get("/allOrderAdmin", verifyToken, async (req, res) => {
  try {
    if (req.role.nameRole === "Administrators") {
      const orders = await find_all_OrderDetail();
      if (!orders) {
        return res
          .status(202)
          .json({ success: false, message: "User not found" });
      } else {
        return res.status(200).json({ success: true, orders });
      }
    } else {
      return res.status(405).json({
        success: false,
        message: "Tài khoản không được cấp phép",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

Router.get("/allOrderCustomer", verifyToken, async (req, res) => {
  try {
    if (req.role.nameRole === "Customer") {
      const orders = await find_all_OrderDetail_by_idCustomer(req.userId);
      if (!orders) {
        return res
          .status(202)
          .json({ success: false, message: "User not found" });
      } else {
        return res.status(200).json({ success: true, orders });
      }
    } else {
      return res.status(405).json({
        success: false,
        message: "Tài khoản không được cấp phép",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

Router.post("/addOrderDetail", verifyToken, async (req, res) => {
  const { idCard, idCustomer, sumPayment, discount, idPayment, address } =
    req.body;

  if (!idCustomer || !sumPayment || !discount || !idPayment || !address) {
    res.status(400).json({
      success: true,
      message: "Thiếu thông tin",
    });
  } else {
    try {
      const newOrderDetail = {
        idCustomer,
        sumPayment,
        discount,
        address,
        idPayment,
      };
      const max_id = await find_max_id();
      // console.log(max_id.max);
      const ReIdOrder = await UpdateIdOrder(idCard, max_id.max + 1);
      const Redetailstate = await Updatedetailstate(idCard);

      const newOrderDetailRe = await InsertOrderDetail(newOrderDetail);
      if (newOrderDetailRe) {
        res.status(200).json({
          success: true,
          message: "Đặt hàng thành công",
          newOrderDetail: newOrderDetailRe,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Đặt hàng thất bại",
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Xảy ra lỗi máy chủ: " + error,
      });
    }
  }
});

Router.put("/updateState/:id", verifyToken, async (req, res) => {
  if (req.role.id === 1 || req.role.id === 3) {
    const { state } = req.body;
    if (!state) {
      res.status(400).json({
        success: true,
        message: "Thiếu thông tin",
      });
    } else {
      try {
        const resultUpdate = await UpdateOrderDetail_State(
          state,
          req.params.id
        );
        const orders = await find_all_OrderDetail();
        if (resultUpdate) {
          res.status(200).json({
            success: true,
            message: "Cập nhật thành công",
            orders,
          });
        } else {
          res.status(400).json({
            success: false,
            message: "Cập nhật thất bại",
          });
        }
      } catch (error) {
        res.status(400).json({
          success: false,
          message: "Xảy ra lỗi : " + error,
        });
      }
    }
  } else {
    return res.status(405).json({
      success: false,
      message: "Tài khoản không được cấp phép",
    });
  }
});

Router.put("/updateStateDetailOrder/:id", verifyToken, async (req, res) => {
  if (req.role.id === 2) {
    const { state } = req.body;
    if (!state) {
      res.status(400).json({
        success: true,
        message: "Thiếu thông tin",
      });
    } else {
      try {
        const orders = await find_all_OrderDetail();
        const resultUpdate = await UpdateOrderDetail_State(
          state,
          req.params.id
        );
        if (resultUpdate) {
          res.status(200).json({
            success: true,
            message: "Cập nhật thành công",
            orders,
          });
        } else {
          res.status(400).json({
            success: false,
            message: "Cập nhật thất bại",
          });
        }
      } catch (error) {
        res.status(400).json({
          success: false,
          message: "Xảy ra lỗi : " + error,
        });
      }
    }
  } else {
    return res.status(405).json({
      success: false,
      message: "Tài khoản không được cấp phép",
    });
  }
});

module.exports = Router;