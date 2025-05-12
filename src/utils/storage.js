export const getCustomTitle = () => {
  return localStorage.getItem('customTitle') || '宝宝成长日记';
};

export const setCustomTitle = (title) => {
  localStorage.setItem('customTitle', title);
};
