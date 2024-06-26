const express = require('express');
const invoiceController = require('../Controller/InvoiceController');
const driverController = require('../Controller/DriverController');
const locationController = require('../Controller/LocationController');
const loginController = require('../Controller/LoginController');
const giraController = require('../Controller/GiraTicketController');
const router = express.Router();

router.post('/api/login', loginController.login);

router.get('/api/invoiceLog', invoiceController.getInvoiceLogList);
router.get('/api/invoices', invoiceController.getInvoiceList);
router.get('/api/transfer/detail', invoiceController.getTransferDetail);
router.get('/api/logDetail', invoiceController.getLogDetail);
router.get('/api/quoteList', invoiceController.getQuoteList);
router.get('/api/compareInvoices', invoiceController.getCompareInvoices);
router.get('/api/payment/detail', invoiceController.getCompareInvoicesDetail);
router.post('/api/invoice/fail/add', invoiceController.addFailedInvoice);
router.get('/api/invoice/fail/list', invoiceController.getFailedInvoice);

router.get('/api/driver/list', driverController.getDriverList);
router.get('/api/bnp/acc/list', driverController.getAccList);

router.get('/api/userRequest/list', driverController.getUserRequestList);
router.get('/api/userRpcLog/list', driverController.getTmsUserRpcLog);
router.get('/api/recreateInvoice', driverController.recreateInvoice);
router.get('/api/recreateInvoice/list', driverController.getRecreateInvoiceList);
router.get('/api/summary/list', driverController.getSummaryList);

router.get('/api/sync/location', locationController.syncLocationToLocal);
router.get('/api/location/list', locationController.getLocationList);

router.post('/api/gira/ticket/add', giraController.add);
router.get('/api/gira/ticket/list', giraController.list);
router.post('/api/gira/ticket/edit', giraController.edit);
router.get('/api/gira/ticket/delete', giraController.delete);

router.post('/api/tech/add', giraController.createTech);
router.get('/api/tech/list', giraController.techList);

router.get('/api/trip/export', locationController.exportToExcel);
router.get('/api/trip/termina/list', locationController.getTripTerminalList);

module.exports = router