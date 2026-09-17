export interface ArchetypeDishItem {
  name: string;
  portion: string;
  cal: number;
  p: number;
  c: number;
  f: number;
  keyword: string;
  benefit: string;
}

export interface ConditionRecipeArchetype {
  subtitleTags: string[];
  dietTips: string[];
  foodsToInclude: string;
  foodsToAvoid: string;
  breakfastDishes: ArchetypeDishItem[];
  lunchDishes: ArchetypeDishItem[];
  snackDishes: ArchetypeDishItem[];
  dinnerDishes: ArchetypeDishItem[];
  bedtimeDishes: ArchetypeDishItem[];
}
