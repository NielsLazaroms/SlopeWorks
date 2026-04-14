import {SectionTitleVariants} from './section-titleVariants';

export interface SectionTitleTypes {
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size: SectionTitleVariants['size'];
  shadow: SectionTitleVariants['shadow'];
  showUnderLine: SectionTitleVariants['showUnderLine'];
  textPosition: SectionTitleVariants['textPosition'];
  textColor: SectionTitleVariants['textColor'];
  underlineColor?: SectionTitleVariants['underlineColor'];
  fontWeight: SectionTitleVariants['fontWeight'];
  textStroke: SectionTitleVariants['textStroke'];
}
