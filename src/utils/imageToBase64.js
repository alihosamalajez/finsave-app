export const getBase64ImageFromUrl = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject("فشل التحويل إلى base64");
    reader.readAsDataURL(blob);
  });
};
