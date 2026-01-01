export const validateSriLankanMobile = (mobile) => {
  
  const cleaned = mobile.replace(/\s+|-|\(|\)/g, '');
  
  
  if (!/^0\d{9}$/.test(cleaned)) {
    return false;
  }
  
  
  const validPrefixes = ['70', '71', '72', '74', '75', '76', '77', '78'];
  const prefix = cleaned.substring(0, 2);
  return validPrefixes.includes(prefix);
};

export const formatMobileNumber = (mobile) => {
  const cleaned = mobile.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+94 ${cleaned.substring(1)}`;
  }
  return mobile;
};