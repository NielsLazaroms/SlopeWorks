import {SectionTitleVariants} from './section-titleVariants';

export interface SectionTitleTypes {
  text: string;
  size: SectionTitleVariants['size'];
  shadow: SectionTitleVariants['shadow'];
  showUnderLine: SectionTitleVariants['showUnderLine'];
  textPosition: SectionTitleVariants['textPosition'];
  textColor: SectionTitleVariants['textColor'];
  underlineColor?: SectionTitleVariants['underlineColor'];
  fontWeight: SectionTitleVariants['fontWeight'];
  textStroke: SectionTitleVariants['textStroke'];
}
