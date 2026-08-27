import type { CityRanking } from "@/types";
import { CityRow } from "./CityRow";

interface CityRankingListProps {
  rankings: CityRanking[];
}

export function CityRankingList({ rankings }: CityRankingListProps) {
  return (
    <div className="flex flex-col gap-2">
      {rankings.map((ranking) => (
        <CityRow key={ranking.cityId} ranking={ranking} />
      ))}
    </div>
  );
}
