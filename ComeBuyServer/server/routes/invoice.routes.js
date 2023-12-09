module.exports = app => {
  const invoice = require("../controller/invoice.controller");
  var router = require("express").Router();
  router.post("/", invoice.createInvoice);
  router.post("/invoiceItem", invoice.createInvoiceItem);
  router.get("/", invoice.findAllInvoice);
  router.get("/:id", invoice.findInvoiceById);
  router.put("/:id", invoice.updateInvoice);
  router.get("/revenueByBranchID/:id", invoice.getRevenueInBrach);
  router.delete("/:id", invoice.deleteInvoice);
  router.delete("/", invoice.deleteAll);
  app.use('/api/invoice', router);
};