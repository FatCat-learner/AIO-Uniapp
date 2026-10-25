/** 时段问候表的一行：hour < until 时用该词 */
export interface GreetingStep {
  until: number;
  word: string;
}
