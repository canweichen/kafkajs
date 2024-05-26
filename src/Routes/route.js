const express = require('express');
const invoiceController = require('../Controller/InvoiceController');
const driverController = require('../Controller/DriverController');
const locationController = require('../Controller/LocationController');
const loginController = require('../Controller/LoginController');
const router = express.Router();

router.post('/api/login', loginController.login);

router.get('/api/invoiceLog', invoiceController.getInvoiceLogList);
router.get('/api/invoices', invoiceController.getInvoiceList);
router.get('/api/transfer/detail', invoiceController.getTransferDetail);
router.get('/api/logDetail', invoiceController.getLogDetail);
router.get('/api/quoteList', invoiceController.getQuoteList);
router.get('/api/compareInvoices', invoiceController.getCompareInvoices);
router.get('/api/payment/detail', invoiceController.getCompareInvoicesDetail);

router.get('/api/driver/list', driverController.getDriverList);
router.get('/api/bnp/acc/list', driverController.getAccList);

router.get('/api/userRequest/list', driverController.getUserRequestList);
router.get('/api/userRpcLog/list', driverController.getTmsUserRpcLog);
router.get('/api/recreateInvoice', driverController.recreateInvoice);
router.get('/api/recreateInvoice/list', driverController.getRecreateInvoiceList);
router.get('/api/summary/list', driverController.getSummaryList);

router.get('/api/sync/location', locationController.syncLocationToLocal);
router.get('/api/location/list', locationController.getLocationList);

module.exports = router