export const METALS = [
  "SP S/S",
  "Secreto",
  "Silver",
  "White Brass",
  "Brass",
  "Osby",
  "White Osby",
  "Bronze",
  "Thai Gold",
  "Stainless Steel",
  "Aluminum",
  "10K Yellow",
  "10K White",
  "10K Rose",
  "10K Green",
  "14K Yellow",
  "14K White",
  "14K Rose",
  "14K Green",
  "18K Yellow",
  "18K White",
  "18K Rose",
  "18K Green",
  "22K Yellow",
  "22K White",
  "22K Rose",
  "22K Green",
  "24K Yellow",
  "Platinum",
  "Palladium",
  "18K Palladium",
  "Copper",
] as const;

export const POLISHING_SERVICES = [
  "High Polish",
  "Satin / Matte",
  "Oxidized",
  "Pre-polish",
  "Polish",
  "Sprue & Tumble",
  "Sizing",
  "Stone Set",
  "Sandblasting",
  "Solder",
  "Assemble",
  "Goldplate 24K",
  "Goldplate 18K",
  "Goldplate 14K",
  "Goldplate 10K",
  "Rhodium Plate",
  "Palladium Plate",
  "Silver Plate",
  "Metal Sizing",
] as const;

export const MOLD_TYPES = ["Silicone Mold", "Rubber Mold", "Blue Mold"] as const;

export const ORDER_TYPES = {
  STRAIGHT_CAST: "Straight Cast",
  MAKE_MOLD: "Make Mold",
  MOLD_CAST: "Mold Cast",
  FILE_CAST: "File Cast",
  CAD_ORDER: "CAD Order",
  CAD_EDIT: "CAD Edit",
  FINISHING: "Finishing",
  QUOTE_REQUEST: "Quote Request",
} as const;

export const ORDER_STATUSES = {
  CREATED: "Created",
  PLACED: "Placed",
  IN_PROGRESS: "In Progress",
  CASTING: "Casting",
  WAX: "Wax Department",
  MOLD_MAKING: "Mold Making",
  POLISHING: "Polishing",
  CAD: "CAD Department",
  QUALITY_CHECK: "Quality Check",
  READY: "Ready for Pickup",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
} as const;

export const DEPARTMENTS = [
  "CASTING",
  "CAD",
  "WAX",
  "MOLD",
  "POLISHING",
  "ACCOUNTING",
  "ADMIN",
] as const;

export const PAYMENT_TERMS = {
  COD: "Cash on Delivery",
  NET7: "7-Day Net Term",
  NET15: "15-Day Net Term",
  NET30: "30-Day Net Term",
} as const;

export const ROLES = {
  CUSTOMER: "Customer",
  ACCOUNT_MANAGER: "Account Manager",
  DEPARTMENT_EMPLOYEE: "Department Employee",
  EXECUTIVE: "Executive",
} as const;

export const PRECIOUS_METALS = ["GOLD", "SILVER", "PLATINUM", "PALLADIUM"] as const;

export const GOLD_KARATS = ["24K", "22K", "18K", "14K", "10K", "5K"] as const;
export const GOLD_COLORS = ["Yellow", "White", "Rose", "Green"] as const;

export const PRINT_TYPES = ["Castable Prints", "Resin Plastic (Not Castable)"] as const;

export const FILE_TYPES_ALLOWED = {
  CAD: [".stl", ".3dm"],
  DESIGN: [".pdf", ".jpg", ".jpeg", ".png"],
} as const;
