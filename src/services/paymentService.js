import Payments from "../models/payment.js";

export const listPayments = async () => {
  try {
    const payments = await Payments.findAll();
    return {
      errCode: 0,
      message: "Payments fetched successfully.",
      data: payments,
    };
  } catch (error) {
    console.error("Error fetching payments:", error.message);
    return {
      errCode: 1,
      message: "Unable to fetch payments.",
    };
  }
};

export const getPaymentById = async (paymentId) => {
  try {
    const payment = await Payments.findByPk(paymentId);
    if (!payment) {
      return {
        errCode: 2,
        message: "Payment not found with the given ID.",
      };
    }
    return {
      errCode: 0,
      message: "Payment fetched successfully.",
      data: payment,
    };
  } catch (error) {
    console.error("Error fetching payment by ID:", error.message);
    return {
      errCode: 1,
      message: "Unable to fetch payment.",
    };
  }
};

export const createPayment = async (paymentData) => {
  try {
    const newPayment = await Payments.create(paymentData);
    return {
      errCode: 0,
      message: "Payment created successfully.",
      data: newPayment,
    };
  } catch (error) {
    console.error("Error creating payment:", error.message);
    return {
      errCode: 1,
      message: "Unable to create payment.",
    };
  }
};

export const updatePayment = async (paymentId, paymentData) => {
  try {
    const [updatedRowsCount] = await Payments.update(paymentData, {
      where: { payment_id: paymentId },
    });
    if (updatedRowsCount === 0) {
      return {
        errCode: 2,
        message: "Payment not found with the given ID for updating.",
      };
    }
    return {
      errCode: 0,
      message: "Payment updated successfully.",
    };
  } catch (error) {
    console.error("Error updating payment:", error.message);
    return {
      errCode: 1,
      message: "Unable to update payment.",
    };
  }
};

export const deletePayment = async (paymentId) => {
  try {
    const deletedRowsCount = await Payments.destroy({
      where: { payment_id: paymentId },
    });
    if (deletedRowsCount === 0) {
      return {
        errCode: 2,
        message: "Payment not found with the given ID for deletion.",
      };
    }
    return {
      errCode: 0,
      message: "Payment deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting payment:", error.message);
    return {
      errCode: 1,
      message: "Unable to delete payment.",
    };
  }
};
