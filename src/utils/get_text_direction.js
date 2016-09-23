import RTLCharactersRegExp from './rtl_chars_regexp';
import NeutralCharactersRegExp from './neutral_chars_regexp';

const startsWithRTL = new RegExp('^(?:' + NeutralCharactersRegExp + ')*(?:' + RTLCharactersRegExp + ')');
const neutralText = new RegExp('^(?:' + NeutralCharactersRegExp + ')*$');

export default (text) => {
    if (startsWithRTL.test(text)) {
        return 'rtl';
    } else if (neutralText.test(text)) {
        return null;
    }
    return 'ltr';
}
