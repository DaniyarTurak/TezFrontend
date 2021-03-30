//у пользователя director массив включает в себя модули на которые нет доступа
//у остальных пользователей массив включает в себя модули на которые есть доступ
const rules = {
  admin: {
    static: [],
  },
  director: {
    static: [],
  },
  aladin: {
    static: ["*"],
  },
  accountant: {
    static: [
      "reportCashboxState",
      "reportSalesSection",
      "reportTransactions",
      "reportSales",
      "reportSalesPlan",
      "reportSalesPlanTeam",
      "reportProductRemains",
      "reportFizCustomers",
      "reportDiscounts",
      "reportIncome",

      "reportStockBalance",
      "reportInvoiceHistory",
      "reportProductMovement",
      "reportRevision",
    ],
  },
  supplier: {
    static: [
      "reportStockBalance",
      "reportInvoiceHistory",
      "reportProductMovement",
      "reportRevision",
    ],
  },
  pointHead: {
    static: [
      "reportCashboxState",
      "reportSalesSection",
      "reportTransactions",
      "reportSales",
      "reportSalesPlan",
      "reportSalesPlanTeam",
      "reportProductRemains",
      "reportFizCustomers",
      "reportDiscounts",
      "reportIncome",

      "reportStockBalance",
      "reportInvoiceHistory",
      "reportProductMovement",
      "reportRevision",
    ],
  },
  undefined: {
    static: [],
  },
  revisor: {
    static: ["revision"],
  },
};

export default rules;
