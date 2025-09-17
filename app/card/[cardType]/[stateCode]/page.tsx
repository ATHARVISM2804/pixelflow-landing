import CardMaker from "@/pages/CardMaker";
import ProfileCheckRoute from "@/auth/ProfileCheckRoute";

// Generate static params for all card types and states
export async function generateStaticParams() {
  const cardTypes = ['aadhar', 'aapar', 'abc', 'ayushman', 'ration', 'voter', 'driving'];
  const states = ['mh', 'hp', 'pb', 'gj', 'rj', 'up', 'br', 'wb', 'tn', 'ka', 'kl', 'ap', 'ts', 'or', 'jh', 'as', 'hr', 'mp', 'cg', 'uk'];
  
  const params = [];
  for (const cardType of cardTypes) {
    for (const stateCode of states) {
      params.push({ cardType, stateCode });
    }
  }
  
  return params;
}

export default function CardMakerPage() {
  return (
    <ProfileCheckRoute>
      <CardMaker />
    </ProfileCheckRoute>
  );
}