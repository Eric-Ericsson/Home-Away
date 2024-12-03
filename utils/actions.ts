"use server";

import db from "./db";
import { auth, clerkClient, currentUser, getAuth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  imageSchema,
  profileSchema,
  propertySchema,
  validateWithZodSchema,
} from "./schemas";
import { uploadImage } from "./superbase";

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) throw new Error("You must to logged in to access this route");
  if (!user.privateMetadata.hasProfile) redirect("/profile/create");
  return user;
};

const renderError = (error: any): { message: string } => {
  return {
    message: error instanceof Error ? error.message : "An error occurred",
  };
};

export const createProfileAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Please login to create a profile");

    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? "",
        ...validatedFields,
      },
    });
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
  redirect("/");
};

export const fetchProfileImage = async () => {
  const user = await currentUser();
  if (!user) return null;
  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      profileImage: true,
    },
  });
  return profile?.profileImage;
};

export const fetchProfile = async () => {
  const user = await getAuthUser();
  const profile = await db.profile.findUnique({
    where: { clerkId: user.id },
  });
  if (!profile) redirect("/profile/create");
  return profile;
};

export const updateProfileAction = async (
  prevState: any,
  formDate: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formDate);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: validatedFields,
    });

    revalidatePath("/profile");
  } catch (error) {
    return renderError(error);
  }

  return { message: "update profile action" };
};

export const updateProfileImageAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser();
  try {
    // Extract image file from formData
    const file = formData.get("image") as File;

    // Validate file properties using imageSchema
    const validatedFields = validateWithZodSchema(imageSchema, {
      image: {
        size: file.size,
        type: file.type,
        name: file.name,
        lastModified: file.lastModified,
      },
    });

    // If validation passes, upload the actual file
    if (validatedFields.image) {
      const fullPath = await uploadImage(file);

      await db.profile.update({
        where: {
          clerkId: user.id,
        },
        data: {
          profileImage: fullPath,
        },
      });
    } else {
      throw new Error("Image validation failed");
    }

    revalidatePath("/profile");
    return { message: "Profile image updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const createPropertyAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);
    const file = formData.get("image") as File;

    const validatedFields = validateWithZodSchema(propertySchema, rawData);
    // const validatedFile = validateWithZodSchema(imageSchema, )
    const validatedFile = validateWithZodSchema(imageSchema, {
      image: {
        size: file.size,
        type: file.type,
        name: file.name,
        lastModified: file.lastModified,
      },
    });

    if (validatedFile.image) {
      const fullPath = await uploadImage(file);

      await db.property.create({
        data: {
          ...validatedFields,
          image: fullPath,
          profileId: user.id,
        },
      });
    }
  } catch (error) {
    return renderError(error);
  }
  redirect("/");
};

export const fetchProperties = async ({
  search = "",
  category,
}: {
  search?: string;
  category?: string;
}) => {
  const properties = await db.property.findMany({
    where: {
      category,
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { tagline: { contains: search, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      image: true,
      tagline: true,
      country: true,
      price: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return properties;
};
