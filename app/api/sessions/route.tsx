import { NextApiRequest, NextApiResponse } from "next";
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
  environment: process.env.PINECONE_ENVIRONMENT as string,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const index = pinecone.index("justice");

    const queryResponse = await index.query({
      topK: 10,
      vector: Array(1536).fill(0),
      includeMetadata: true,
    });

    const sessions = queryResponse.matches?.map((match, index) => ({
      id: match.id || index + 1,
      date: match.metadata?.date || "Unknown Date",
      file: match.metadata?.file || "No File",
    }));

    return res.status(200).json(sessions || []);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
