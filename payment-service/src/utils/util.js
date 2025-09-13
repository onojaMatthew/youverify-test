import { Sequence } from "../models/sequence";

export const getNextSequenceValue = async (sequenceName) => {
  try {
    const sequence = await Sequence.findOneAndUpdate(
      { name: sequenceName },
      { $inc: { value: 1 }},
      { new: true, upsert: true }
    );

    return sequence.value;
  } catch (err) {
    console.log(err.message)
  }
}


export const otp_code = () => {
  const code = Math.floor(100000 + Math.random() * 900000);
  
  return code;
}

export const formatKeys = (key) => {
  let formattedKey = key.replace(/_/g, " ") // Replace underscores with spaces
        .replace(/([A-Z])/g, " $1") // Split camelCase
        .trim();
  return formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
}

export const generatePaymentId = () => {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substr(2, 5);
  return `PAY-${timestamp}-${randomString}`.toUpperCase();
};

export const generateTransactionId = () => {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substr(2, 5);
  return `TXN-${timestamp}-${randomString}`.toUpperCase();
};