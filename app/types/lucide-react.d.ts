declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    stroke?: string | number;
  }

  export type Icon = FC<IconProps>;

  export const Loader2: Icon;
  export const Search: Icon;
  export const Menu: Icon;
  export const BookOpen: Icon;
  export const Rocket: Icon;
  export const Award: Icon;
  export const Zap: Icon;
  export const Brain: Icon;
  export const Code: Icon;
  export const Info: any;
}