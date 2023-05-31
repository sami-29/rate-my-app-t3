import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const data = await req.body;
    console.log(data);
    const donation = await prisma.donation.create({
      data: {
        amount: data.amount,
        appId: data.appId,
        userId: data.userId,
      },
    });

    res.json({
      id: donation.id,
    });
  } else if (req.method === "GET") {
    const { id, userId, appId } = req.query;

    if (id) {
      const donation = await prisma.donation.findUnique({
        where: {
          id: String(id),
        },
      });

      if (donation) {
        res.json(donation);
      } else {
        res.status(404).json({ error: "Donation not found" });
      }
    } else if (userId) {
      const donationsByUser = await prisma.donation.findMany({
        where: {
          userId: String(userId),
        },
      });

      res.json(donationsByUser);
    } else if (appId) {
      const donationsByApp = await prisma.donation.findMany({
        where: {
          appId: String(appId),
        },
      });

      res.json(donationsByApp);
    } else {
      const donations = await prisma.donation.findMany();
      res.json(donations);
    }
  }
};

export default handler;
