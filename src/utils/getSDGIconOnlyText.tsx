import {
  SDG1, SDG2, SDG3, SDG4, SDG5, SDG6, SDG7, SDG8, SDG9, SDG10, SDG11, SDG12, SDG13, SDG14, SDG15, SDG16, SDG17,
} from '../sdgIconsOnlyText';

export const getSDGIconOnlyText = (SDGGoal: string) => {
  switch (SDGGoal) {
    case 'Goal 1':
      return <SDG1 />;
    case 'Goal 2':
      return <SDG2 />;
    case 'Goal 3':
      return <SDG3 />;
    case 'Goal 4':
      return <SDG4 />;
    case 'Goal 5':
      return <SDG5 />;
    case 'Goal 6':
      return <SDG6 />;
    case 'Goal 7':
      return <SDG7 />;
    case 'Goal 8':
      return <SDG8 />;
    case 'Goal 9':
      return <SDG9 />;
    case 'Goal 10':
      return <SDG10 />;
    case 'Goal 11':
      return <SDG11 />;
    case 'Goal 12':
      return <SDG12 />;
    case 'Goal 13':
      return <SDG13 />;
    case 'Goal 14':
      return <SDG14 />;
    case 'Goal 15':
      return <SDG15 />;
    case 'Goal 16':
      return <SDG16 />;
    case 'Goal 17':
      return <SDG17 />;
    default:
      return null;
  }
};
