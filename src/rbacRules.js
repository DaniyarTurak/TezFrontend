//у пользователя director массив включает в себя модули на которые нет доступа
//у остальных пользователей массив включает в себя модули на которые есть доступ
const rules = {
  admin: {
    static: [
      "point",
      "stock",
      "cashbox",
      "cashboxuser",
      "general",
      "uploadfile",
      "stats",
      "product",
      "promotionspage",
      "createnews",
      "news",
    ],
  },
  director: {
    static: ["revision"],
  },
  aladin: {
    static: ["*"],
  },
  accountant: {
    static: [
      "stockreport",
      "report",
      "general",
      "counterparties",
      "esf",
      "buyers",
      "references",
      "stats",
      "product",
      "creatediscounts",
      "bonus",
      "promotionspage",
      "certificates",
      "news",
      "pricingmaster",
    ],
  },
  supplier: {
    static: [
      "stockreport",
      "certificates",
      "product",
      "receive",
      "transfer",
      "categories",
      "attrspr",
      "brand",
      "addcategory",
      "writeoff",
      "addbrand",
      "general",
      "printbarcode",
      "counterparties",
      "references",
      "prices",
      "marginalpricepage",
      "changeprice",
      "pricingmaster",
      "options",
      "promotionspage",
      "news",
      "productsweight",
      "productreference",
    ],
  },
  pointHead: {
    static: [
      "point",
      "references",
      "stock",
      "cashbox",
      "cashboxuser",
      "general",
      "stockreport",
      "report",
      "stats",
      "product",
      "creatediscounts",
      "bonus",
      "promotionspage",
      "news",
      "pricingmaster",
      "couponspage",
    ],
  },
  catman: {
    static: [
      "report",
      "stockreport",
      "prices",
      "marginalpricepage",
      "changeprice",
      "pricingmaster",
      "product",
      "createworkorder",
      "acceptworkorder",
      "recievebyworkorder"
    ]
  },
  undefined: {
    static: [],
  },
  revisor: {
    static: ["revision", "product", "news"],
  },
};

export default rules;
