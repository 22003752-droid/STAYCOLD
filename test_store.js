const { createStore } = require('zustand/vanilla');

const store = createStore((set, get) => ({
  categories: ['A', 'B'],
  addCategory: (category) => set((state) => {
    if (state.categories.includes(category)) return state;
    return { categories: [...state.categories, category] };
  })
}));

console.log("Before:", store.getState().categories);
store.getState().addCategory("Test");
console.log("After:", store.getState().categories);
