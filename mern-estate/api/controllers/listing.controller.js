import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

// import mongoose from "mongoose";
// import cloudinary from "cloudinary"

// cloudinary.config({
//   cloud_name: "dsz2o8e08",
//   api_key: "328937596942251",
//   api_secret: "ZpLngLf-GAvAhWVIYNd7qQHqhso",
//   secure: true,
// });

export const createListing = async (req, res, next) => {
  try {
    console.log("Inside createListing");
    const listing = await Listing.create(req.body);   
    return res.status(201).json(listing);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// export const createListing = async (req, res) => {
//   const { name, description, address, regularPrice, discountPrice, bathrooms, bedrooms, furnished, parking, type, offer, imageUrls, userRef } = req.body;

//   // Validate request body
//   if (!name || !description || !address || !regularPrice || !discountPrice || !bathrooms || !bedrooms || !furnished || !parking || !type || !offer || !userRef) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   try {
//     // Upload the photo to Cloudinary
//     const imageUrlsResult = await cloudinary.uploader.upload(imageUrls, {
//       folder: "imageUrls",
//     });

//     // Create a new listing with the photo information
//     const listing = await Listing.create({
//       name, description, address, regularPrice, discountPrice, bathrooms, bedrooms, furnished, parking, type, offer, userRef,
//       imageUrls: {
//         public_id: imageUrlsResult.public_id,
//         url: imageUrlsResult.secure_url,
//       },
//     });

//     res.status(200).json(listing);
//   } catch (error) {
//     console.error("Error uploading photo:", error);
//     res.status(400).json({ error: "Failed to upload photo" });
//   }
// };

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
