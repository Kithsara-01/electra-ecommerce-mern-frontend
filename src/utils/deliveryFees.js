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