// we are considering that "place" is a number from 1 to 10
export const getPostfixedPlace = (place: number) => {
  switch (place) {
    case 1:
      return '1st';
    case 2:
      return '2nd';
    case 3:
      return '3rd';
    default:
      return `${place}th`;
  }
};
