import CardMaker from "@/pages/CardMaker";
import ProfileCheckRoute from "@/auth/ProfileCheckRoute";

// Generate static params for all card types and states
export async function generateStaticParams() {
  const cardTypes = ['aadhar', 'aapar', 'abc', 'ayushman', 'ration', 'voter', 'driving'];
  const states = [
    // States
    'ap', 'ar', 'as', 'br', 'cg', 'ga', 'gj', 'hr', 'hp', 'jh', 'ka', 'kl', 'mp', 'mh', 
    'mn', 'ml', 'mz', 'nl', 'or', 'pb', 'rj', 'sk', 'tn', 'tg', 'tr', 'up', 'uk', 'wb',
    // Union Territories  
    'an', 'ch', 'dl', 'dd', 'dn', 'jk', 'la', 'ld', 'py'
  ];
  
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