import StateCards from "@/pages/StateCards";

// Generate static params for all states
export async function generateStaticParams() {
  const states = [
    // States
    'ap', 'ar', 'as', 'br', 'cg', 'ga', 'gj', 'hr', 'hp', 'jh', 'ka', 'kl', 'mp', 'mh', 
    'mn', 'ml', 'mz', 'nl', 'or', 'pb', 'rj', 'sk', 'tn', 'tg', 'tr', 'up', 'uk', 'wb',
    // Union Territories  
    'an', 'ch', 'dl', 'dd', 'dn', 'jk', 'la', 'ld', 'py'
  ];
  
  return states.map((stateCode) => ({
    stateCode,
  }));
}

export default function StateCardsPage() {
  return <StateCards />;
}