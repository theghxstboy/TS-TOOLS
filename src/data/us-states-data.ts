export interface StateMarketingData {
  id: string;
  name: string;
  holidays: string[];
  climateSeasons: string[];
  culturalEvents: string[];
  workWindow: string;
  isPlaceholder?: boolean;
}

export const US_STATES_DATA: Record<string, StateMarketingData> = {
  MA: {
    id: "MA",
    name: "Massachusetts",
    holidays: [
      "Patriots' Day (Third Monday of April) - Commemorates the Battles of Lexington and Concord",
      "Juneteenth (June 19) - Official State Holiday"
    ],
    climateSeasons: [
      "Nor'easters (Winter) - Powerful storms with high winds and heavy coastal rain/snow",
      "Blizzard Season (December – March) - Heavy snowfall peaks",
      "Fall Foliage (September – October) - High tourism, stable weather"
    ],
    culturalEvents: [
      "The Big E (Eastern States Exposition, September) - Largest fair in the Northeast",
      "Boston Marathon (April) - Held on Patriots' Day",
      "Head of the Charles Regatta (October) - Major annual rowing event"
    ],
    workWindow: "The Window for exterior work (roofing, siding, decks) is best from May to October. Interior remodeling (kitchens/baths) peaks in Winter (December-March)."
  },
  FL: {
    id: "FL",
    name: "Florida",
    holidays: ["Pascua Florida Day (April 2)", "Juneteenth (June 19)"],
    climateSeasons: ["Hurricane Season (June-Nov)", "Dry Season (Nov-May)"],
    culturalEvents: ["Florida State Fair (Feb)", "Gasparilla (Jan/Feb)"],
    workWindow: "Best for exterior work: October to May. Avoid roof work in Summer afternoons."
  },
  TX: { id: "TX", name: "Texas", holidays: ["TX Independence Day (Mar 2)"], climateSeasons: [], culturalEvents: [], workWindow: "Spring/Fall", isPlaceholder: true },
  CA: { id: "CA", name: "California", holidays: ["Cesar Chavez Day (Mar 31)"], climateSeasons: [], culturalEvents: [], workWindow: "Year-round", isPlaceholder: true },
  // ... placeholders remain for others
  NY: { id: "NY", name: "New York", holidays: [], climateSeasons: [], culturalEvents: [], workWindow: "N/A", isPlaceholder: true },
  IL: { id: "IL", name: "Illinois", holidays: [], climateSeasons: [], culturalEvents: [], workWindow: "N/A", isPlaceholder: true },
  PA: { id: "PA", name: "Pennsylvania", holidays: [], climateSeasons: [], culturalEvents: [], workWindow: "N/A", isPlaceholder: true },
  OH: { id: "OH", name: "Ohio", holidays: [], climateSeasons: [], culturalEvents: [], workWindow: "N/A", isPlaceholder: true },
  GA: { id: "GA", name: "Georgia", holidays: [], climateSeasons: [], culturalEvents: [], workWindow: "N/A", isPlaceholder: true },
  NC: { id: "NC", name: "North Carolina", holidays: [], climateSeasons: [], culturalEvents: [], workWindow: "N/A", isPlaceholder: true },
  MI: { id: "MI", name: "Michigan", holidays: [], climateSeasons: [], culturalEvents: [], workWindow: "N/A", isPlaceholder: true },
  AZ: { id: "AZ", name: "Arizona", holidays: [], climateSeasons: [], culturalEvents: [], workWindow: "N/A", isPlaceholder: true },
  WA: { id: "WA", name: "Washington", holidays: [], climateSeasons: [], culturalEvents: [], workWindow: "N/A", isPlaceholder: true },
  // We'll fill others as needed, focus on MA now
};
