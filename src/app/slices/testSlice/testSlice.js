import {createSlice} from '@reduxjs/toolkit';

// Config slice
export const testSlice = createSlice({
  name: 'test',
  initialState: {
    idCategory: "",
    dataTree: []
  },
  reducers: {
    setValue: (state, action) => {
      state.idCategory = action.payload;
    },
    setTree: (state, action) => {
      const arr = JSON.parse(JSON.stringify(state.dataTree));
      const key = (action.payload).key;
      const oldData = arr.filter(x => x.key === key)[0];
      if(oldData !== undefined)
      {
        arr.filter(x => x.key === key)[0].children = []
        arr.filter(x => x.key === key)[0].children = action.payload.children;
      }
      else{
        arr.push(action.payload); 
      }
      state.dataTree = arr;
    },
    deleteNodeTree: (state, action) => {
      const arr = JSON.parse(JSON.stringify(state.dataTree));
      const key = action.payload;
      const oldData = arr.filter(x => x.key === key)[0];
      if(oldData !== undefined)
      {
        arr.splice(arr.indexOf(oldData), 1);
      }
      state.dataTree = arr;
    }
  }
});

// Select state currentUser from slice
export const {setValue, setTree, deleteNodeTree} = testSlice.actions;
export const selectValue = (state) => state.test.idCategory;
export const selectDataTree = (state) => state.test.dataTree;
// Export reducer
export default testSlice.reducer;
