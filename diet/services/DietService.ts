import { PrismaClient } from "@prisma/client";
import { Diet as DietType } from "../types/types";

const prisma = new PrismaClient();

export const DietService = {
  // Create a new diet with all related data
  async createDiet(clientId: number, dietData: DietType) {
    try {
      // Create the diet first
      const diet = await prisma.diet.create({
        data: {
          clientId,
          tarih: dietData.Tarih ? new Date(dietData.Tarih) : null,
          su: dietData.Su,
          sonuc: dietData.Sonuc,
          hedef: dietData.Hedef,
          fizik: dietData.Fizik,
          // Create the oguns and menu items in a nested create
          oguns: {
            create: dietData.Oguns.map((ogun) => ({
              name: ogun.name,
              time: ogun.time,
              detail: ogun.detail,
              order: ogun.order,
              // Create menu items for each ogun
              items: {
                create: ogun.items
                  .filter((item) => item.besin && item.besin.trim() !== "")
                  .map((item) => ({
                    miktar: item.miktar,
                    // Connect or create the besin
                    besin: {
                      connectOrCreate: {
                        where: { name: item.besin },
                        create: { name: item.besin },
                      },
                    },
                    // Connect or create the birim if it exists
                    ...(item.birim && item.birim.trim() !== ""
                      ? {
                          birim: {
                            connectOrCreate: {
                              where: { name: item.birim },
                              create: { name: item.birim },
                            },
                          },
                        }
                      : {}),
                  })),
              },
            })),
          },
        },
        include: {
          oguns: {
            include: {
              items: {
                include: {
                  besin: true,
                  birim: true,
                },
              },
            },
          },
          client: true,
        },
      });

      return diet;
    } catch (error) {
      console.error("Error creating diet:", error);
      throw error;
    }
  },

  // Get a single diet by id with all related data
  async getDiet(id: number) {
    try {
      const diet = await prisma.diet.findUnique({
        where: { id },
        include: {
          oguns: {
            orderBy: { order: "asc" },
            include: {
              items: {
                include: {
                  besin: true,
                  birim: true,
                },
              },
            },
          },
          client: true,
        },
      });

      return diet;
    } catch (error) {
      console.error("Error getting diet:", error);
      throw error;
    }
  },

  // Get all diets for a specific client
  async getClientDiets(clientId: number) {
    try {
      const diets = await prisma.diet.findMany({
        where: { clientId },
        orderBy: { createdAt: "desc" },
        include: {
          oguns: {
            orderBy: { order: "asc" },
            include: {
              items: {
                include: {
                  besin: true,
                  birim: true,
                },
              },
            },
          },
        },
      });

      return diets;
    } catch (error) {
      console.error("Error getting client diets:", error);
      throw error;
    }
  },

  // Delete a diet and all related data
  async deleteDiet(id: number) {
    try {
      // Prisma will automatically delete related oguns and menu items
      // because of the onDelete: Cascade setting
      const diet = await prisma.diet.delete({
        where: { id },
      });

      return diet;
    } catch (error) {
      console.error("Error deleting diet:", error);
      throw error;
    }
  },
};

export default DietService;
