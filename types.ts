
export interface Recipe {
  id: string;
  title: string;
  category: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  time: string;
  image: string;
  ingredients: string[];
}

export interface MenuItem {
  day: string;
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  youtubeQuery?: string;
  links?: { title: string; uri: string }[];
  audioBase64?: string;
}

export interface User {
  name: string;
  email: string;
  weight: number;
  targetWeight: number;
}
