import StateCards from "@/pages/StateCards";

// Generate static params for all states
export async function generateStaticParams() {
  const states = ['mh', 'hp', 'pb', 'gj', 'rj', 'up', 'br', 'wb', 'tn', 'ka', 'kl', 'ap', 'ts', 'or', 'jh', 'as', 'hr', 'mp', 'cg', 'uk'];
  
  return states.map((stateCode) => ({
    stateCode,
  }));
}

export default function StateCardsPage() {
  return <StateCards />;
}