/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  id: string;
  title: string;
  description: string;
  priceFrom: number;
  unit: string;
  iconName: string;
  features: string[];
}

export interface CalculatorParams {
  serviceId: string;
  diameter: number; // in cm
  distanceToBuildings: 'safe' | 'close' | 'danger'; // safe: empty field, close: <= 5m, danger: directly over roof/wires
  count: number;
  hasPowerLines: boolean;
  needsStumpRemoval: boolean;
  needsCleanUp: boolean;
}

export interface CaseStudy {
  id: string;
  title: string;
  location: string;
  description: string;
  duration: string;
  equipment: string[];
  tasks: string[];
  images: string[];
  url: string;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'pricing' | 'safety' | 'process' | 'general';
}

export interface CallRequest {
  id: string;
  name: string;
  phone: string;
  serviceId: string;
  treeInfo?: string;
  photoUrl?: string;
  timestamp: number;
  status: 'new' | 'completed';
}
