import { virtucobrosAgent } from './virtucobros';
import { simulatedHumanAgent } from '../customerServiceRetail/simulatedHuman';

(virtucobrosAgent.handoffs as any).push(simulatedHumanAgent);

export const virtucobrosScenario = [
  virtucobrosAgent,
  simulatedHumanAgent,
];

export const virtucobrosCompanyName = 'Virtucobros';
