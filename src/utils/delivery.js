export const DELIVERY_FEES = {
  Colombo: 300,
  Gampaha: 350,
  Kalutara: 350,

  Kandy: 450,
  Matale: 450,
  "Nuwara Eliya": 500,

  Galle: 500,
  Matara: 550,
  Hambantota: 600,

  Kurunegala: 450,
  Puttalam: 500,

  Kegalle: 450,
  Ratnapura: 500,

  Badulla: 600,
  Monaragala: 650,

  Anuradhapura: 600,
  Polonnaruwa: 600,

  Trincomalee: 650,
  Batticaloa: 700,
  Ampara: 700,

  Jaffna: 750,
  Kilinochchi: 700,
  Mullaitivu: 700,
  Mannar: 700,
  Vavuniya: 650,
};

export const getDeliveryFee = (district) => {
  return DELIVERY_FEES[district] || 500;
};

export const getEstimatedDelivery = (district) => {
  const deliveryTimes = {
    Colombo: "1-2 Business Days",
    Gampaha: "1-2 Business Days",
    Kalutara: "2-3 Business Days",

    Kandy: "2-3 Business Days",
    Matale: "2-3 Business Days",
    "Nuwara Eliya": "3-4 Business Days",

    Galle: "2-3 Business Days",
    Matara: "3-4 Business Days",
    Hambantota: "3-5 Business Days",

    Kurunegala: "2-3 Business Days",
    Puttalam: "3-4 Business Days",

    Kegalle: "2-3 Business Days",
    Ratnapura: "2-4 Business Days",

    Badulla: "3-5 Business Days",
    Monaragala: "4-6 Business Days",

    Anuradhapura: "3-5 Business Days",
    Polonnaruwa: "3-5 Business Days",

    Trincomalee: "4-5 Business Days",
    Batticaloa: "4-6 Business Days",
    Ampara: "4-6 Business Days",

    Jaffna: "4-6 Business Days",
    Kilinochchi: "4-6 Business Days",
    Mullaitivu: "5-7 Business Days",
    Mannar: "4-6 Business Days",
    Vavuniya: "4-5 Business Days",
  };

  return deliveryTimes[district] || "Not Available";
};