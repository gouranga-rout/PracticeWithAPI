const express = require("express");
const { seedDatabase, getTransactions, getStatistics, getPieChartData, getBarChartData } = require("../controllers/transactionsController");  // Updated imports

const { getBarChart } = require("../controllers/chartController");

const router = express.Router();

router.get("/seed", seedDatabase);

router.get("/transactions", getTransactions);

router.get("/statistics", getStatistics);
router.get("/chart/pie", getPieChartData);
router.get("/chart/bar", getBarChartData);
module.exports = router;
