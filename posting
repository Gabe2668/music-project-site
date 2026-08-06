// api/create-review.js
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'your_project_id',
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN, // Your secret key
  useCdn: false,
});

export async function POST(req) {
  const body = await req.json();
  
  const newReview = await client.create({
    _type: 'review',
    title: body.title,
    artist: body.artist,
    year: body.year,
    coverUrl: body.coverUrl,
    rating: body.rating, // e.g., "CLASSIC", "8/10"
    reviewText: body.reviewText,
    createdAt: new Date().toISOString(),
  });

  return Response.json({ success: true, id: newReview._id });
}
