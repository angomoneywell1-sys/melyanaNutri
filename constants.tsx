
import { Recipe, MenuItem, ShoppingItem } from './types';

export const RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Bowl de Açaí Proteico',
    category: 'Café da Manhã',
    calories: 340,
    macros: { protein: 25, carbs: 45, fats: 8 },
    time: '10 min',
    image: 'https://picsum.photos/seed/acai/400/300',
    ingredients: ['100g polpa de açaí', '30g whey protein baunilha', '1 banana', 'Granola zero açúcar']
  },
  {
    id: '2',
    title: 'Salmão com Aspargos',
    category: 'Almoço',
    calories: 420,
    macros: { protein: 35, carbs: 12, fats: 22 },
    time: '25 min',
    image: 'https://picsum.photos/seed/salmon/400/300',
    ingredients: ['150g filé de salmão', '1 maço de aspargos', 'Azeite de oliva', 'Limão siciliano']
  },
  {
    id: '3',
    title: 'Panqueca de Aveia e Cacau',
    category: 'Lanche',
    calories: 280,
    macros: { protein: 18, carbs: 32, fats: 6 },
    time: '15 min',
    image: 'https://picsum.photos/seed/pancakes/400/300',
    ingredients: ['2 ovos', '3 colheres de aveia', '1 colher de cacau 100%', 'Mel a gosto']
  }
];

export const WEEKLY_MENU: MenuItem[] = [
  { day: 'Segunda', breakfast: 'Omelete de claras', lunch: 'Frango com batata doce', snack: 'Iogurte com frutas', dinner: 'Sopa de legumes' },
  { day: 'Terça', breakfast: 'Bowl de açaí', lunch: 'Salmão grelhado', snack: 'Mix de castanhas', dinner: 'Salada completa com atum' },
  { day: 'Quarta', breakfast: 'Tapioca com queijo', lunch: 'Patinho moído com brócolis', snack: 'Shake proteico', dinner: 'Omelete com espinafre' },
  { day: 'Quinta', breakfast: 'Panqueca de aveia', lunch: 'Tilápia com purê de abóbora', snack: 'Fruta com pasta de amendoim', dinner: 'Creme de abobrinha' },
  { day: 'Sexta', breakfast: 'Pão integral com ovos', lunch: 'Strogonoff fit de frango', snack: 'Barra de proteína', dinner: 'Wrap integral de frango' }
];

export const SHOPPING_LIST: ShoppingItem[] = [
  { id: '1', name: 'Peito de frango', category: 'Proteínas', checked: false },
  { id: '2', name: 'Ovos caipira', category: 'Proteínas', checked: true },
  { id: '3', name: 'Batata doce', category: 'Carboidratos', checked: false },
  { id: '4', name: 'Brócolis', category: 'Vegetais', checked: false },
  { id: '5', name: 'Mix de folhas', category: 'Vegetais', checked: true },
  { id: '6', name: 'Pasta de amendoim', category: 'Gorduras', checked: false }
];
