export interface PcBuild {
  id: string;
  badge: string;
  name: string;
  category: 'office' | 'gaming' | 'pro';
  tagline: string;
  price: number;
  formattedPrice: string;
  specs: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    motherboard?: string;
    cooling?: string;
    powerSupply?: string;
  };
  fpsHighlights: {
    game: string;
    fps: string;
  }[];
  image: string;
  popular?: boolean;
}

export interface Advantage {
  id: string;
  iconName: string;
  title: string;
  description: string;
  highlight: string;
}

export interface WorkStep {
  step: number;
  title: string;
  description: string;
  iconName: string;
}

export interface OrderFormData {
  name: string;
  phone: string;
  budget: string;
  purpose: string;
  needAssemblyHelp: boolean;
  preferredBuild?: string;
}
