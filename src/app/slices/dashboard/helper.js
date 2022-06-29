const fakeCostAndDate = [
  {
    date: 'January',
    cost: 0,
  },
  {
    date: 'February',
    cost: 0,
  },
  {
    date: 'March',
    cost: 0,
  },
  {
    date: 'April',
    cost: 0,
  },
  {
    date: 'May',
    cost: 0,
  },
  {
    date: 'June',
    cost: 0,
  },
  {
    date: 'July',
    cost: 0,
  },
  {
    date: 'August',
    cost: 0,
  },
  {
    date: 'September',
    cost: 0,
  },
  {
    date: 'October',
    cost: 0,
  },

  {
    date: 'November',
    cost: 0,
  },
  {
    date: 'December',
    cost: 0,
  },
];

export function getCostAndDateData(payload) {
  let arr = [];
  const dataFromSV = payload.result;
  arr = fakeCostAndDate.map((obj) => {
    dataFromSV?.forEach((pObj) => {
      if (pObj?.date === obj.date) {
        obj = {...pObj, cost: pObj.cost};
      } else {
        obj = {...obj, cost: 0};
      }
    });
    return obj;
  });

  return arr;
}
