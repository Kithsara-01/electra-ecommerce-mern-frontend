import { supabase } from "../services/supabase";

export const uploadProductImages = async (images) => {
  const uploadedUrls = [];

  for (const image of images) {
    const fileName = `${Date.now()}-${image.name}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(fileName, image);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(fileName);

    uploadedUrls.push(data.publicUrl);
  }

  return uploadedUrls;
};


export const deleteProductImages = async (imageUrls) => {

  if (!imageUrls || imageUrls.length === 0) {
    return;
  }

  const fileNames = imageUrls.map((url) => {
    return url.split("/").pop();
  });

  const { error } = await supabase.storage
    .from("images")
    .remove(fileNames);

  if (error) {
    throw error;
  }

};